<script setup lang="ts">import { useHead } from '@vueuse/head';
import { Notyf } from 'notyf';
import { useI18n } from 'vue-i18n';
import VTag from '/@src/components/base/tags/VTag.vue';
import SalaryHistoryDropDown from '/@src/components/OurComponents/HR/Payroll/Salary/SalaryHistoryDropDown.vue';
import { useNotyf } from '/@src/composable/useNotyf';
import { EmployeeVariablePayment } from '/@src/models/HR/Payroll/EmployeVariablePayment/employeeVariablePayment';
import { defaultSalarySearchFilter, Salary, SalarySearchFilter, SalaryConsts, defaultReviewGenerateSalariesRequestBody, ReviewGenerateSalariesRequestBody } from '/@src/models/HR/Payroll/Salary/salary';
import { VariablePaymentConsts } from '/@src/models/HR/Payroll/VariablePayment/variablePayment';
import { getEmployeeVariablePaymentsList } from '/@src/services/HR/Payroll/EmployeeVariablePayment/employeeVariablePaymentService';
import { getSalariesList } from '/@src/services/HR/Payroll/Salary/salaryService';
import { useSalary } from '/@src/stores/HR/Payoll/Salary/salaryStore';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { defaultPagination } from '/@src/utils/response';
import { numberFormat } from '/@src/composable/helpers/numberMoneyFormat';


const viewWrapper = useViewWrapper()
const { t } = useI18n()
viewWrapper.setPageTitle(t('salary.table.title'))
useHead({
  title: t('salary.table.title'),
})
const notif = useNotyf() as Notyf
const salaryStore = useSalary()
const searchFilter = ref(defaultSalarySearchFilter)
const salariesList = ref<Array<Salary>>([])
const paginationVar = ref(defaultPagination)
const keyIncrement = ref(0)
const router = useRouter()
const default_per_page = ref(10)
const selectedMonth = ref<ReviewGenerateSalariesRequestBody>({month : 0 , year : 0})


const getSalaries = async (newSelectedMonth: ReviewGenerateSalariesRequestBody , newSearchFilter : SalarySearchFilter) => {
    paginationVar.value.per_page = newSearchFilter.per_page ?? paginationVar.value.per_page

      const { salaries, pagination } = await getSalariesList(newSelectedMonth,newSearchFilter)
  salariesList.value = salaries
  paginationVar.value = pagination
  keyIncrement.value = keyIncrement.value + 1
  default_per_page.value = pagination.per_page
    selectedMonth.value = newSelectedMonth
    searchFilter.value = newSearchFilter

}

const resetFilter = async (newSearchFilter: SalarySearchFilter) => {
  searchFilter.value = newSearchFilter
 await getSalaries(selectedMonth.value, searchFilter.value)
}

const getSalariesPerPage = async (pageNum: number) => {

  searchFilter.value.page = pageNum
  await getSalaries(selectedMonth.value, searchFilter.value)
}
const salarySort = async (value: string) => {
  if (value != undefined) {
    const [sortField, sortOrder] = value.split(':') as [string, 'desc' | 'asc']
    searchFilter.value.order_by = sortField
    searchFilter.value.order = sortOrder
  }
  else {
    searchFilter.value.order = undefined
    searchFilter.value.order_by = undefined
  }
  await getSalaries(selectedMonth.value,searchFilter.value)
}


