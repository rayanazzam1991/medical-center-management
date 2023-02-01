<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { useI18n } from 'vue-i18n';
import { EmployeeVariablePayment } from '/@src/models/HR/Payroll/EmployeVariablePayment/employeeVariablePayment';
import { defaultSalary, SalaryConsts } from '/@src/models/HR/Payroll/Salary/salary';
import { VariablePaymentConsts } from '/@src/models/HR/Payroll/VariablePayment/variablePayment';
import { CityConsts } from '/@src/models/Others/City/city';
import { getSalaryPayslip } from '/@src/services/HR/Payroll/Salary/salaryService';
import { useSalary } from '/@src/stores/HR/Payoll/Salary/salaryStore';
import { useViewWrapper } from '/@src/stores/viewWrapper';

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const pageTitle = ref('')
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle(t('salary.payslip.title'))
const head = useHead({
  title: t('salary.payslip.title'),
})


const salaryStore = useSalary()
const salaryId = ref(0)
// @ts-ignore
salaryId.value = route.params?.id as number ?? 0
const currentSalary = ref(defaultSalary)
const earningsVariablePayments = ref<EmployeeVariablePayment[]>([])
const deductionsVariablePayments = ref<EmployeeVariablePayment[]>([])
const moreVariablePayments = ref<{ key: 'Deducations' | 'Earnings', number: number }>({ key: 'Deducations', number: 0 })
const getCurrentSalary = async () => {
  const { salary } = await getSalaryPayslip(salaryId.value)
  if (salary != undefined)
    currentSalary.value = salary
  pageTitle.value = t('salary.payslip.title')
}
onMounted(async () => {
  await getCurrentSalary()
  currentSalary.value.variable_payments?.forEach(variablePayment => {
    if (variablePayment.variable_payment.type == VariablePaymentConsts.INCREMENT_TYPE) {
      earningsVariablePayments.value.push(variablePayment)
    } else {
      deductionsVariablePayments.value.push(variablePayment)
    }
  });
  if (earningsVariablePayments.value.length > deductionsVariablePayments.value.length)
    moreVariablePayments.value.key = 'Earnings'
  moreVariablePayments.value.number = Math.abs(earningsVariablePayments.value.length - deductionsVariablePayments.value.length)
})

const numberFormat = (number: number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

}
const marginButton = () => {
  return {
    "margin-button": `120px !important;`
  }
}
const unjustifiedColumns = {
  name: {
    label: '',
    grow: 'xl',
    inverted: true,
    renderRow: (row: any) =>
      h('span', t('salary.payslip.unjustified_hours')),

  },
  value: {
    label: '',
    inverted: true,
    renderRow: (row: any) =>
      h('span', `${currentSalary.value.unjustified_hours} ${t('salary.payslip.hour')}`),

  },
} as const
const statusColumns = {
  name: {
    label: '',
    grow: 'xl',
    inverted: true,
    renderRow: (row: any) =>
      h('span', t('salary.payslip.status')),

  },
  value: {
    label: '',
    inverted: true,
    renderRow: (row: any) =>
      h('span', { class: `has-text-${SalaryConsts.getStatusColor(currentSalary.value.status)}` }, SalaryConsts.getStatusName(currentSalary.value.status)),

  },
} as const
const salaryColumns = {
  name: {
    label: '',
    grow: 'xl',
    inverted: true,
    renderRow: (row: any) =>
      h('span', t('salary.payslip.basic_salary')),

  },
  value: {
    label: '',
    inverted: true,
    renderRow: (row: any) =>
      h('span', { class: `has-text-primary` }, numberFormat(currentSalary.value.basic_salary)),

  },
} as const
const attendanceDeductionColumns = {
  name: {
    label: '',
    grow: 'xl',
    inverted: true,
    renderRow: (row: any) =>
      h('span', t('salary.payslip.attendance_deduction')),

  },
  value: {
    label: '',
    inverted: true,
    renderRow: (row: any) =>
      h('span', { class: `has-text-danger` }, numberFormat(currentSalary.value.attendance_deduction)),

  },
} as const

