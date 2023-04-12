<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ReceptionistDashboard, defaultReceptionistDashboard } from '/@src/models/Others/User/dashboard';
import { getReceptionistDashboardData } from '../../../services/Others/User/dashboardService';
import { Permissions } from '/@src/utils/consts/rolesPermissions';
import { useDashboard } from '/@src/stores/Others/User/dashboardStore';

const receptionistDashboardData = ref<ReceptionistDashboard>(defaultReceptionistDashboard)
const keyIncrement = ref(0)
const { t } = useI18n()
const router = useRouter()
const dashboardStore = useDashboard()
onMounted(async () => {

    const { receptionist_dashboard } = await getReceptionistDashboardData()
    receptionistDashboardData.value = receptionist_dashboard
    keyIncrement.value = keyIncrement.value + 1
});
const toAddCustomer = () => {
    router.push({ name: '/customer-add/' })
}
const toAddTicket = () => {
    router.push({ name: '/ticket/add' })
}
const toWaitingRooms = () => {
    router.push({ name: '/waiting-list/' })
}
</script>

<template>
    <div class="finance-dashboard dashboard">
        <div class="columns">
            <div class="column is-12">
                <div class="columns is-multiline">
                    <div class="column is-4">
                        <StatCard :key="keyIncrement" :title="t('dashboards.receptionist.clients_in_center')"
                            color="primary" icon="feather:user" :stat="receptionistDashboardData.clients_in_center" rounded
                            :loading="dashboardStore.loading" />
                    </div>
                    <div class="column is-4">
                        <StatCard :key="keyIncrement" :title="t('dashboards.receptionist.active_clients_count')"
                            color="yellow" icon="material-symbols:person"
                            :stat="receptionistDashboardData.active_clients_count" rounded
                            :loading="dashboardStore.loading" />
                    </div>
                    <div class="column is-4">
                        <StatCard :key="keyIncrement" :title="t('dashboards.receptionist.served_services')" color="orange"
                            icon="lnir lnir-service" :stat="receptionistDashboardData.served_services_stat.count" rounded
                            :loading="dashboardStore.loading"
                            :percentage="receptionistDashboardData.served_services_stat.increment_percentage"
                            :increase="receptionistDashboardData.served_services_stat.increment_percentage == 0 ? 'same' : receptionistDashboardData.served_services_stat.is_increase ? 'more' : 'less'"
                            :percentage_subtitle="receptionistDashboardData.served_services_stat.is_increase ? t('dashboards.receptionist.more_since_last_month') : t('dashboards.receptionist.less_since_last_month')" />
                    </div>
                </div>
                <div class="columns is-multiline">
                    <div class="column is-12">
                        <div class="asset-category">
                            <div @click="toAddCustomer" v-permission="Permissions.CUSTOMER_CREATE" class="category">
                                <div class="asset">
                                    <div class="asset-logo">
                                        <i aria-hidden="true" class="lnir lnir-circle-plus"></i>
                                    </div>
                                </div>
                                <div class="asset-name">{{ t('dashboards.receptionist.add_customer') }}</div>
                            </div>
                            <div @click="toAddTicket" v-permission="Permissions.TICKET_CREATE" class="category">
                                <div class="asset">
                                    <div class="asset-logo">
                                        <i aria-hidden="true" class="lnir lnir-ticket-alt"></i>
                                    </div>
                                </div>
                                <div class="asset-name">{{ t('dashboards.receptionist.add_ticket') }}</div>
                            </div>
                            <div @click="toWaitingRooms" v-permission="Permissions.WAITING_LIST_LIST" class="category">
                                <div class="asset">
                                    <div class="asset-logo">
                                        <i aria-hidden="true" class="lnir lnir-list"></i>
                                    </div>
                                </div>
                                <div class="asset-name">{{ t('dashboards.receptionist.waiting_lists') }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="my-4">
                    <CustomerTable is-for-dashboard with-title />
                </div>
                <div class="my-4">
                    <ReminderTable is-for-dashboard today-only with-title />
                </div>
                <div class="my-4">
                    <ServicesCardTable />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '/@src/scss/Styles/Dashboards/receptionistDashboard.scss';
</style>