const columns = {
  "salaries.employees.users.name": {
    align: 'center',
    sortable: true,
    label: t("salary.table.columns.employee_name"),
    renderRow: (row: any) =>
      h('span', row?.employee?.user?.first_name + ' ' + row?.employee?.user?.last_name),
  },
  basic_salary: {
    align: 'center',
    sortable: true,
    label: t("salary.table.columns.basic_salary"),
    renderRow: (row: any) =>
      h('span', numberFormat(row?.basic_salary)),
  },
  earnings: {
    align: 'center',
    label: t("salary.table.columns.earnings"),
    renderRow: (row: any) => {
       return h('span',{class: 'has-text-primary'}, numberFormat(row?.total_variable_payment_earnings) );
    }
  },
  variable_deductions: {
    align: 'center',
    label: t("salary.table.columns.variable_deductions"),
    renderRow: (row: any) => {
       return h('span',{class: 'has-text-danger'}, numberFormat(row?.total_variable_payment_deductions) );
    }
  },
  attendance_deduction: {
    align: 'center',
    sortable: true,
    label: t("salary.table.columns.attendance_deduction"),
    renderRow: (row: any) =>
      h('span',{class: 'has-text-danger'},numberFormat(row?.attendance_deduction)),

  },
  net_salary: {
    align: 'center',
    sortable: true,
    label: t("salary.table.columns.net_salary"),
    renderRow: (row: any) =>
      h('span', numberFormat(row?.net_salary)),

  },
  status: {
    align: 'center',
    label: t("salary.table.columns.status"),

    renderRow: (row: any) =>
      h(
        VTag,
        {
          rounded: true,
          color: SalaryConsts.getStatusColor(row?.status) ,
        },
        {
          default() {
            return SalaryConsts.getStatusName(row?.status)
          },
        }
      ),

  },

  updated_at: {
    align: 'center',
    sortable: true,
    label: t("salary.table.columns.updated_at"),
    renderRow: (row: any) =>
      h('span', row?.updated_at ? row?.updated_at : '-'),
  },

  actions: {
    align: 'center',
    label: t("salary.table.columns.actions"),
    renderRow: (row: any) =>
      h(SalaryHistoryDropDown, {
        onView: () => {
          router.push({path : `/salary/${row?.id}`})
        },
      }),

  },
} as const
</script>

<template>
  <SalaryTableHeader  :title="viewWrapper.pageTitle"
    :button_name="t('salary.header_button')" @search="getSalaries" :pagination="paginationVar"
    :default_per_page="default_per_page" @resetFilter="resetFilter" />


  <VFlexTableWrapper :columns="columns" :data="salariesList" @update:sort="salarySort">

    <VFlexTable separators clickable>
      <template #body>
        <div v-if="salaryStore?.loading" class="flex-list-inner">
          <div v-for="key in paginationVar.per_page" :key="key" class="flex-table-item">
            <VFlexTableCell>
              <VPlaceload />
            </VFlexTableCell>
          </div>
        </div>
        <div v-else-if="salariesList.length === 0" class="flex-list-inner">
          <VPlaceholderSection :title="(selectedMonth.month == 0 && selectedMonth.year == 0 ) ? t('salary.table.placeholder.title') : t('tables.placeholder.title')"
           :subtitle="(selectedMonth.month == 0 && selectedMonth.year == 0 ) ? t('salary.table.placeholder.subtitle') : t('tables.placeholder.subtitle')"
            class="my-6">
          </VPlaceholderSection>
        </div>
      </template>
    </VFlexTable>
    <VFlexPagination v-if="(salariesList.length != 0 && paginationVar.max_page != 1)"
      :current-page="paginationVar.page" class="mt-6" :item-per-page="paginationVar.per_page"
      :total-items="paginationVar.total" :max-links-displayed="3" no-router
      @update:current-page="getSalariesPerPage" />
    <h6 class="pt-2 is-size-7" v-if="salariesList.length != 0 && !salaryStore?.loading">
      {{
        t('tables.pagination_footer', { from_number: paginationVar.page !=
          paginationVar.max_page
          ?
          (1 + ((paginationVar.page - 1) * paginationVar.count)) : paginationVar.page == paginationVar.max_page ? (1 +
            ((paginationVar.page - 1) * paginationVar.per_page)) : paginationVar.page == 1 ? 1 : paginationVar.total
        , to_number: paginationVar.page !=
          paginationVar.max_page ?
          paginationVar.page *
          paginationVar.per_page : paginationVar.total, all_number: paginationVar.total
      })}}</h6>
    <VPlaceloadText v-if="salaryStore?.loading" :lines="1" last-line-width="20%" class="mx-2" />
  </VFlexTableWrapper>

</template>

<style lang="scss">
</style>
