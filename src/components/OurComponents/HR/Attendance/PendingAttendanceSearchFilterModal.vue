<script lang="ts">
import { Position, PositionSearchFilter } from '/@src/models/Others/Position/position'
import { Department,  DepartmentSearchFilter } from '/@src/models/Others/Department/department'
import { getDepartmentsList } from '/@src/services/Others/Department/departmentService'
import { getPositionsList } from '/@src/services/Others/Position/positionService'
import { useI18n } from 'vue-i18n'
import { defaultEmployeeAttendanceSearchFilter } from '/@src/models/HR/Attendance/EmployeeAttendance/employeeAttendance'


export default defineComponent({
    props: {
        search_filter_popup: {
            default: false,
        },

    },

    emits: ['search_filter_popup', 'search', 'resetFilter'],
    setup(props, context) {
        const { t } = useI18n()
        const searchName = ref()
        const searchPhoneNumber = ref()
        const searchPosition = ref()
        const searchDepartment = ref()
        const searchDateFrom = ref()
        const searchDateTo = ref()


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
                position_id: searchPosition.value,
                department_id: searchDepartment.value,
                attendance_from: searchDateFrom.value,
                attendance_to: searchDateTo.value
            }
            context.emit('search', searchFilter.value)
            search_filter_popup.value = false
        }
        const resetFilter = () => {
            searchName.value = undefined
            searchPhoneNumber.value = undefined
            searchDateFrom.value = undefined
            searchDateTo.value = undefined
            searchDepartment.value = undefined
            searchPosition.value = undefined
            searchFilter.value.name = undefined
            searchFilter.value.phone_number = undefined
            searchFilter.value.user_status_id = undefined
            searchFilter.value.department_id = undefined
            searchFilter.value.position_id = undefined
            searchFilter.value.attendance_from = undefined
            searchFilter.value.attendance_to = undefined
            context.emit('resetFilter', searchFilter.value)
        }

        const departmentsList = ref<Department[]>([])
        const positionsList = ref<Position[]>([])
        onMounted(async () => {
            let departmentSearchFilter = {} as DepartmentSearchFilter
            departmentSearchFilter.per_page = 500
            const { departments } = await getDepartmentsList(departmentSearchFilter)
            departmentsList.value = departments
            let positionSearchFilter = {} as PositionSearchFilter
            positionSearchFilter.per_page = 500
            const { positions } = await getPositionsList(positionSearchFilter)
            positionsList.value = positions
        })


        return { t, search, resetFilter, search_filter_popup, departmentsList, positionsList, searchName, searchPhoneNumber, searchDepartment, searchPosition, searchDateFrom, searchDateTo }




    },


})




</script>

<template>
    <VModal :title="t('pending_attendances.search_filter.title')" :open="search_filter_popup" actions="center"
        @close="search_filter_popup = false">
        <template #content>
            <form class="form-layout" @submit.prevent="">
                <VField class="column filter">
                    <VControl icon="feather:user">
                        <input v-model="searchName" type="text" class="input "
                            :placeholder="t('pending_attendances.search_filter.name')" />
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl icon="feather:phone">
                        <input v-model="searchPhoneNumber" type="text" class="input "
                            :placeholder="t('pending_attendances.search_filter.phone_number')" />
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl>
                        <VSelect v-model="searchDepartment" class="">
                            <VOption value="">{{ t('pending_attendances.search_filter.department') }}</VOption>
                            <VOption v-for="department in departmentsList" :key="department.id" :value="department.id">
                                {{ department.name }}
                            </VOption>
                        </VSelect>
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl>
                        <VSelect v-model="searchPosition" class="">
                            <VOption value="">{{ t('pending_attendances.search_filter.position') }}</VOption>
                            <VOption v-for="position in positionsList" :key="position.id" :value="position.id">{{
                                position.name
                            }}
                            </VOption>
                        </VSelect>
                    </VControl>
                </VField>
                <div class="column filter columns-is-multiliine">
                    <h1 class="column-is-12">{{ t('pending_attendances.search_filter.date') }}</h1>
                    <VField class="column-is-6 filter">
                        <VLabel>{{ t('pending_attendances.search_filter.from') }} </VLabel>
                        <VControl icon="feather:chevrons-right">
                            <VInput v-model="searchDateFrom" type="date" />
                        </VControl>
                    </VField>
                    <VField class="column-is-6 filter">
                        <VLabel>{{ t('pending_attendances.search_filter.to') }} </VLabel>

                        <VControl icon="feather:chevrons-right">
                            <VInput v-model="searchDateTo" type="date" />
                        </VControl>
                    </VField>
                </div>

                <VButton type="submit" @click="search" class="is-hidden" />

            </form>
        </template>
        <template #action="{ close }">
            <VButton icon="fas fa-filter" color="primary" raised @click="search">{{ t('modal.buttons.filter') }}</VButton>
        </template>
    </VModal>
</template>

   