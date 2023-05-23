


<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { AdminDashboard, defaultAdminDashboard, defaultAnalystDashboard } from '/@src/models/Others/User/dashboard';
import { getAdminDashboardData } from '../../../services/Others/User/dashboardService';
import { useDashboard } from '/@src/stores/Others/User/dashboardStore';
import { addParenthesisToString } from '/@src/composable/helpers/stringHelpers';
import { Permissions } from '/@src/utils/consts/rolesPermissions';
import { useNotyf } from '/@src/composable/useNotyf';
import { Notyf } from 'notyf';
import { Account, AccountConsts, AccountSearchFilter } from '/@src/models/Accounting/Account/account';
import { Employee } from '/@src/models/Employee/employee';
import { getEmployeesList } from '/@src/services/Employee/employeeService';
import { EmployeeSearchFilter } from '/@src/models/Employee/employee';
import { UserStatusConsts } from '/@src/models/Others/UserStatus/userStatus';
import { getAccountsList } from '/@src/services/Accounting/Account/accountService';
import { ChartOfAccountConsts } from '/@src/models/Accounting/ChartOfAccount/chartOfAccount';
import { CurrencyConsts } from '/@src/models/Accounting/Currency/currency';
import sleep from '/@src/utils/sleep';
import { useEmployee } from '/@src/stores/Employee/employeeStore';

const adminDashboardData = ref<AdminDashboard>(defaultAdminDashboard)
const notif = useNotyf() as Notyf
const keyIncrement = ref(0)
const { t } = useI18n()
const router = useRouter()
const dashboardStore = useDashboard()
const IQDcashAccountsList = ref<Account[]>([])
const USDcashAccountsList = ref<Account[]>([])
const keyIncrementResetCashAccounts = ref(0)
const resetCashAccountPopup = ref(false)
const cashiersList = ref<Employee[]>()
const resetCashSetupLoading = ref(false)
const employeeStore = useEmployee()

onMounted(async () => {

  const { dashboard_data } = await getAdminDashboardData()
  adminDashboardData.value = dashboard_data
  keyIncrement.value = keyIncrement.value + 1
  await getAllAccounts()
});
const resetCashAccountSetup = async () => {
  resetCashSetupLoading.value = true
  while (employeeStore.loading) {
    await sleep()
  }

  const employeesSearchFilter: EmployeeSearchFilter = {
    is_cashier: true,
    user_status_id: UserStatusConsts.ACTIVE,
    per_page: 5000
  }
  const { employees, success, message } = await getEmployeesList(employeesSearchFilter)
  if (success) {
    cashiersList.value = employees
    keyIncrementResetCashAccounts.value++
    resetCashAccountPopup.value = true
  } else {
    notif.error(message)
  }
  resetCashSetupLoading.value = false
}
const getAllAccounts = async () => {
  let accountSearchFilter = {} as AccountSearchFilter
  accountSearchFilter.status = AccountConsts.ACTIVE
  accountSearchFilter.per_page = 5000
  const { accounts } = await getAccountsList(accountSearchFilter)
  accounts.forEach((account) => {
    if (account.chart_account?.code == ChartOfAccountConsts.CASH_CODE) {
      if (account.currency?.code == CurrencyConsts.IQD_CODE) {
        IQDcashAccountsList.value.push(account)
      } else {
        USDcashAccountsList.value.push(account)
      }
    }
  });
}
const cashAccountPostReset = async () => {
  resetCashAccountPopup.value = false
}
const popUpTrigger = (value: boolean) => {
  resetCashAccountPopup.value = value
}

</script>

