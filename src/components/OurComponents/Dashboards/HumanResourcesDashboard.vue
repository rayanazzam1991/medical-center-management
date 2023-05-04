<script lang="ts" setup>
import {useI18n} from 'vue-i18n';
import {defaultHRDashboard, HRDashboard} from '/@src/models/Others/User/dashboard';
import {getHumanResourcesDashboardData} from '../../../services/Others/User/dashboardService';
import {Permissions} from '/@src/utils/consts/rolesPermissions';
import {useDashboard} from '/@src/stores/Others/User/dashboardStore';

const humanResourcesDashboardData = ref<HRDashboard>(defaultHRDashboard)
const keyIncrement = ref(0)
const {t} = useI18n()
const router = useRouter()
const dashboardStore = useDashboard()
onMounted(async () => {

  const {dashboard_data} = await getHumanResourcesDashboardData()
  humanResourcesDashboardData.value = dashboard_data
  keyIncrement.value = keyIncrement.value + 1
});
const toAddEmployee = () => {
  router.push({name: '/employee-add/'})
}
const toAttendanceTable = () => {
  router.push({name: '/employee-attendance/'})
}
const toGenerateSalary = () => {
  router.push({name: '/generate-salaries/'})
}
</script>

<template>
  <div class="finance-dashboard dashboard">
    <div class="columns">
      <div class="column is-12">
        <div class="columns is-multiline">
          <div class="column is-3">
            <StatCard :key="keyIncrement" :loading="dashboardStore.loading" :stat="humanResourcesDashboardData.active_employee_count"
                      :title="t('dashboards.hr.active_employee_count')" color="primary" icon="feather:user"
                      rounded/>
          </div>
          <div class="column is-3">
            <StatCard :key="keyIncrement" :loading="dashboardStore.loading" :stat="humanResourcesDashboardData.attendance_employee_count"
                      :title="t('dashboards.hr.attendance_employee_count')" color="blue"
                      icon="lnir lnir-calender-alt" rounded/>
          </div>
          <div class="column is-3">
            <StatCard :key="keyIncrement" :loading="dashboardStore.loading" :stat="humanResourcesDashboardData.service_providers_count"
                      :title="t('dashboards.hr.service_providers_count')" color="purple" icon="feather:briefcase"
                      rounded/>
          </div>
          <div class="column is-3">
            <StatCard :key="keyIncrement" :loading="dashboardStore.loading" :stat="humanResourcesDashboardData.remaining_days_for_generate"
                      :stat_ext="t('dashboards.hr.day')" :title="t('dashboards.hr.remaining_days_for_generate')"
                      color="yellow" icon="fas fa-money-check" rounded/>
          </div>
          <div class="column is-4">
            <StatCard :key="keyIncrement" :increase="humanResourcesDashboardData.absence_hours_stats.increment_percentage == 0 ? 'same' : humanResourcesDashboardData.absence_hours_stats.is_increase ? 'more' : 'less'" :loading="dashboardStore.loading"
                      :percentage="humanResourcesDashboardData.absence_hours_stats.increment_percentage" :percentage_subtitle="humanResourcesDashboardData.absence_hours_stats.is_increase ? t('dashboards.hr.more_since_previous_month') : t('dashboards.hr.less_since_previous_month')"
                      :stat="humanResourcesDashboardData.absence_hours_stats.absenece_hours" :stat_ext="t('dashboards.hr.hour')"
                      :title="t('dashboards.hr.absence_hours_last_month')"
                      color="info"
                      icon="fas fa-running"
                      percentage_color_inverted
                      rounded/>

          </div>
          <div class="column is-4">
            <StatCard :key="keyIncrement" :increase="humanResourcesDashboardData.justified_absence_hours_stats.increment_percentage == 0 ? 'same' : humanResourcesDashboardData.justified_absence_hours_stats.is_increase ? 'more' : 'less'"
                      :loading="dashboardStore.loading" :percentage="humanResourcesDashboardData.justified_absence_hours_stats.increment_percentage" :percentage_subtitle="humanResourcesDashboardData.justified_absence_hours_stats.is_increase ? t('dashboards.hr.more_since_previous_month') : t('dashboards.hr.less_since_previous_month')"
                      :stat="humanResourcesDashboardData.justified_absence_hours_stats.absenece_hours" :stat_ext="t('dashboards.hr.hour')"
                      :title="t('dashboards.hr.justified_absence_hours_last_month')"
                      color="success"
                      icon="fas fa-check"
                      percentage_color_inverted
                      rounded/>
          </div>
          <div class="column is-4">
            <StatCard :key="keyIncrement" :increase="humanResourcesDashboardData.unjustified_absence_hours_stats.increment_percentage == 0 ? 'same' : humanResourcesDashboardData.unjustified_absence_hours_stats.is_increase ? 'more' : 'less'"
                      :loading="dashboardStore.loading" :percentage="humanResourcesDashboardData.unjustified_absence_hours_stats.increment_percentage" :percentage_subtitle="humanResourcesDashboardData.unjustified_absence_hours_stats.is_increase ? t('dashboards.hr.more_since_previous_month') : t('dashboards.hr.less_since_previous_month')"
                      :stat="humanResourcesDashboardData.unjustified_absence_hours_stats.absenece_hours" :stat_ext="t('dashboards.hr.hour')"
                      :title="t('dashboards.hr.unjustified_absence_hours_last_month')" color="danger"
                      icon="fas fa-times"
                      percentage_color_inverted
                      rounded/>
          </div>
        </div>
        <div class="columns is-multiline">
          <div class="column is-12">
            <div class="asset-category">
              <div v-permission="Permissions.EMPLOYEE_CREATE" class="category" @click="toAddEmployee">
                <div class="asset">
                  <div class="asset-logo">
                    <i aria-hidden="true" class="lnir lnir-circle-plus"></i>
                  </div>
                </div>
                <div class="asset-name">{{ t('dashboards.hr.add_employee') }}</div>
              </div>
              <div v-permission="Permissions.ATTENDANCE_LIST" class="category" @click="toAttendanceTable">
                <div class="asset">
                  <div class="asset-logo">
                    <i aria-hidden="true" class="lnir lnir-calender-alt"></i>
                  </div>
                </div>
                <div class="asset-name">{{ t('dashboards.hr.employee_attendance') }}</div>
              </div>
              <div v-permission="Permissions.SALARIES_GENERATE" class="category" @click="toGenerateSalary">
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
          <PendingAttendanceTable/>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '/@src/scss/Styles/Dashboards/hrDashboard.scss';
</style>
