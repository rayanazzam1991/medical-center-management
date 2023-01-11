<script lang="ts">
import { Position, PositionSearchFilter } from '/@src/models/Others/Position/position'
import { Department, defaultDepartmentSearchFilter, DepartmentSearchFilter } from '/@src/models/Others/Department/department'
import { UserStatus, defaultUserStatusSearchFilter, UserStatusSearchFilter } from '/@src/models/Others/UserStatus/userStatus'
import { getDepartmentsList } from '/@src/services/Others/Department/departmentService'
import { getPositionsList } from '/@src/services/Others/Position/positionService'
import { getUserStatusesList } from '/@src/services/Others/UserStatus/userstatusService'
import { defaultEmployeeAttendanceSearchFilter } from '/@src/models/HR/Attendance/EmployeeAttendance/employeeAttendance'


export default defineComponent({
    props: {
        search_filter_popup: {
            default: false,
        },

    },

    emits: ['search_filter_popup', 'search', 'resetFilter'],
    setup(props, context) {
        const searchName = ref()
        const searchPhoneNumber = ref()
        const searchPosition = ref()
        const searchDepartment = ref()
        const searchStatus = ref()


        const searchFilter = ref(defaultEmployeeAttendanceSearchFilter)
        let search_filter_popup = computed({
            get: () => props.search_filter_popup as boolean,
            set(value) {
                value = false
                context.emit('search_filter_popup', value)

            },
        })


        const search = () => {
            searchFilter.value = {
                name: searchName.value,
                phone_number: searchPhoneNumber.value,
                user_status_id: searchStatus.value,
                position_id: searchPosition.value,
                department_id: searchDepartment.value,
            }
            context.emit('search', searchFilter.value)
            search_filter_popup.value = false
        }
        const resetFilter = () => {
            searchName.value = undefined
            searchPhoneNumber.value = undefined
            searchStatus.value = undefined
            searchDepartment.value = undefined
            searchPosition.value = undefined
            searchFilter.value.name = undefined
            searchFilter.value.phone_number = undefined
            searchFilter.value.user_status_id = undefined
            searchFilter.value.department_id = undefined
            searchFilter.value.position_id = undefined
            context.emit('resetFilter', searchFilter.value)
        }

        const statusesList = ref<UserStatus[]>([])
        const departmentsList = ref<Department[]>([])
        const positionsList = ref<Position[]>([])
        onMounted(async () => {
            let userStatusSearchFilter = {} as UserStatusSearchFilter
            userStatusSearchFilter.per_page = 500
            const { userstatuses } = await getUserStatusesList(userStatusSearchFilter)
            statusesList.value = userstatuses
            let departmentSearchFilter = {} as DepartmentSearchFilter
            departmentSearchFilter.per_page = 500
            const { departments } = await getDepartmentsList(departmentSearchFilter)
            departmentsList.value = departments
            let positionSearchFilter = {} as PositionSearchFilter
            positionSearchFilter.per_page = 500
            const { positions } = await getPositionsList(positionSearchFilter)
            positionsList.value = positions

        })


        return { search, resetFilter, search_filter_popup, statusesList, departmentsList, positionsList, searchName, searchPhoneNumber, searchStatus, searchDepartment, searchPosition }




    },


})




</script>

<template>
    <VModal title="Filter Employee" :open="search_filter_popup" actions="center" @close="search_filter_popup = false">
        <template #content>
            <form class="form-layout" @submit.prevent="">
                <VField class="column filter">
                    <VControl icon="feather:user">
                        <input v-model="searchName" type="text" class="input " placeholder="Name..." />
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl icon="feather:phone">
                        <input v-model="searchPhoneNumber" type="text" class="input " placeholder="Phone Number..." />
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl>
                        <VSelect v-model="searchStatus" class="">
                            <VOption value="">Status</VOption>
                            <VOption v-for="status in statusesList" :key="status.id" :value="status.id">{{ status.name
}}
                            </VOption>
                        </VSelect>
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl>
                        <VSelect v-model="searchDepartment" class="">
                            <VOption value="">Department</VOption>
                            <VOption v-for="department in departmentsList" :key="department.id" :value="department.id">
                                {{ department.name }}
                            </VOption>
                        </VSelect>
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl>
                        <VSelect v-model="searchPosition" class="">
                            <VOption value="">Position</VOption>
                            <VOption v-for="position in positionsList" :key="position.id" :value="position.id">{{
        position.name
}}
                            </VOption>
                        </VSelect>
                    </VControl>
                </VField>
                <VButton type="submit" @click="search" class="is-hidden" />

            </form>
        </template>
        <template #action="{ close }">
            <VButton icon="fas fa-filter" color="primary" raised @click="search">Filter</VButton>
        </template>
    </VModal>
</template>

   