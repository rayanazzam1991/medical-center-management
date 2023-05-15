


<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Permissions } from '/@src/utils/consts/rolesPermissions';
//@ts-ignore
import debounce from 'lodash.debounce';
import { useNotyf } from '/@src/composable/useNotyf';
import { Notyf } from 'notyf';
import { getPendingTicketByBarcode } from '/@src/services/Sales/Ticket/ticketService';
import { CashierDashboard, defaultCashierDashboard } from '/@src/models/Others/User/dashboard';
import { useDashboard } from '/@src/stores/Others/User/dashboardStore';
import { getCashierDashboardData } from '/@src/services/Others/User/dashboardService';

const cashierDashboardData = ref<CashierDashboard>(defaultCashierDashboard)
const keyIncrement = ref(0)
const { t } = useI18n()
const notif = useNotyf() as Notyf

const router = useRouter()
const showScanTicketBarcode = ref(false)
const ticketBarcode = ref<number | undefined>(undefined)
const input = ref<HTMLInputElement>()
const barcodeSearchLoading = ref(false)
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
const onClickScanBarcode = () => {

    ticketBarcode.value = undefined
    showScanTicketBarcode.value = !showScanTicketBarcode.value
    if (showScanTicketBarcode.value) {
        input.value && input.value.focus()
    }
}

watch(ticketBarcode, async (value) => {
    if (value) {
        await debouncedTotalAmount()
    }
})
const debouncedTotalAmount = debounce(async () => {
    if (ticketBarcode.value) {
        barcodeSearchLoading.value = true
        const { ticket, success, message } = await getPendingTicketByBarcode(ticketBarcode.value)
        if (success) {
            router.push({ path: `/pending-ticket/${ticket.id}/edit` });
            barcodeSearchLoading.value = false
        } else {
            notif.error({ message: message, duration: 3000 })
            ticketBarcode.value = undefined
            input.value && input.value.focus()
            barcodeSearchLoading.value = false
        }
    }
}, 100)

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
                            <div @click="onClickScanBarcode" v-permission="Permissions.CONFIRM_PAYMENT_TICKET"
                                class="category">
                                <div class="asset">
                                    <div class="asset-logo">
                                        <i class="fas fa-barcode" aria-hidden="true"></i>
                                    </div>
                                </div>
                                <div class="asset-name">{{ t('dashboards.accountant.confirm_ticket_payment') }}</div>
                            </div>

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
                    <div class="form-layout column is-12" :class="[!showScanTicketBarcode && 'hidden-position']">
                        <div :class="[!showScanTicketBarcode && 'input-hidden-position', showScanTicketBarcode && 'input-show-position']"
                            class="form-outer">
                            <VPlaceholderSection :title="t('dashboards.accountant.scan_barcode_helper')" />
                            <div class="form-fieldset">
                                <div class="columns is-multiline">
                                    <div class="column is-12" style="position: relative;">
                                        <div v-if="barcodeSearchLoading" class="loader is-loading custom-loader">
                                        </div>

                                        <VField class="column">
                                            <VControl class="control">
                                                <input class="input" :disabled="barcodeSearchLoading"
                                                    v-model="ticketBarcode" type="number" ref="input" />
                                            </VControl>
                                        </VField>
                                    </div>
                                </div>
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
@import '/@src/scss/Styles/Dashboards/accountantDashboard.scss';

.custom-loader {
    padding: 1rem;
    margin: -1.5rem;
    margin-top: 1rem;
}

.input-hidden-position {
    position: absolute;
    left: -99999px;
}

.input-show-position {
    position: inherit;
    min-height: 200px;
    height: 30vh;
    max-height: 500px;
    width: 100%;
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
    animation: slideIn .2s ease-in-out;
}

.control {
    width: 300px !important;
}

@keyframes slideIn {
    0% {
        transform: translateY(-25%);
        opacity: 0;
    }

    50% {
        transform: translateY(-10%);
        opacity: 0.3;
    }

    100% {
        transform: translateY(0%);
        opacity: 1;

    }
}
</style>