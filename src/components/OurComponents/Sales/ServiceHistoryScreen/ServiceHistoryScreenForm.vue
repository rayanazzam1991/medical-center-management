<script lang="ts">
import { useHead } from '@vueuse/head';
import { Notyf } from 'notyf';
import { ErrorMessage } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import { useNotyf } from '/@src/composable/useNotyf';
import { CustomerSearchFilter } from '/@src/models/CRM/Customer/customer';
import { Department, DepartmentSearchFilter } from '/@src/models/Others/Department/department';
import { Room, RoomSearchFilter } from '/@src/models/Others/Room/room';
import { Service, ServiceSearchFilter } from '/@src/models/Others/Service/service';
import { defaultCreateUpdateServiceHistoryScreen, CreateUpdateServiceHistoryScreenHelper } from '/@src/models/Sales/ServiceHistoryScreen/serviceHistoryScreen';
import { getDepartmentsList } from '/@src/services/Others/Department/departmentService';
import { getRoomsList } from '/@src/services/Others/Room/roomSevice';
import { getServicesList } from '/@src/services/Others/Service/serviceService';
import { createServiceHistoryScreen, updateServiceHistoryScreen, getServiceHistoryScreenForEdit } from '/@src/services/Sales/ServiceHistoryScreen/serviceHistoryScreenService';
import { useServiceHistoryScreen } from '/@src/stores/Sales/ServiceHistoryScreen/serviceHistoryScreenStore';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { BaseConsts } from '/@src/utils/consts/base';
import sleep from '/@src/utils/sleep';



