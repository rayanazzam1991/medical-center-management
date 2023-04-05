


<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { AdminDashboard, defaultAdminDashboard, defaultAnalystDashboard } from '/@src/models/Others/User/dashboard';
import { getAdminDashboardData } from '/@src/services/Others/User/dashboadService';
import { Permissions } from '/@src/utils/consts/rolesPermissions';
import { useDashboard } from '/@src/stores/Others/User/dashboardStore';
import { addParenthesisToString } from '/@src/composable/helpers/stringHelpers';

const adminDashboardData = ref<AdminDashboard>(defaultAdminDashboard)
const keyIncrement = ref(0)
const { t } = useI18n()
const router = useRouter()
const dashboardStore = useDashboard()
onMounted(async () => {

  const { dashboard_data } = await getAdminDashboardData()
  adminDashboardData.value = dashboard_data
  keyIncrement.value = keyIncrement.value + 1
});
</script>

<template>
  <div class="finance-dashboard dashboard">
    <div class="columns">
      <div class="column is-12">
        <div class="columns is-multiline">
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
            <div class="column is-12 px-0">
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
        <div>
          <ActivityLogTable with-title :to-main-inventory="false" :from-main-inventory="false" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '/@src/scss/Styles/Dashboards/analystDashboard.scss';
</style>
