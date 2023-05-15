


<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Permissions } from '/@src/utils/consts/rolesPermissions';
import { CashierDashboard, defaultCashierDashboard } from '/@src/models/Others/User/dashboard';
import { useDashboard } from '/@src/stores/Others/User/dashboardStore';
import { getCashierDashboardData } from '/@src/services/Others/User/dashboardService';

const cashierDashboardData = ref<CashierDashboard>(defaultCashierDashboard)
const keyIncrement = ref(0)
const { t } = useI18n()
const router = useRouter()
const dashboardStore = useDashboard()

onMounted(async () => {

    const { cashier_dashboard } = await getCashierDashboardData()
    cashierDashboardData.value = cashier_dashboard
    keyIncrement.value = keyIncrement.value + 1
});

const toCreateSupplierCashReceipt = () => {
    router.push({ name: '/transaction/supplier-employee-cash-receipt/add' })
}
const toCreateClientCashReceipt = () => {
    router.push({ name: '/transaction/customer-cash-receipt/add' })
}

</script>

<template>
    <div class="finance-dashboard dashboard">
        <div class="columns">
            <div class="column is-12">
                <div class="columns is-multiline mb-0">
                    <div class="column is-6">
                        <AccountStatCard :key="keyIncrement" :title="t('dashboards.cashier.iqd_account')" color="primary"
                            icon="mdi:currency-usd-off" :balance="cashierDashboardData.iqd_account.balance"
                            :currency_rate="cashierDashboardData.iqd_account.currency_rate"
                            :code="cashierDashboardData.iqd_account.code" rounded :loading="dashboardStore.loading" />
                    </div>
                    <div class="column is-6">
                        <AccountStatCard :key="keyIncrement" :title="t('dashboards.cashier.usd_account')" color="blue"
                            icon="feather:dollar-sign" :balance="cashierDashboardData.usd_account.balance"
                            :code="cashierDashboardData.usd_account.code"
                            :currency_rate="cashierDashboardData.usd_account.currency_rate" rounded
                            :loading="dashboardStore.loading" />
                    </div>
                </div>
                <div class="columns is-multiline">
                    <div class="column is-12">
                        <div class="asset-category">
                            <div @click="toCreateSupplierCashReceipt"
                                v-permission="Permissions.SUPPLIER_EMPLOYEE_CASH_RECEIPT_CREATE" class="category">
                                <div class="asset">
                                    <div class="asset-logo">
                                        <i class="lnir lnir-ticket-alt-1" aria-hidden="true"></i>
                                    </div>
                                </div>
                                <div class="asset-name">{{ t('dashboards.cashier.supplier_cash_receipt') }}</div>
                            </div>
                            <div @click="toCreateClientCashReceipt" v-permission="Permissions.CLIENT_CASH_RECEIPT_CREATE"
                                class="category">
                                <div class="asset">
                                    <div class="asset-logo">
                                        <i class="lnir lnir-ticket-alt-2" aria-hidden="true"></i>
                                    </div>
                                </div>
                                <div class="asset-name">{{ t('dashboards.cashier.client_cash_receipt') }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="column is-12">
                        <PendingTicketsTable with_title />
                    </div>
                    <div class="column is-12">
                        <CashReceiptsTables with-title :is_for_show="false" :is_on_day="true" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '/@src/scss/Styles/Dashboards/analystDashboard.scss';
</style>