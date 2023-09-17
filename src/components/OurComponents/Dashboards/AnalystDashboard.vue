<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { AnalystDashboard, defaultAnalystDashboard } from '/@src/models/Others/User/dashboard';
import { getAnalystDashboardData } from '../../../services/Others/User/dashboardService';
import { useDashboard } from '/@src/stores/Others/User/dashboardStore';
import { addParenthesisToString } from '/@src/composable/helpers/stringHelpers';

const analystDashboardData = ref<AnalystDashboard>(defaultAnalystDashboard)
const keyIncrement = ref(0)
const { t } = useI18n()
const router = useRouter()
const dashboardStore = useDashboard()
onMounted(async () => {

    const { analyst_dashboard } = await getAnalystDashboardData()
    analystDashboardData.value = analyst_dashboard
    keyIncrement.value = keyIncrement.value + 1
});
</script>

<template>
    <div class="finance-dashboard dashboard">
        <div class="columns">
            <div class="column is-12">
                <div class="columns is-multiline">
                    <div class="column is-3">
                        <StatCard :key="keyIncrement" :title="t('dashboards.analyst.clients_in_center')" color="primary"
                            icon="feather:user" :stat="analystDashboardData.clients_in_center" rounded
                            :loading="dashboardStore.loading" />
                    </div>
                    <div class="column is-3">
                        <StatCard :key="keyIncrement" :title="t('dashboards.analyst.active_users_count')" color="blue"
                            icon="ic:round-supervised-user-circle" :stat="analystDashboardData.active_users_count" rounded
                            :loading="dashboardStore.loading" />
                    </div>
                    <div class="column is-3">
                        <StatCard :key="keyIncrement" :title="t('dashboards.analyst.active_employees_count')" color="purple"
                            icon="feather:briefcase" :stat="analystDashboardData.active_employees_count" rounded
                            :loading="dashboardStore.loading" />
                    </div>
                    <div class="column is-3">
                        <StatCard :key="keyIncrement" :title="t('dashboards.analyst.active_clients_count')" color="yellow"
                            icon="material-symbols:person" :stat="analystDashboardData.active_clients_count" rounded
                            :loading="dashboardStore.loading" />
                    </div>
                    <div class="column is-8 columns is-multiline mx-0">
                        <div class="column is-6 pr-0">
                            <StatCard :key="keyIncrement" :title="t('dashboards.analyst.active_suppliers_count')"
                                color="orange" icon="game-icons:trade" :stat="analystDashboardData.active_suppliers_count"
                                rounded :loading="dashboardStore.loading" />

                        </div>
                        <div class="column is-6 pl-0">
                            <StatCard :key="keyIncrement" :title="t('dashboards.analyst.active_items_count')" color="red"
                                icon="lnir lnir-diamond-alt" :stat="analystDashboardData.active_items_count" rounded
                                :loading="dashboardStore.loading" />

                        </div>
                        <div class="column is-12 px-0">
                            <RoleStatCard :key="keyIncrement" :title="t('dashboards.analyst.roles')" color="info"
                                icon="material-symbols:badge-outline" :roles="analystDashboardData.roles_stats" rounded
                                :loading="dashboardStore.loading" />

                        </div>
                    </div>
                    <div class="column is-4">
                        <CashAmountStatCard :key="keyIncrement" :title="t('dashboards.analyst.cash_amounts')"
                            color="success" icon="fas fa-dollar-sign" :stats="[analystDashboardData.cash_amount_stats.IQD_stats.amount,
                            analystDashboardData.cash_amount_stats.USD_stats.amount,
                            analystDashboardData.cash_amount_stats.total_stats.amount]" rounded
                            :loading="dashboardStore.loading" :percentages="[analystDashboardData.cash_amount_stats.IQD_stats.increment_percentage,
                            analystDashboardData.cash_amount_stats.USD_stats.increment_percentage,
                            analystDashboardData.cash_amount_stats.total_stats.increment_percentage]" :stats_ext="[addParenthesisToString(analystDashboardData.cash_amount_stats.IQD_stats.currency_name),
addParenthesisToString(analystDashboardData.cash_amount_stats.USD_stats.currency_name),
addParenthesisToString(t('dashboards.analyst.total_amount'))]"
                            :increases="[analystDashboardData.cash_amount_stats.IQD_stats.increment_percentage == 0 ? 'same' : analystDashboardData.cash_amount_stats.IQD_stats.is_increase ? 'more' : 'less',
                            analystDashboardData.cash_amount_stats.USD_stats.increment_percentage == 0 ? 'same' : analystDashboardData.cash_amount_stats.USD_stats.is_increase ? 'more' : 'less',
                            analystDashboardData.cash_amount_stats.total_stats.increment_percentage == 0 ? 'same' : analystDashboardData.cash_amount_stats.total_stats.is_increase ? 'more' : 'less']"
                            :percentage_subtitles="[analystDashboardData.cash_amount_stats.IQD_stats.is_increase ? t('dashboards.analyst.more_since_last_day') : t('dashboards.analyst.less_since_last_day'),
                            analystDashboardData.cash_amount_stats.USD_stats.is_increase ? t('dashboards.analyst.more_since_last_day') : t('dashboards.analyst.less_since_last_day'),
                            analystDashboardData.cash_amount_stats.total_stats.is_increase ? t('dashboards.analyst.more_since_last_day') : t('dashboards.analyst.less_since_last_day')]" />
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '/@src/scss/styles/Dashboards/analystDashboard.scss';
</style>