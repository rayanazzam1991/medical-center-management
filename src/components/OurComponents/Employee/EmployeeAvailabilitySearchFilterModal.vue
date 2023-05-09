<script lang="ts">
import { useI18n } from "vue-i18n"
import { defaultEmployeeHistorySearchFilter, EmployeeStatusConsts } from "/@src/models/Employee/employeeHistory"
import { getEmployeesList, resetEmployeesAvailabilitySearchFilter } from "/@src/services/Employee/employeeService"
import { Employee, EmployeeSearchFilter } from "/@src/models/Employee/employee"
import { UserStatusConsts } from "/@src/models/Others/UserStatus/userStatus"
import { getDepartmentsList } from "/@src/services/Others/Department/departmentService"
import { Department, DepartmentConsts, DepartmentSearchFilter } from "/@src/models/Others/Department/department"
import { Room, RoomConsts, RoomSearchFilter } from "/@src/models/Others/Room/room"
import { getRoomsList } from "/@src/services/Others/Room/roomSevice"


export default defineComponent({
    props: {
        title: {
            type: String,
            default: '',
        },
        search_filter_popup: {
            default: false,
        },
        is_reseted: {
            type: Boolean,
            default: false,
        }
    },
    emits: ['search_filter_popup', 'search', 'resetFilter'],
    setup(props, context) {
        const { t } = useI18n()
        const departmentsList = ref<Department[]>([])
        const roomsList = ref<Room[]>([])

        const searchEmployeesId = ref<number[] | undefined>()
        const searchRoomId = ref()
        const searchDepartmentId = ref()
        const searchIsAvailability = ref()
        const searchFilter = ref(resetEmployeesAvailabilitySearchFilter())
        let search_filter_popup = computed({
            get: () => props.search_filter_popup as boolean,
            set(value) {
                value = false
                context.emit('search_filter_popup', value)
            },
        })
        const search = () => {
            searchFilter.value = {
                employees_id: searchEmployeesId.value,
                room_id: searchRoomId.value,
                department_id: searchDepartmentId.value,
                is_available: searchIsAvailability.value,
            }
            context.emit('search', searchFilter.value)
            search_filter_popup.value = false
        }
        onMounted(async () => {
            let departmentSearchFilter = {} as DepartmentSearchFilter
            departmentSearchFilter.per_page = 500
            departmentSearchFilter.status = DepartmentConsts.ACTIVE
            const { departments } = await getDepartmentsList(departmentSearchFilter)
            departmentsList.value = departments
            let roomSearchFilter = {} as RoomSearchFilter
            roomSearchFilter.per_page = 500
            roomSearchFilter.status = RoomConsts.ACTIVE
            const { rooms } = await getRoomsList(roomSearchFilter)
            roomsList.value = rooms
        })

        const resetFilter = () => {
            searchEmployeesId.value = undefined
            searchRoomId.value = undefined
            searchDepartmentId.value = undefined
            searchIsAvailability.value = undefined
            searchFilter.value.employees_id = undefined
            searchFilter.value.room_id = undefined
            searchFilter.value.department_id = undefined
            searchFilter.value.is_available = undefined
            context.emit('resetFilter', searchFilter.value)
        }

        return { t, EmployeeStatusConsts, search, resetFilter, search_filter_popup, searchEmployeesId, searchRoomId, searchDepartmentId, searchIsAvailability, UserStatusConsts, getEmployeesList, roomsList, departmentsList }
    },
})
</script>

<template>
    <VModal :title="t('employee_availability.search_filter.title')" :open="search_filter_popup" actions="center"
        @close="search_filter_popup = false">
        <template #content>
            <form class="form-layout" @submit.prevent="">
                <VField class="column filter">
                    <VControl>
                        <Multiselect v-model="searchEmployeesId" mode="multiple"
                            :placeholder="t('employee_availability.search_filter.provider')" :can-clear="true"
                            :close-on-select="false" :filter-results="false" :min-chars="0" :resolve-on-load="false"
                            :infinite="true" :rtl="true" :clear-on-search="true" :delay="0" :searchable="true"
                            :hide-selected="false" :limit="20" :options="async (query: any) => {
                                let employeeSearchFilter = {
                                    is_service_provider: true,
                                    per_page: 100,
                                    user_status_id: UserStatusConsts.ACTIVE,
                                    name: query,
                                } as EmployeeSearchFilter
                                //@ts-ignore
                                const data = await getEmployeesList(employeeSearchFilter)
                                //@ts-ignore
                                return data.employees.map((employee: Employee) => {
                                    return { value: employee.id, label: employee.user.first_name + ' ' + employee.user.last_name }
                                })
                            }" @open="(select$: any) => { if (select$.noOptions) { select$.resolveOptions() } }" />
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl>
                        <VSelect v-model="searchDepartmentId" class="">
                            <VOption value="">{{ t('employee_availability.search_filter.department') }}</VOption>
                            <VOption v-for="department in departmentsList" :key="department.id" :value="department.id">
                                {{ department.name }}
                            </VOption>
                        </VSelect>
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl>
                        <VSelect v-model="searchRoomId" class="">
                            <VOption value="">{{ t('employee_availability.search_filter.room') }}</VOption>
                            <VOption v-for="room in roomsList" :key="room.id" :value="room.id">
                                {{ room.number }} - {{ room.department?.name }}
                            </VOption>
                        </VSelect>
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl>
                        <VRadio v-model="searchIsAvailability" :value="true" class="pr-0"
                            :label="t('employee_availability.search_filter.is_available')" name="is_available"
                            color="success" />

                        <VRadio v-model="searchIsAvailability" :value="false"
                            :label="t('employee_availability.search_filter.is_not_available')" name="is_available"
                            color="danger" />
                    </VControl>
                </VField>
                <VButton type="submit" @click="search" class="is-hidden" />

            </form>
        </template>
        <template #action="{ close }">
            <VButton icon="fas fa-filter" color="primary" raised @click="search">{{ t('modal.buttons.filter') }}</VButton>
        </template>
    </VModal>
</template>

