<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "permissions": [
            "employees_availability_history_list"
        ]
    }
}
</route>
        
<script setup lang="ts">
import VTag from '/@src/components/base/tags/VTag.vue'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { defaultPagination } from '/@src/utils/response'
import { useI18n } from 'vue-i18n'
import { useNotyf } from '/@src/composable/useNotyf'
import { Notyf } from 'notyf'
import { getEmployeeAvailabilityHistoryList, resetEmployeesAvailabilityHistorySearchFilter } from '/@src/services/Employee/employeeAvailabilityHistoryService'
import { EmployeeAvailabilityHistory, EmployeeAvailabilityHistorySearchFilter } from '/@src/models/Employee/employeeAvailabilityHistory'
import { useEmployeeAvaialabilityHistory } from '/@src/stores/Employee/employeeAvailabilityHistoryStore'
export interface EmployeeAvailabilityHistoryTableProps {
    isForEmployee: boolean,
    employeeId: number | undefined
}
const props = withDefaults(defineProps<EmployeeAvailabilityHistoryTableProps>(), {
    isForEmployee: false,
    employeeId: undefined

})

const viewWrapper = useViewWrapper()
const { t } = useI18n()


const notif = useNotyf() as Notyf
const searchFilter = ref(resetEmployeesAvailabilityHistorySearchFilter())
if (props.isForEmployee && props.employeeId) {
    searchFilter.value.employees_id = [props.employeeId]
}
const employeeAvailabilityHistoryList = ref<Array<EmployeeAvailabilityHistory>>([])
const paginationVar = ref(defaultPagination)
const router = useRouter()
const employeeAvailabilityHistoryStore = useEmployeeAvaialabilityHistory()
const keyIncrement = ref(0)
const default_per_page = ref(1)

onMounted(async () => {
    const { employee_availability_history_list, pagination } = await getEmployeeAvailabilityHistoryList(searchFilter.value)
    employeeAvailabilityHistoryList.value = employee_availability_history_list
    paginationVar.value = pagination
    keyIncrement.value = keyIncrement.value + 1
    default_per_page.value = pagination.per_page
});

const search = async (newSearchFilter: EmployeeAvailabilityHistorySearchFilter) => {
    paginationVar.value.per_page = newSearchFilter.per_page ?? paginationVar.value.per_page
    if (props.isForEmployee && props.employeeId) {
        newSearchFilter.employees_id = [props.employeeId]
    }

    const { employee_availability_history_list, pagination } = await getEmployeeAvailabilityHistoryList(newSearchFilter)
    employeeAvailabilityHistoryList.value = employee_availability_history_list
    paginationVar.value = pagination
    searchFilter.value = newSearchFilter
}
const resetFilter = async (newSearchFilter: EmployeeAvailabilityHistorySearchFilter) => {
    if (props.isForEmployee && props.employeeId) {
        newSearchFilter.employees_id = [props.employeeId]
    }
    searchFilter.value = newSearchFilter
    await search(searchFilter.value)
}
const getHistoryPerPage = async (pageNum: number) => {
    searchFilter.value.page = pageNum
    await search(searchFilter.value)
}
const historySort = async (value: string) => {
    if (value != undefined) {
        const [sortField, sortOrder] = value.split(':') as [string, 'desc' | 'asc']
        searchFilter.value.order_by = sortField
        searchFilter.value.order = sortOrder
    }
    else {
        searchFilter.value.order = undefined
        searchFilter.value.order_by = undefined
    }
    await search(searchFilter.value)
}


const columns = {
    employee_name: {
        searchable: true,
        align: 'center',
        label: t('employee_availability_history.table.columns.employee_name'),
        renderRow: (row: EmployeeAvailabilityHistory) =>
            h('span', row.employee.user.first_name + ' ' + row.employee.user.last_name)
    },
    action: {
        searchable: true,
        align: 'center',
        label: t('employee_availability_history.table.columns.action'),
        renderRow: (row: EmployeeAvailabilityHistory) =>
            h(
                VTag,
                {
                    rounded: true,
                    color: row.is_available ? 'success' : 'danger'
                },
                {
                    default() {
                        return row.is_available ? t('employee_availability_history.table.columns.is_available') : t('employee_availability_history.table.columns.is_not_available')
                    },
                }
            ),
    },
    creation_date: {
        searchable: true,
        align: 'center',
        label: t('employee_availability_history.table.columns.creation_date'),
        renderRow: (row: EmployeeAvailabilityHistory) =>
            h('span', row.creation_date)
    },
    creation_time: {
        searchable: true,
        align: 'center',
        label: t('employee_availability_history.table.columns.creation_time'),
        renderRow: (row: EmployeeAvailabilityHistory) =>
            h('span', row.creation_time)
    },
    created_by: {
        align: 'center',
        label: t('employee_availability_history.table.columns.created_by'),
        renderRow: (row: EmployeeAvailabilityHistory) =>
            h('span', row.created_by ? row.created_by?.first_name + ' ' + row.created_by?.last_name : '-')
    },
} as const
</script>
        
<template>
    <EmployeeAvailabilityHistoryTableHeader :is_for_employee="props.isForEmployee" :key="keyIncrement"
        :title="viewWrapper.pageTitle" @search="search" :pagination="paginationVar" :default_per_page="default_per_page"
        @resetFilter="resetFilter" />
    <VFlexTableWrapper :columns="columns" :data="employeeAvailabilityHistoryList" @update:sort="historySort">
        <VFlexTable separators clickable>
            <template #body>
                <div v-if="employeeAvailabilityHistoryStore?.loading" class="flex-list-inner">
                    <div v-for="key in paginationVar.per_page" :key="key" class="flex-table-item">
                        <VFlexTableCell>
                            <VPlaceload />
                        </VFlexTableCell>
                    </div>
                </div>
                <div v-else-if="employeeAvailabilityHistoryList.length === 0" class="flex-list-inner">
                    <VPlaceholderSection :title="t('tables.placeholder.title')" :subtitle="t('tables.placeholder.subtitle')"
                        class="my-6">
                    </VPlaceholderSection>
                </div>
            </template>
        </VFlexTable>
        <VFlexPagination v-if="(employeeAvailabilityHistoryList.length != 0 && paginationVar.max_page != 1)"
            :current-page="paginationVar.page" class="mt-6" :item-per-page="paginationVar.per_page"
            :total-items="paginationVar.total" :max-links-displayed="3" no-router
            @update:current-page="getHistoryPerPage" />
        <h6 v-if="employeeAvailabilityHistoryList.length != 0 && !employeeAvailabilityHistoryStore?.loading">
            {{
                t('tables.pagination_footer', {
                    from_number: paginationVar.page !=
                        paginationVar.max_page
                        ?
                        (1 + ((paginationVar.page - 1) * paginationVar.count)) : paginationVar.page == paginationVar.max_page ? (1 +
                            ((paginationVar.page - 1) * paginationVar.per_page)) : paginationVar.page == 1 ? 1 : paginationVar.total
                    , to_number: paginationVar.page !=
                        paginationVar.max_page ?
                        paginationVar.page *
                        paginationVar.per_page : paginationVar.total, all_number: paginationVar.total
                }) }}</h6>

        <VPlaceloadText v-if="employeeAvailabilityHistoryStore?.loading" :lines="1" last-line-width="20%" class="mx-2" />
    </VFlexTableWrapper>
</template>
        