export default defineComponent({
    props: {
        formType: {
            type: String,
            default: "",
        },
    },
    emits: ["onSubmit"],
    setup(props, context) {
        const { t } = useI18n()
        const viewWrapper = useViewWrapper();
        viewWrapper.setPageTitle(t('service_history_screen.form.page_title'));
        const head = useHead({
            title: t('service_history_screen.form.page_title'),
        })
        const route = useRoute();
        const serviceHistoryScreenId = ref(0);
        // @ts-ignore
        serviceHistoryScreenId.value = route.params?.id as number ?? 0;
        const serviceHistoryScreenStore = useServiceHistoryScreen()
        const notif = useNotyf() as Notyf;
        const formType = ref("");
        formType.value = props.formType;
        const router = useRouter();
        const formTypeName = t(`forms.type.${formType.value.toLowerCase()}`)
        const pageTitle = t('service_history_screen.form.form_header', { type: formTypeName });
        const backRoute = "/service-history-screen";
        const currentServiceHistoryScreen = ref(defaultCreateUpdateServiceHistoryScreen);
        const filtersHelper = ref<CreateUpdateServiceHistoryScreenHelper[]>([]);
        const roomsList = ref<Room[]>([]);
        const departmentsList = ref<Department[]>([]);
        const servicesList = ref<Service[]>([]);
        const isLoading = ref(false)

        const getCurrentServiceHistoryScreen = async () => {
            if (serviceHistoryScreenId.value > 0) {

                const { screen } = await getServiceHistoryScreenForEdit(serviceHistoryScreenId.value);
                currentServiceHistoryScreen.value.name = screen.name
                screen.filters.departments.forEach(department => {
                    filtersHelper.value.push({ model_type: 'Department', model_id: department.id ?? 0 })
                });
                screen.filters.rooms.forEach(room => {
                    filtersHelper.value.push({ model_type: 'Room', model_id: room.id ?? 0 })
                });
                screen.filters.services.forEach(service => {
                    filtersHelper.value.push({ model_type: 'Service', model_id: service.id ?? 0 })
                });
            }

        }

        onMounted(async () => {
            isLoading.value = true
            await getCurrentServiceHistoryScreen();
            if (formType.value == 'Add')
                addFilter({ model_type: undefined, model_id: 0 } as CreateUpdateServiceHistoryScreenHelper)

            const roomSearchFilter = {
                status: BaseConsts.ACTIVE,
                per_page: 500
            } as RoomSearchFilter
            const { rooms } = await getRoomsList(roomSearchFilter)
            roomsList.value = rooms

            const departmentSearchFilter = {
                status: BaseConsts.ACTIVE,
                per_page: 500
            } as DepartmentSearchFilter
            const { departments } = await getDepartmentsList(departmentSearchFilter)
            departmentsList.value = departments

            const serviceSearchFilter = {
                status: BaseConsts.ACTIVE,
                per_page: 500
            } as ServiceSearchFilter
            const { services } = await getServicesList(serviceSearchFilter)
            servicesList.value = services

            isLoading.value = false
        })

        const addFilter = (filter: CreateUpdateServiceHistoryScreenHelper) => {
            filtersHelper.value?.push(filter)
        }
        const removeFilter = (index: number) => {
            if (index !== -1) {
                filtersHelper.value.splice(index, 1);
            }
        }


        const onSubmit = async (method: String) => {
            if (method == "Add") {
                await onSubmitAdd();
            } else if (method == "Edit") {
                await onSubmitEdit();
            } else
                return;
        }

        const validateFilters = () => {
            let missingError = false

            if (currentServiceHistoryScreen.value.name == '') {
                notif.error({ message: t('toast.error.service_history_screen.name_is_required'), duration: 3000 })
                return false
            }
            if (filtersHelper.value.length == 0) {
                notif.error({ message: t('toast.error.service_history_screen.please_add_some_filter'), duration: 3000 })
                return

            }

            filtersHelper.value.forEach((filter) => {
                if (filter.model_id == 0 || filter.model_type == undefined) {
                    notif.error({ message: t('toast.error.service_history_screen.model_id_type_required'), duration: 3000 })
                    missingError = true
                }
            });
            if (missingError)
                return false

            const isDuplicate = hasDups(filtersHelper.value)
            if (isDuplicate) {
                notif.error(t('toast.error.service_history_screen.filters_are_duplicated'))
                return false
            }
            return true
        }
        const hasDups = function (array: CreateUpdateServiceHistoryScreenHelper[]) {

            return array.map(function (value: CreateUpdateServiceHistoryScreenHelper) {
                return value.model_id + (value.model_type ?? 'Service')

            }).some(function (value, index, array) {
                return array.indexOf(value) !== array.lastIndexOf(value);
            })
        }

        const formatData = () => {
            currentServiceHistoryScreen.value.filters.rooms = []
            currentServiceHistoryScreen.value.filters.departments = []
            currentServiceHistoryScreen.value.filters.services = []
            filtersHelper.value.forEach((filter) => {
                if (filter.model_type == 'Room') {
                    currentServiceHistoryScreen.value.filters.rooms.push(filter.model_id)
                } else if (filter.model_type == 'Department') {

                    currentServiceHistoryScreen.value.filters.departments.push(filter.model_id)
                } else if (filter.model_type == 'Service') {
                    currentServiceHistoryScreen.value.filters.services.push(filter.model_id)
                }
            });
        }

        const onSubmitAdd = async () => {
            currentServiceHistoryScreen.value.filters.rooms = []
            currentServiceHistoryScreen.value.filters.departments = []
            currentServiceHistoryScreen.value.filters.services = []
            const isValid = validateFilters()
            if (!isValid)
                return
            formatData()
            const { success, message, screen } = await createServiceHistoryScreen(currentServiceHistoryScreen.value)
            if (success) {
                await sleep(200);
                notif.success(t('toast.success.add'))
                currentServiceHistoryScreen.value.filters.rooms = []
                currentServiceHistoryScreen.value.filters.departments = []
                currentServiceHistoryScreen.value.filters.services = []
                router.push({ path: `/service-history-screen/${screen.id}` });
            }
            else {
                currentServiceHistoryScreen.value.filters.rooms = []
                currentServiceHistoryScreen.value.filters.departments = []
                currentServiceHistoryScreen.value.filters.services = []
                await sleep(200);
                notif.error(message)
            }
        }

        const onSubmitEdit = async () => {
            currentServiceHistoryScreen.value.filters.rooms = []
            currentServiceHistoryScreen.value.filters.departments = []
            currentServiceHistoryScreen.value.filters.services = []
            const isValid = validateFilters()
            if (!isValid)
                return
            formatData()
            const { success, message, screen } = await updateServiceHistoryScreen(serviceHistoryScreenId.value, currentServiceHistoryScreen.value)
            if (success) {
                await sleep(200);
                notif.success(t('toast.success.update'))
                currentServiceHistoryScreen.value.filters.rooms = []
                currentServiceHistoryScreen.value.filters.departments = []
                currentServiceHistoryScreen.value.filters.services = []
                router.push({ path: `/service-history-screen/${screen.id}` });
            }
            else {
                currentServiceHistoryScreen.value.filters.rooms = []
                currentServiceHistoryScreen.value.filters.departments = []
                currentServiceHistoryScreen.value.filters.services = []
                await sleep(200);
                notif.error(message)
            }
        }

        return {
            t, pageTitle, onSubmit, isLoading, viewWrapper, backRoute, serviceHistoryScreenStore, currentServiceHistoryScreen,
            filtersHelper, departmentsList, roomsList, servicesList, removeFilter, addFilter

        };
    },
    components: { ErrorMessage }
})


