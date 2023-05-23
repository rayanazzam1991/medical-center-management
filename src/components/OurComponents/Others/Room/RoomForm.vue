<script  lang="ts">
import { useHead } from '@vueuse/head'
import { ErrorMessage, useForm } from 'vee-validate'
import { getDepartmentsList } from '/@src/services/Others/Department/departmentService'
import { addRoom, editRoom, getRoom } from '/@src/services/Others/Room/roomSevice'
import { useNotyf } from '/@src/composable/useNotyf'
import { defaultDepartment, Department, defaultDepartmentSearchFilter, DepartmentSearchFilter, DepartmentConsts } from '/@src/models/Others/Department/department'
import { defaultRoom, defaultCreateUpdateRoom, Room, RoomConsts, RoomSearchFilter, defaultRoomSearchFilter } from '/@src/models/Others/Room/room'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { roomvalidationSchema } from '/@src/rules/Others/Room/roomValidation'
import sleep from "/@src/utils/sleep"
import { useRoom } from '/@src/stores/Others/Room/roomStore'
import { BaseConsts } from '/@src/utils/consts/base'
import { Notyf } from 'notyf'
import { useI18n } from 'vue-i18n'


export default defineComponent({
    props: {
        formType: {
            type: String,
            default: '',
        },
    },
    components: { ErrorMessage },

    emits: ['onSubmit'],
    setup(props, context) {
        const { t } = useI18n()
        const viewWrapper = useViewWrapper()
        viewWrapper.setPageTitle(t('room.form.page_title'))
        const head = useHead({
            title: t('room.form.page_title'),
        })
        const roomStore = useRoom()
        const notif = useNotyf() as Notyf
        const formType = ref('')
        formType.value = props.formType
        const route = useRoute()
        const router = useRouter()
        const formTypeName = t(`forms.type.${formType.value.toLowerCase()}`)
        const pageTitle = t('room.form.form_header', { type: formTypeName });
        const backRoute = '/room'
        const currentRoom = ref(defaultRoom)
        const currentCreateUpdateRoom = ref(defaultCreateUpdateRoom)
        const currentRoomDepartment = ref({
            value: 0, label: t('room.form.department')
        })

        const roomId = ref(0)
        // @ts-ignore
        roomId.value = route.params?.id as number ?? 0
        const getCurrentRoom = async () => {
            if (roomId.value === 0) {
                currentRoom.value.number = 0
                currentRoom.value.floor = 0
                currentRoom.value.department = defaultDepartment
                currentRoom.value.status = 1
                return
            }
            const { room } = await getRoom(roomId.value)
            currentRoom.value = room != undefined ? room : defaultRoom
            currentRoomDepartment.value.value = currentRoom.value.department?.id ?? 0
            currentRoomDepartment.value.label = currentRoom.value.department?.name ?? ''
            setDepartmentId()
        }
        const departmentsList = ref<Department[]>([])
        onMounted(async () => {
            await getCurrentRoom()
            let departmentSearchFilter = {} as DepartmentSearchFilter
            departmentSearchFilter.status = BaseConsts.ACTIVE
            const { departments } = await getDepartmentsList(departmentSearchFilter)
            departmentsList.value = departments
        })
        const validationSchema = roomvalidationSchema

        const { handleSubmit, setFieldValue } = useForm({
            validationSchema,
            initialValues: formType.value == "Edit" ? {
                number: currentRoom.value.number ?? undefined,
                floor: currentRoom.value.floor ?? undefined,
                status: currentRoom.value.status ?? 1,
                department_id: { value: currentRoom.value?.department?.id ?? 0, label: currentRoom.value.department?.name },
            } : {
                number: '',
                floor: '',
                status: 1,
                department_id: { value: 0, label: t('room.form.department') },
            },
        })


        const onSubmit = async (method: String) => {
            if (method == 'Add') {
                await onSubmitAdd()
            }
            else if (method == 'Edit') {
                await onSubmitEdit()
            }
            else return
        }
        const setDepartmentId = () => {
            setFieldValue('department_id', currentRoomDepartment.value)
        }

        const onSubmitAdd = handleSubmit(async (values) => {

            let roomData = currentRoom.value
            let roomForm = currentCreateUpdateRoom.value
            roomForm.floor = roomData.floor
            roomForm.number = roomData.number
            roomForm.department_id = currentRoomDepartment.value.value
            roomForm.status = roomData.status
            const { room, success, message } = await addRoom(roomForm)
            if (success) {
                notif.success(t('toast.success.add'))
                await sleep(500)
                router.push({ path: `/room/${room.id}` })
            } else {
                await sleep(200);

                notif.error(message)
            }

        })
        const onSubmitEdit = async () => {
            const roomData = currentRoom.value
            let roomForm = currentCreateUpdateRoom.value
            roomForm.id = roomData.id
            roomForm.floor = roomData.floor
            roomForm.number = roomData.number
            roomForm.department_id = currentRoomDepartment.value.value
            roomForm.status = roomData.status
            const { success, message } = await editRoom(roomForm)
            if (success) {
                notif.success(t('toast.success.edit'))
                router.push({ path: `/room/${roomData.id}` })
            } else {
                notif.error(message)
            }


        }

        return { t, pageTitle, onSubmit, currentRoom, viewWrapper, backRoute, RoomConsts, departmentsList, roomStore, setDepartmentId, DepartmentConsts, getDepartmentsList, currentRoomDepartment }
    },


})