const earningsColumns = {
  name: {
    label: '',
    grow: 'xl',
    inverted: true,
    renderRow: (row: any) =>
      h('span', row?.variable_payment?.name),

  },
  amount: {
    label: '',
    inverted: true,
    renderRow: (row: any) =>
      h('span', { class: 'has-text-success' }, numberFormat(row?.amount)),

  },
} as const
const totalEarningsData = computed(() => {
  return [
    {
      label: t('salary.payslip.table.earnings.columns.total_earnings'),
      value: currentSalary.value.total_earnings,
    },
  ]
})
const totalEarningsColumns = {
  label: {
    label: '',
    grow: 'xl',
    align: 'end',
  },
  value: {
    label: '',
    bold: true,
    format: (value: any) => numberFormat(value),
  },
} as const


const deductionsColumns = {
  name: {
    label: '',
    grow: 'xl',
    inverted: true,
    renderRow: (row: any) =>
      h('span', row?.variable_payment?.name),

  },
  amount: {
    label: '',
    inverted: true,
    renderRow: (row: any) =>
      h('span', { class: 'has-text-danger' }, numberFormat(row?.amount)),

  },
} as const
const totalDeductionsData = computed(() => {
  return [
    {
      label: t('salary.payslip.table.deductions.columns.total_deductions'),
      value: currentSalary.value.total_deductions,
    },
  ]
})
const totalDeductionsColumns = {
  label: {
    label: '',
    grow: 'xl',
    align: 'end',
  },
  value: {
    label: '',
    bold: true,
    format: (value: any) => numberFormat(value),
  },
} as const
const totalColumns = {
  name: {
    label: t('salary.payslip.table.total.columns.net_salary'),
    grow: 'xl',
    inverted: true,
    renderRow: (row: any) =>
      h('span', row?.variable_payment?.net_salary),

  }
} as const
const totalData = computed(() => {
  return [
    {
      label: t('salary.payslip.table.total.columns.total'),
      value: currentSalary.value.net_salary,
    },
  ]
})
const totalTotalColumns = {
  label: {
    label: '',
    grow: 'xl',
    align: 'end',
  },
  value: {
    label: '',
    bold: true,
    format: (value: any) => numberFormat(value),
  },
} as const


</script>