</script>

<template>
    <div class="page-content-inner">
        <FormHeader :title="pageTitle" :form_submit_name="formType" :back_route="backRoute" type="submit"
            @onSubmit="onSubmit(formType)" :isLoading="isLoading" />
        <form class="form-layout" @submit.prevent="onSubmit(formType)">
            <div class="form-outer">
                <div class="form-body">
                    <VLoader :hidden="!isLoading" size="xl" :active="isLoading">
                        <div class="load">
                        </div>
                    </VLoader>

                    <div :hidden="isLoading" class="form-fieldset">
                        <div class="fieldset-heading">
                            <h4>{{ pageTitle }}</h4>
                        </div>
                        <div class="columns is-multiline">
                            <div class="column is-10">
                                <VField>
                                    <VLabel class="required">{{ t('service_history_screen.form.name') }}</VLabel>
                                    <VControl>
                                        <VInput type="text" v-model="currentServiceHistoryScreen.name" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-12 pb-0 my-0">
                                <div class="columns mb-0" v-if="filtersHelper.length != 0">
                                    <div class="column is-5">
                                        <div class="mb-4">
                                            <p class="label required">
                                                {{ t('service_history_screen.form.select_filter_type') }}</p>
                                        </div>
                                    </div>
                                    <div class="column is-5">
                                        <div class="mb-4">
                                            <p class="label required">
                                                {{ t('service_history_screen.form.select_filter_id') }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="column is-12 py-0 my-0">
                                <div class="columns mb-0" v-for="(filter, mainIndex) in filtersHelper" :key="mainIndex">
                                    <div class="column is-5">
                                        <div class="mb-3">
                                            <VField>
                                                <VControl>
                                                    <VSelect v-model="filtersHelper[mainIndex].model_type">
                                                        <VOption value=""> {{
                                                            t('service_history_screen.form.select_filter_type')
                                                        }}</VOption>
                                                        <VOption value="Room"> {{
                                                            t('service_history_screen.form.room')
                                                        }}</VOption>
                                                        <VOption value="Service"> {{
                                                            t('service_history_screen.form.service')
                                                        }}</VOption>
                                                        <VOption value="Department"> {{
                                                            t('service_history_screen.form.department')
                                                        }}</VOption>
                                                    </VSelect>
                                                </VControl>
                                            </VField>
                                        </div>
                                    </div>
                                    <div class="column is-5">
                                        <div class="mb-3">
                                            <VField>
                                                <VControl>
                                                    <VSelect v-model="filtersHelper[mainIndex].model_id">
                                                        <VOption v-if="filtersHelper[mainIndex].model_type == 'Department'"
                                                            v-for="department in departmentsList" :key="department.id"
                                                            :value="department.id"> {{
                                                                department.name
                                                            }}</VOption>
                                                        <VOption v-else-if="filtersHelper[mainIndex].model_type == 'Room'"
                                                            v-for="room in roomsList" :key="room.id" :value="room.id">
                                                            {{ room.number }} -
                                                            {{ room.department?.name }}
                                                        </VOption>
                                                        <VOption
                                                            v-else-if="filtersHelper[mainIndex].model_type == 'Service'"
                                                            v-for="service in servicesList" :key="service.id"
                                                            :value="service.id">
                                                            {{ service.name }}
                                                        </VOption>
                                                    </VSelect>
                                                </VControl>
                                            </VField>
                                        </div>
                                    </div>
                                    <div class="column is-2 columns is-flex is-align-items-center">
                                        <div class="mb-3 column is-6">
                                            <VField v-if="((mainIndex != 0 && formType == 'Add') || (formType == 'Edit'))">
                                                <VControl>
                                                    <VIconButton icon="feather:trash-2" class="remove_btn"
                                                        @click="removeFilter(mainIndex)" color="danger">
                                                    </VIconButton>
                                                </VControl>
                                            </VField>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="column is-12 pt-1">
                                <VButton @click.prevent="addFilter({
                                    model_id: 0,
                                    model_type: undefined,
                                })" color="primary">
                                    {{ t('service_history_screen.form.add_new_filter') }}
                                </VButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>


    </div>
</template>
<style scoped lang="scss">
@import '/@src/scss/styles/formPage.scss';

.form-fieldset {
    max-width: 50%;
}

.label {
    font-family: var(--font);
    font-size: 0.9rem;
    color: var(--light-text) !important;
    font-weight: 400;
}

.load {
    height: 400px;
    width: 500px;
}
</style>
