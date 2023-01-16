<script  lang="ts">
import { useHead } from '@vueuse/head'
import { ErrorMessage, useForm } from 'vee-validate'
import { getDepartmentsList } from '/@src/services/Others/Department/departmentService'
import { addRoom, editRoom, getRoom } from '/@src/services/Others/Room/roomSevice'
import { useNotyf } from '/@src/composable/useNotyf'
import { defaultDepartment, Department, defaultDepartmentSearchFilter, DepartmentSearchFilter } from '/@src/models/Others/Department/department'
import { defaultRoom, defaultCreateUpdateRoom, Room, RoomConsts, RoomSearchFilter, defaultRoomSearchFilter } from '/@src/models/Others/Room/room'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { roomvalidationSchema } from '/@src/rules/Others/Room/roomValidation'
import sleep from "/@src/utils/sleep"
import { useRoom } from '/@src/stores/Others/Room/roomStore'
import { BaseConsts } from '/@src/utils/consts/base'
import { Notyf } from 'notyf'
import {useI18n} from "vue-i18n";


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
        const viewWrapper = useViewWrapper()
        viewWrapper.setPageTitle('Room')
        const head = useHead({
            title: 'Room',
        })
        const roomStore = useRoom()
        const { t } = useI18n();
        const notif = useNotyf() as Notyf
        const formType = ref('')
        formType.value = props.formType
        const route = useRoute()
        const router = useRouter()

        const pageTitle = formType.value + ' ' + viewWrapper.pageTitle
        const backRoute = '/room'
        const currentRoom = ref(defaultRoom)
        const currentCreateUpdateRoom = ref(defaultCreateUpdateRoom)
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
        }
        const departmentsList = ref<Department[]>([])
        onMounted(async () => {
            let departmentSearchFilter  = {} as DepartmentSearchFilter
            departmentSearchFilter.status = BaseConsts.ACTIVE
            const { departments } = await getDepartmentsList(departmentSearchFilter)
            departmentsList.value = departments
        })
        onMounted(() => {
            getCurrentRoom()
        })
        const validationSchema = roomvalidationSchema

        const { handleSubmit } = useForm({
            validationSchema,
            initialValues: formType.value == "Edit" ? {
                number: currentRoom.value.number ?? undefined,
                floor: currentRoom.value.floor ?? undefined,
                status: currentRoom.value.status ?? 1,
                department_id: currentRoom.value?.department?.id ?? 0,
            } : {
                number: '',
                floor: '',
                status: 1,
                department_id: 0,
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
        const onSubmitAdd = handleSubmit(async (values) => {

            var roomData = currentRoom.value
            var roomForm = currentCreateUpdateRoom.value
            roomForm.floor = roomData.floor
            roomForm.number = roomData.number
            roomForm.department_id = roomData.department?.id
            roomForm.status = roomData.status
            const { room, success, message } = await addRoom(roomForm)
            if (success) {

                // @ts-ignore
                notif.dismissAll()
                await sleep(200);

                // @ts-ignore

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
            var roomForm = currentCreateUpdateRoom.value
            roomForm.id = roomData.id
            roomForm.floor = roomData.floor
            roomForm.number = roomData.number
            roomForm.department_id = roomData.department?.id
            roomForm.status = roomData.status
            const { success, message } = await editRoom(roomForm)
            if (success) {

                // @ts-ignore

                notif.dismissAll()
                await sleep(200);

                // @ts-ignore

                notif.success(t('toast.success.edit'))
                await sleep(500)
                router.push({ path: `/room/${roomData.id}` })
            } else {
                await sleep(200);

                notif.error(message)
            }


        }

        return { pageTitle, onSubmit, currentRoom, viewWrapper, backRoute, RoomConsts, departmentsList, roomStore }
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
                                    <VLabel class="required">{{ viewWrapper.pageTitle }} number</VLabel>
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
                                    <VLabel class="required">{{ viewWrapper.pageTitle }} floor</VLabel>
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
                                    <VLabel class="required">{{ viewWrapper.pageTitle }} department</VLabel>
                                    <VControl>
                                        <VSelect v-if="currentRoom.department" v-model="currentRoom.department.id">
                                            <VOption value="">Department</VOption>
                                            <VOption v-for="department in departmentsList" :key="department.id"
                                                :value="department.id">{{ department.name }}
                                            </VOption>
                                        </VSelect>
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
                                    <VLabel class="required">{{ viewWrapper.pageTitle }} status</VLabel>

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