<template>

  <div class="invoice-wrapper">
    <div class="invoice-header">
      <div class="left is-flex is-align-items-center">
        <VIconButton class="ml-3" color="white" darkOutlined icon="feather:arrow-right" :to="{path : '/salary'}"/>
        <h3>{{ t('salary.payslip.header') }}</h3>
      </div>
    </div>
    <VLoader size="large" :active="salaryStore.loading">
      <div class="invoice-body">
        <div class="invoice-card">
          <div class="invoice-section is-flex mb-0 pb-0">
            <div class="meta">
              <h3 class="mb-3">{{ currentSalary.employee.user.first_name }} {{ currentSalary.employee.user.last_name }}
              </h3>
              <div>{{ currentSalary.employee.position.name }}</div>
              <div>{{ currentSalary.employee.user.room.department?.name }}</div>
              <div>{{ currentSalary.employee.user.phone_number }}</div>
            </div>
            <div class="end">
              <h3 class="mb-3">{{ t('salary.payslip.salary_month') }} {{ currentSalary.salary_month?.month_number }} /
                {{
                  currentSalary.salary_month?.year
                }} </h3>
              <div>{{ t('salary.payslip.salary_month_duration') }} {{ currentSalary.salary_month?.generated_from }} ← {{
                currentSalary.salary_month?.generated_to
              }} </div>
              <div>{{ t('salary.payslip.created_at') }} {{
                currentSalary.created_at ? currentSalary.created_at : '-'
              }}</div>
              <div>{{ t('salary.payslip.updated_at') }} {{
                currentSalary.updated_at ? currentSalary.updated_at : '-'
              }}</div>
            </div>
          </div>

          <div class="invoice-section is-bordered py-2">
            <VFlexTable :data="[{}]" :columns="statusColumns" rounded reactive>
            </VFlexTable>
            <VFlexTable :data="[{}]" :columns="unjustifiedColumns" rounded reactive class="mid-table">
            </VFlexTable>
          </div>
          <div class="columns is=multiline mb-0">
            <div class="column is-6 pl-0 pb-0">

              <div class="invoice-section is-flex mb-0 pb-0">
                <div class="meta">
                  <h3 class="mb-3">{{ t('salary.payslip.earnings') }}</h3>
                </div>
              </div>

              <div class="invoice-section mt-0 pt-0 pb-2">
                <VFlexTable :data="[{}]" :columns="salaryColumns" rounded reactive class="">
                </VFlexTable>
                <VFlexTable
                  :style="moreVariablePayments.key == 'Deducations' ? `margin-bottom: ${moreVariablePayments.number * 68.5}px;` : ''"
                  :data="earningsVariablePayments" :columns="earningsColumns" rounded reactive class="mid-table">
                </VFlexTable>
                <VFlexTable subtable :data="totalEarningsData" :columns="totalEarningsColumns">
                  <template #body-cell="{ column, value, row }">
                    <template v-if="column.key === 'label'">
                      <span class="table-label">{{ value }}</span>
                    </template>
                    <template v-else-if="column.key === 'value' && row.label === 'Total'">
                      <span class="table-total is-bigger">{{ value }}</span>
                    </template>
                    <template v-else>
                      <span class="table-total is-bigger">{{ value }}</span>
                    </template>
                  </template>
                </VFlexTable>
              </div>
            </div>
            <div class="column is-6 pr-0 pb-0">
              <div class="invoice-section is-flex mb-0 pb-0">
                <div class="meta">
                  <h3 class="mb-3">{{ t('salary.payslip.deductions') }}</h3>
                </div>
              </div>
              <div class="invoice-section mt-0 pt-0 pb-2">
                <VFlexTable :data="[{}]" :columns="attendanceDeductionColumns" rounded reactive>
                </VFlexTable>
                <VFlexTable
                  :style="moreVariablePayments.key == 'Earnings' ? `margin-bottom: ${moreVariablePayments.number * 68.5}px;` : ''"
                  :data="deductionsVariablePayments" :columns="deductionsColumns" rounded reactive class="mid-table">
                </VFlexTable>
                <VFlexTable subtable :data="totalDeductionsData" :columns="totalDeductionsColumns">
                  <template #body-cell="{ column, value, row }">
                    <template v-if="column.key === 'label'">
                      <span class="table-label is-bigger">{{ value }}</span>
                    </template>
                    <template v-else>
                      <span class="table-total is-bigger">{{ value }}</span>
                    </template>
                  </template>
                </VFlexTable>
              </div>
            </div>
          </div>

          <div class="invoice-section py-4 net-salary ">
            <div class="columns">
              <div class="column is-6">
                
              </div>
              <div class="column is-6">
                <VFlexTable subtable :data="totalData" :columns="totalTotalColumns" class="mid-table">
                <template #body-cell="{ column, value, row }">
                <template v-if="column.key === 'value' && row.label === 'Total'">
                  <span class="table-total is-bigger">{{ value }}</span>
                </template>
                <template v-else>
                  <span class="table-total is-bigger">{{ value }}</span>
                </template>
              </template>
            </VFlexTable>

              </div>
          </div>
          </div>
        </div>
      </div>
    </VLoader>

  </div>



</template>

<style lang="scss">
@import '/@src/scss/abstracts/all';

.net-salary {

  border-top: 1px solid var(--fade-grey-dark-3);
}

.mid-table {
  .flex-table-header {
    display: none;
  }
}

