<script setup lang="ts">
import { useHead } from '@vueuse/head'
import VTag from '/@src/components/base/tags/VTag.vue'
import { useNotyf } from '/@src/composable/useNotyf'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { defaultPagination } from '/@src/utils/response'
import { useEmployee } from '/@src/stores/Employee/employeeStore'
import { EmployeeHistory, EmployeeHistorySearchFilter, EmployeeStatusConsts } from '/@src/models/Employee/employeeHistory'
import { getEmployeesHistoryList, resetEmployeeHistorySearchFilter } from '/@src/services/Employee/employeeService'
import { Notyf } from 'notyf'
import { useI18n } from 'vue-i18n'
import { stringTrim } from '/@src/composable/helpers/stringHelpers'
export interface EmployeeHistoryTableProps {
  isForEmployee: boolean,
  employeeId: number | undefined
}
const props = withDefaults(defineProps<EmployeeHistoryTableProps>(), {
  isForEmployee: false,
  employeeId: undefined

})



const viewWrapper = useViewWrapper()
const { t } = useI18n()
viewWrapper.setPageTitle(t('dismissed_employee.table.title'))
useHead({
  title: t('dismissed_employee.table.title'),
})
const notif = useNotyf() as Notyf
const searchFilter = ref(resetEmployeeHistorySearchFilter())
if (props.isForEmployee && props.employeeId) {
  searchFilter.value.employee_id = props.employeeId
}
const dismissedEmployeesList = ref<Array<EmployeeHistory>>([])
const paginationVar = ref(defaultPagination)
const router = useRouter()
const employeeStore = useEmployee()
const default_per_page = ref(1)
const keyIncrement = ref(0)


onMounted(async () => {
  const { dismissedEmployees, pagination } = await getEmployeesHistoryList(searchFilter.value)
  dismissedEmployeesList.value = dismissedEmployees
  paginationVar.value = pagination
  keyIncrement.value = keyIncrement.value + 1
  default_per_page.value = pagination.per_page
});


const search = async (newSearchFilter: EmployeeHistorySearchFilter) => {
  if (props.isForEmployee && props.employeeId) {
    newSearchFilter.employee_id = props.employeeId
  }
  const { dismissedEmployees, pagination } = await getEmployeesHistoryList(newSearchFilter)

  dismissedEmployeesList.value = dismissedEmployees
  paginationVar.value = pagination
  searchFilter.value = newSearchFilter
}

const resetFilter = async (newSearchFilter: EmployeeHistorySearchFilter) => {
  if (props.isForEmployee && props.employeeId) {
    newSearchFilter.employee_id = props.employeeId
  }
  searchFilter.value = newSearchFilter
  await search(searchFilter.value)
}

const getEmployeesPerPage = async (pageNum: number) => {
  searchFilter.value.page = pageNum
  search(searchFilter.value)
}
const employeeSort = async (value: string) => {
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
  "employee_name": {
    align: 'center',

    label: t('dismissed_employee.table.columns.name'),
    grow: 'lg',
    renderRow: (row: any) =>
      h('span', row.employee.user.first_name + ' ' + row.employee.user.last_name),

  },
  status: {
    align: 'center',
    grow: true,
    label: t('dismissed_employee.table.columns.status'),
    renderRow: (row: any) =>
      h(
        VTag,
        {
          rounded: true,
          color: EmployeeStatusConsts.getStatusColor(row.status)
        },
        {
          default() {
            return EmployeeStatusConsts.getStatusName(row.status)
          },
        }
      ),
    searchable: true,
  },

  notes: {
    align: 'center',
    label: t('dismissed_employee.table.columns.notes'),
    renderRow: (row: any) =>
      h('span', {
        innerHTML: row?.notes ?
          `<div class="tooltip">${stringTrim(row?.notes, 10)}<div class="tooltiptext"><p class="text-white">${row?.notes}</p></div></div>` : '-',

      }),
  },
  created_at: {
    align: 'center',

    label: t('employee.table.columns.created_at'),
    renderRow: (row: any) =>
      h('span', row?.created_at),
    grow: true

  },
  created_by: {
    align: 'center',
    label: t('employee.table.columns.created_by'),
    renderRow: (row: any) =>
      h('span', row?.created_by.first_name + ' ' + row?.created_by.last_name),
    grow: true

  },

} as const
</script>

<template>
  <EmployeesHistoryTableHeader :is_for_employee="props.isForEmployee" :key="keyIncrement" :title="viewWrapper.pageTitle"
    :button_name="t('employee.header_button')" @search="search" :pagination="paginationVar"
    :default_per_page="default_per_page" @resetFilter="resetFilter" />
  <VFlexTableWrapper :columns="columns" :data="dismissedEmployeesList" :limit="searchFilter.per_page"
    @update:sort="employeeSort">

    <VFlexTable separators clickable>
      <template #body>
        <div v-if="employeeStore?.loading" class="flex-list-inner">
          <div v-for="key in paginationVar.per_page" :key="key" class="flex-table-item">
            <VFlexTableCell>
              <VPlaceload />
            </VFlexTableCell>

          </div>
        </div>
        <div v-else-if="dismissedEmployeesList.length === 0" class="flex-list-inner">
          <VPlaceholderSection :title="t('tables.placeholder.title')" :subtitle="t('tables.placeholder.subtitle')"
            class="my-6">
          </VPlaceholderSection>
        </div>

      </template>
    </VFlexTable>
    <VFlexPagination v-if="(dismissedEmployeesList.length != 0 && paginationVar.max_page != 1)"
      :current-page="paginationVar.page" class="mt-6" :item-per-page="paginationVar.per_page"
      :total-items="paginationVar.total" :max-links-displayed="3" no-router @update:current-page="getEmployeesPerPage" />
    <h6 class="pt-2 is-size-7" v-if="dismissedEmployeesList.length != 0 && !employeeStore?.loading">
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

    <VPlaceloadText v-if="employeeStore?.loading" :lines="1" last-line-width="20%" class="mx-2" />
  </VFlexTableWrapper>
</template>
<style lang="scss">
.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip .tooltiptext {
  visibility: hidden;
  min-width: fit-content;
  background-color: white;
  text-align: center;
  border-radius: 6px;
  padding: 5px;
  word-break: keep-all;
  white-space: normal;


  /* Position the tooltip */
  position: absolute;
  z-index: 1;
}

.tooltip:hover .tooltiptext {
  visibility: visible;


}

.is-dark {
  .tooltip .tooltiptext {
    background-color: rgb(43, 41, 41);
  }
}
</style>
