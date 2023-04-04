<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { HRDashboard, InventoryDashboard, defaultHRDashboard, defaultInventoryDashboard } from '/@src/models/Others/User/dashboard';
import { getHumanResourcesDashboardData, getInventoryDashboardData } from '/@src/services/Others/User/dashboadService';
import { Permissions } from '/@src/utils/consts/rolesPermissions';
import { useDashboard } from '/@src/stores/Others/User/dashboardStore';

const humanResourcesDashboardData = ref<HRDashboard>(defaultHRDashboard)
const keyIncrement = ref(0)
const { t } = useI18n()
const router = useRouter()
const dashboardStore = useDashboard()
onMounted(async () => {

    const { dashboard_data } = await getHumanResourcesDashboardData()
    humanResourcesDashboardData.value = dashboard_data
    keyIncrement.value = keyIncrement.value + 1
});
const toAddEmployee = () => {
    router.push({ name: '/employee-add' })
}
const toAttendanceTable = () => {
    router.push({ name: '/employee-attendance' })
}
const toGenerateSalary = () => {
    router.push({ name: '/generate-salaries' })
}
</script>

<template>
    <div class="finance-dashboard dashboard">
        <div class="columns">
            <div class="column is-12">
                <div class="columns is-multiline">
                    <div class="column is-3">
                        <StatCard :key="keyIncrement" :title="t('dashboards.hr.active_employee_count')" color="primary"
                            icon="feather:user" :stat="humanResourcesDashboardData.active_employee_count" rounded
                            :loading="dashboardStore.loading" />
                    </div>
                    <div class="column is-3">
                        <StatCard :key="keyIncrement" :title="t('dashboards.hr.attendance_employee_count')" color="blue"
                            icon="lnir lnir-calender-alt" :stat="humanResourcesDashboardData.attendance_employee_count"
                            rounded :loading="dashboardStore.loading" />
                    </div>
                    <div class="column is-3">
                        <StatCard :key="keyIncrement" :title="t('dashboards.hr.service_providers_count')" color="purple"
                            icon="feather:briefcase" :stat="humanResourcesDashboardData.service_providers_count" rounded
                            :loading="dashboardStore.loading" />
                    </div>
                    <div class="column is-3">
                        <StatCard :key="keyIncrement" :title="t('dashboards.hr.remaining_days_for_generate')" color="yellow"
                            icon="fas fa-money-check" :stat="humanResourcesDashboardData.remaining_days_for_generate"
                            rounded :loading="dashboardStore.loading" :stat_ext="t('dashboards.hr.day')" />
                    </div>
                    <div class="column is-4">
                        <StatCard :key="keyIncrement" :title="t('dashboards.hr.absence_hours_last_month')" color="info"
                            percentage_color_inverted icon="fas fa-running"
                            :stat="humanResourcesDashboardData.absence_hours_stats.absenece_hours" rounded bordered
                            :loading="dashboardStore.loading"
                            :percentage="humanResourcesDashboardData.absence_hours_stats.increment_percentage"
                            :increase="humanResourcesDashboardData.absence_hours_stats.increment_percentage == 0 ? 'same' : humanResourcesDashboardData.absence_hours_stats.is_increase ? 'more' : 'less'"
                            :percentage_subtitle="humanResourcesDashboardData.absence_hours_stats.is_increase ? t('dashboards.hr.more_since_previous_month') : t('dashboards.hr.less_since_previous_month')"
                            :stat_ext="t('dashboards.hr.hour')" />

                    </div>
                    <div class="column is-4">
                        <StatCard :key="keyIncrement" :title="t('dashboards.hr.justified_absence_hours_last_month')"
                            color="success" icon="fas fa-check" percentage_color_inverted
                            :stat="humanResourcesDashboardData.justified_absence_hours_stats.absenece_hours" rounded
                            :loading="dashboardStore.loading" bordered
                            :percentage="humanResourcesDashboardData.justified_absence_hours_stats.increment_percentage"
                            :stat_ext="t('dashboards.hr.hour')"
                            :increase="humanResourcesDashboardData.justified_absence_hours_stats.increment_percentage == 0 ? 'same' : humanResourcesDashboardData.justified_absence_hours_stats.is_increase ? 'more' : 'less'"
                            :percentage_subtitle="humanResourcesDashboardData.justified_absence_hours_stats.is_increase ? t('dashboards.hr.more_since_previous_month') : t('dashboards.hr.less_since_previous_month')" />
                    </div>
                    <div class="column is-4">
                        <StatCard :key="keyIncrement" :title="t('dashboards.hr.unjustified_absence_hours_last_month')"
                            color="danger" icon="fas fa-times" percentage_color_inverted
                            :stat="humanResourcesDashboardData.unjustified_absence_hours_stats.absenece_hours" rounded
                            :loading="dashboardStore.loading" bordered :stat_ext="t('dashboards.hr.hour')"
                            :percentage="humanResourcesDashboardData.unjustified_absence_hours_stats.increment_percentage"
                            :increase="humanResourcesDashboardData.unjustified_absence_hours_stats.increment_percentage == 0 ? 'same' : humanResourcesDashboardData.unjustified_absence_hours_stats.is_increase ? 'more' : 'less'"
                            :percentage_subtitle="humanResourcesDashboardData.unjustified_absence_hours_stats.is_increase ? t('dashboards.hr.more_since_previous_month') : t('dashboards.hr.less_since_previous_month')" />
                    </div>
                </div>
                <div class="columns is-multiline">
                    <div class="column is-12">
                        <div class="asset-category">
                            <div @click="toAddEmployee" v-permission="Permissions.EMPLOYEE_CREATE" class="category">
                                <div class="asset">
                                    <div class="asset-logo">
                                        <i aria-hidden="true" class="lnir lnir-circle-plus"></i>
                                    </div>
                                </div>
                                <div class="asset-name">{{ t('dashboards.hr.add_employee') }}</div>
                            </div>
                            <div @click="toAttendanceTable" v-permission="Permissions.ATTENDANCE_LIST" class="category">
                                <div class="asset">
                                    <div class="asset-logo">
                                        <i aria-hidden="true" class="lnir lnir-calender-alt"></i>
                                    </div>
                                </div>
                                <div class="asset-name">{{ t('dashboards.hr.employee_attendance') }}</div>
                            </div>
                            <div @click="toGenerateSalary" v-permission="Permissions.SALARIES_GENERATE" class="category">
                                <div class="asset">
                                    <div class="asset-logo">
                                        <i aria-hidden="true" class="fas fa-money-check-alt"></i>
                                    </div>
                                </div>
                                <div class="asset-name">{{ t('dashboards.hr.generate_salaries') }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <PendingAttendanceTable  />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '/@src/scss/Styles/Dashboards/hrDashboard.scss';
</style>