/* ==========================================================================
4. Invoice
========================================================================== */
.invoice-wrapper {
  max-width: 740px;
  margin: 0 auto;

  &.is-navbar {
    margin-top: 30px;
  }

  .invoice-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--fade-grey-dark-4);

    .left {
      h3 {
        font-family: var(--font-alt);
        font-size: 1.2rem;
        font-weight: 600;
        color: var(--dark-text);
      }
    }

    .right {
      .controls {
        display: flex;

        .action {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 32px;
          width: 32px;
          min-width: 32px;
          border-radius: var(--radius-rounded);
          color: var(--light-text);
          margin: 0 4px;
          transition: all 0.3s; // transition-all test

          &:hover {
            color: var(--dark-text);
            background: var(--fade-grey-dark-4);
          }

          svg {
            height: 16px;
            width: 16px;
            stroke-width: 1.6px;
          }
        }
      }
    }
  }

  .invoice-body {
    .invoice-card {
      @include vuero-s-card;

      padding: 0;

      .invoice-section {
        padding: 40px;

        &.is-flex {
          display: flex;
          align-items: center;

          .meta {
            margin-left: auto;
            font-family: var(--font);

            h3 {
              font-family: var(--font-alt);
              font-size: 1.1rem;
              font-weight: 600;
              line-height: 1;
            }

            div {
              display: block;
              color: var(--light-text);
              font-weight: 400;
              font-size: 0.9rem;
            }
          }

          .end {
            margin-left: 0;
            text-align: right;

            &.is-left {
              text-align: left;
              max-width: 300px;

              p {
                padding-top: 4px;
                font-size: 0.95rem;
                line-height: 1.2;
              }
            }

            h3 {
              font-family: var(--font-alt);
              font-size: 1.1rem;
              font-weight: 600;
              line-height: 1;
            }

            div {
              display: block;
              color: var(--light-text);
              font-weight: 400;
              font-size: 0.9rem;

            }

          }
        }

        &.is-bordered {
          border-bottom: 1px solid var(--fade-grey-dark-3);
        }

        .v-avatar {
          &.is-customer {
            border: 1.6px solid var(--fade-grey-dark-3);
            border-radius: var(--radius-rounded);
            box-shadow: var(--light-box-shadow);
          }
        }

        .flex-table {
          .flex-table-header {
            span {
              &:not(:first-child) {
                justify-content: flex-end;
              }
            }
          }

          .flex-table-item {
            .flex-table-cell {
              &:not(:first-child) {
                justify-content: flex-end;
              }
            }
          }
        }
      }
    }
  }
}

/* ==========================================================================
5. Invoice Dark mode
========================================================================== */

.is-dark {
  .invoice-wrapper {
    .invoice-header {
      border-color: var(--dark-sidebar-light-20);

      .left {
        h3 {
          color: var(--dark-dark-text);
        }
      }

      .right {
        .controls {
          .action {
            border: 1px solid transparent;

            &:hover,
            &:focus {
              background: var(--dark-sidebar-light-2);
              border-color: var(--primary);
              color: var(--primary);
            }
          }
        }
      }
    }

    .invoice-body {
      .invoice-card {
        @include vuero-card--dark;
      }
    }

    .invoice-section {
      border-color: var(--dark-sidebar-light-12) !important;

      &.is-flex {
        .v-avatar {
          border-color: var(--dark-sidebar-light-12) !important;
        }

        .meta,
        .end {
          h3 {
            color: var(--dark-dark-text);
          }
        }
      }
    }
  }
}

@media only screen and (max-width: 767px) {
  .invoice-wrapper {
    .invoice-section {
      &.is-flex {
        flex-direction: column;
        text-align: center;

        .v-avatar {
          margin-bottom: 16px;
        }

        .meta {
          margin-left: 0 !important;
        }

        .end {
          margin: 16px auto 0;
          text-align: center !important;
        }
      }

      .flex-table {
        .flex-table-item {
          .flex-table-cell {
            &.is-grow {
              >span {
                margin-left: 0;
              }
            }
          }
        }
      }
    }
  }
}
</style>