<template>
  <div class="finance-dashboard dashboard">
    <div class="columns">
      <div class="column is-12">
        <div class="columns is-multiline mb-0">
          <div class="column is-3">
            <StatCard :key="keyIncrement" :title="t('dashboards.admin.clients_in_center')" color="primary"
              icon="feather:user" :stat="adminDashboardData.clients_in_center" rounded
              :loading="dashboardStore.loading" />
          </div>
          <div class="column is-3">
            <StatCard :key="keyIncrement" :title="t('dashboards.admin.active_users_count')" color="blue"
              icon="ic:round-supervised-user-circle" :stat="adminDashboardData.active_users_count" rounded
              :loading="dashboardStore.loading" />
          </div>
          <div class="column is-3">
            <StatCard :key="keyIncrement" :title="t('dashboards.admin.active_employees_count')" color="purple"
              icon="feather:briefcase" :stat="adminDashboardData.active_employees_count" rounded
              :loading="dashboardStore.loading" />
          </div>
          <div class="column is-3">
            <StatCard :key="keyIncrement" :title="t('dashboards.admin.active_clients_count')" color="yellow"
              icon="material-symbols:person" :stat="adminDashboardData.active_clients_count" rounded
              :loading="dashboardStore.loading" />
          </div>
          <div class="column is-8 columns is-multiline mx-0">
            <div class="column is-6 pr-0">
              <StatCard :key="keyIncrement" :title="t('dashboards.admin.active_suppliers_count')" color="orange"
                icon="game-icons:trade" :stat="adminDashboardData.active_suppliers_count" rounded
                :loading="dashboardStore.loading" />

            </div>
            <div class="column is-6 pl-0">
              <StatCard :key="keyIncrement" :title="t('dashboards.admin.active_items_count')" color="red"
                icon="lnir lnir-diamond-alt" :stat="adminDashboardData.active_items_count" rounded
                :loading="dashboardStore.loading" />

            </div>
            <div class="column is-12 px-0 mb-0">
              <RoleStatCard :key="keyIncrement" :title="t('dashboards.admin.roles')" color="info"
                icon="material-symbols:badge-outline" :roles="adminDashboardData.roles_stats" rounded
                :loading="dashboardStore.loading" />

            </div>
          </div>
          <div class="column is-4">
            <CashAmountStatCard :key="keyIncrement" :title="t('dashboards.admin.cash_amounts')" color="success"
              icon="fas fa-dollar-sign" :stats="[adminDashboardData.cash_amount_stats.IQD_stats.amount,
              adminDashboardData.cash_amount_stats.USD_stats.amount,
              adminDashboardData.cash_amount_stats.total_stats.amount]" rounded :loading="dashboardStore.loading"
              :percentages="[adminDashboardData.cash_amount_stats.IQD_stats.increment_percentage,
              adminDashboardData.cash_amount_stats.USD_stats.increment_percentage,
              adminDashboardData.cash_amount_stats.total_stats.increment_percentage]" :stats_ext="[addParenthesisToString(adminDashboardData.cash_amount_stats.IQD_stats.currency_name),
addParenthesisToString(adminDashboardData.cash_amount_stats.USD_stats.currency_name),
addParenthesisToString(t('dashboards.admin.total_amount'))]"
              :increases="[adminDashboardData.cash_amount_stats.IQD_stats.increment_percentage == 0 ? 'same' : adminDashboardData.cash_amount_stats.IQD_stats.is_increase ? 'more' : 'less',
              adminDashboardData.cash_amount_stats.USD_stats.increment_percentage == 0 ? 'same' : adminDashboardData.cash_amount_stats.USD_stats.is_increase ? 'more' : 'less',
              adminDashboardData.cash_amount_stats.total_stats.increment_percentage == 0 ? 'same' : adminDashboardData.cash_amount_stats.total_stats.is_increase ? 'more' : 'less']"
              :percentage_subtitles="[adminDashboardData.cash_amount_stats.IQD_stats.is_increase ? t('dashboards.admin.more_since_last_day') : t('dashboards.admin.less_since_last_day'),
              adminDashboardData.cash_amount_stats.USD_stats.is_increase ? t('dashboards.admin.more_since_last_day') : t('dashboards.admin.less_since_last_day'),
              adminDashboardData.cash_amount_stats.total_stats.is_increase ? t('dashboards.admin.more_since_last_day') : t('dashboards.admin.less_since_last_day')]" />
          </div>
        </div>
        <div class="columns is-multiline">
          <div class="column is-12">
            <div class="asset-category">
              <div v-permission="Permissions.CASH_ACCOUNT_RESET" class="category" @click="resetCashAccountSetup">
                <div class="asset">
                  <div class="asset-logo">
                    <i aria-hidden="true" class="fas fa-cash-register"></i>
                  </div>
                </div>
                <div class="asset-name">{{ t('dashboards.admin.reset_cash') }}
                  <div v-if="resetCashSetupLoading" class="loader is-loading reset-loader">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="columns is-multiline pt-0">
          <div class="column is-6">
            <EmployeesAvailabilityTable />
          </div>
          <div class="column is-6">
            <ActivityLogTable with-title />
          </div>
        </div>
      </div>
    </div>
  </div>
  <ResetCashAccountsModal :key="keyIncrementResetCashAccounts" :openModal="resetCashAccountPopup" :in-dashboard="true"
    @reseted="cashAccountPostReset" :iqd-cash-accounts="IQDcashAccountsList" :usd-cash-accounts="USDcashAccountsList"
    @openModal="popUpTrigger" :cashiers-list="cashiersList" />
</template>

<style scoped lang="scss">
@import '/@src/scss/Styles/Dashboards/analystDashboard.scss';

.reset-loader {
  bottom: 20px;
  right: 110px;
  margin-bottom: -15px;
}
</style>
