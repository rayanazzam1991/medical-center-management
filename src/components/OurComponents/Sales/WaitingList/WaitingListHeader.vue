<script lang="ts">
import { useI18n } from "vue-i18n"
import { Employee, EmployeeSearchFilter } from "/@src/models/Employee/employee"
import { Department, DepartmentSearchFilter } from "/@src/models/Others/Department/department"
import { Room, RoomSearchFilter } from "/@src/models/Others/Room/room"
import { UserStatusConsts } from "/@src/models/Others/UserStatus/userStatus"
import { defaultWaitingListSearchFilter } from "/@src/models/Sales/WaitingList/waitingList"
import { getEmployeesList } from "/@src/services/Employee/employeeService"
import { getDepartmentsList } from "/@src/services/Others/Department/departmentService"
import { getRoomsList } from "/@src/services/Others/Room/roomSevice"
import { BaseConsts } from "/@src/utils/consts/base"


export default defineComponent({
    props: {
        title: {
            type: String,
            default: '',
        },
        button_name: {
            type: String,
            default: '',
        },

    },

    setup(props, context) {
        const { t } = useI18n()
        const searchDepartmentId = ref()
        const searchRoomId = ref()
        const searchProviderId = ref()
        const searchFilter = ref(defaultWaitingListSearchFilter)
        const employeesList = ref<Employee[]>([])
        const roomsList = ref<Room[]>([])
        const departmentsList = ref<Department[]>([])
        const search = () => {
            if (searchRoomId.value && searchDepartmentId.value) {
                const room = roomsList.value.find((roomEl) => roomEl.id == searchRoomId.value)
                if (searchDepartmentId.value != room?.department?.id) {
                    searchDepartmentId.value = undefined
                }
            }
            searchFilter.value = {
                department_id: searchDepartmentId.value,
                provider_id: searchProviderId.value,
                room_id: searchRoomId.value
            }
            context.emit('search', searchFilter.value)

        }
        onMounted(async () => {
            const employeeSearchFilter = {
                user_status_id: UserStatusConsts.ACTIVE,
                per_page: 500
            } as EmployeeSearchFilter
            const { employees } = await getEmployeesList(employeeSearchFilter)
            employeesList.value = employees

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

        })
        const resetFilter = () => {
            searchDepartmentId.value = undefined
            searchProviderId.value = undefined
            searchRoomId.value = undefined
            searchFilter.value.room_id = undefined
            searchFilter.value.department_id = undefined
            searchFilter.value.provider_id = undefined

            context.emit('resetFilter', searchFilter.value)

        }
        return { t, resetFilter, search, departmentsList, roomsList, employeesList, searchRoomId, searchDepartmentId, searchProviderId }
    },


})




</script>

<template>
    <form class="form-layout" v-on:submit.prevent="search">
        <div class="form-outer">
            <div class="form-header stuck-header">
                <div class="form-header-inner">
                    <div class="left my-4 mx-2 ">
                        <div class="columns is-flex is-align-items-center">
                            <VControl class="mr-2 status-input">
                                <VSelect v-model="searchProviderId">
                                    <VOption value="">{{ t('waiting_list.search_filter.provider') }}</VOption>
                                    <VOption v-for="employee in employeesList" :key="employee.id" :value="employee.id">
                                        {{ employee.user.first_name }} {{ employee.user.last_name }}</VOption>
                                </VSelect>
                            </VControl>
                            <VControl class="mr-2 status-input">
                                <VSelect v-model="searchDepartmentId">
                                    <VOption value="">{{ t('waiting_list.search_filter.department') }}</VOption>
                                    <VOption v-for="department in departmentsList" :key="department.id"
                                        :value="department.id">
                                        {{ department.name }}</VOption>
                                </VSelect>
                            </VControl>
                            <VControl class="mr-2 status-input">
                                <VSelect v-model="searchRoomId">
                                    <VOption value="">{{ t('waiting_list.search_filter.room') }}</VOption>
                                    <VOption v-for="room in roomsList" :key="room.id" :value="room.id">
                                        {{ room.department?.name }} #{{ room.number }}</VOption>
                                </VSelect>
                            </VControl>
                            <VIconButton class="mr-2" type="submit" v-on:click="search" icon="feather:search" />
                            <VIconButton class="mr-2" v-on:click="resetFilter" icon="feather:rotate-ccw" :raised="false"
                                color="danger" />
                        </div>
                    </div>
                    <div class="left my-4 mx-2">
                        <div class="columns is-flex is-align-items-center">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</template>

<style   lang="scss">
@import '/@src/scss/styles/tableHeader.scss';
</style>