</script>

<template>
    <div class="page-content-inner">
        <FormHeader :title="pageTitle" :form_submit_name="formType" :back_route="backRoute" type="submit"
            @onSubmit="onSubmit(formType)" :isLoading="roomStore?.loading" />
        <form class="form-layout" @submit.prevent="onSubmit(formType)">
            <div class="form-outer">
                <div class="form-body">
                    <!--Fieldset-->
                    <div class="form-fieldset">
                        <div class="fieldset-heading">
                            <h4>{{ pageTitle }}</h4>
                        </div>
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField id="number">
                                    <VLabel class="required">{{ t('room.form.number') }}</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="currentRoom.number" type="number" placeholder=""
                                            autocomplete="given-number" />
                                        <ErrorMessage class="help is-danger" name="number" />

                                    </VControl>
                                </VField>
                            </div>
                        </div>
                    </div>
                    <!--Fieldset-->
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField id="floor">
                                    <VLabel class="required">{{ t('room.form.floor') }}</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="currentRoom.floor" type="number" autocomplete="given-floor" />
                                        <ErrorMessage class="help is-danger" name="floor" />
                                    </VControl>
                                </VField>
                            </div>
                        </div>
                    </div>
                    <!--Fieldset-->
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField id="department_id">
                                    <VLabel class="required">{{ t('room.form.department') }}</VLabel>
                                    <VControl>
                                        <Multiselect v-if="currentRoom.department" ref="department_id"
                                            @select="setDepartmentId()" v-model="currentRoomDepartment" mode="single"
                                            :filter-results="false" :placeholder="t('room.form.department')"
                                            :close-on-select="true" :rtl="true" :canClear="false" :searchable="true"
                                            :object="true" :resolve-on-load="false" :max="1" :infinite="true" :limit="20"
                                            :clear-on-search="true" :delay="0" :min-chars="0" :options="async (query: any) => {
                                                let departmentSearchFilter = {
                                                    name: query,
                                                    status: DepartmentConsts.ACTIVE,
                                                    per_page: 500
                                                } as DepartmentSearchFilter
                                                //@ts-ignore
                                                const data = await getDepartmentsList(departmentSearchFilter)
                                                //@ts-ignore
                                                return data.departments.map((department: Department) => {
                                                    return { value: department.id, label: department.name }
                                                })
                                            }"
                                            @open="(select$: any) => { if (select$.noOptions) { select$.resolveOptions() } }" />
                                        <ErrorMessage class="help is-danger" name="department_id" />
                                    </VControl>
                                </VField>
                            </div>
                        </div>
                    </div>
                    <!--Fieldset-->
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField id="status">
                                    <VLabel class="required">{{ t('room.form.status') }}</VLabel>
                                    <VControl>
                                        <VRadio v-model="currentRoom.status" :value="RoomConsts.INACTIVE"
                                            :label="RoomConsts.showStatusName(0)" name="status" color="danger" />

                                        <VRadio v-model="currentRoom.status" :value="RoomConsts.ACTIVE"
                                            :label="RoomConsts.showStatusName(1)" name="status" color="success" />
                                        <ErrorMessage name="status" />
                                    </VControl>
                                </VField>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </form>



    </div>
</template>
<style  scoped lang="scss">
@import '/@src/scss/styles/formPage.scss';
</style>
