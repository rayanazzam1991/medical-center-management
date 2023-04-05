<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { AdminDashboard, defaultAdminDashboard } from '/@src/models/Others/User/dashboard';
import { getAdminDashboardData } from '/@src/services/Others/User/dashboadService';
import { useDashboard } from '/@src/stores/Others/User/dashboardStore';

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
        <div>
          <ActivityLogTable with-title />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '/@src/scss/Styles/Dashboards/adminDashboard.scss';
</style>
