


<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Permissions } from '/@src/utils/consts/rolesPermissions';


const { t } = useI18n()
const router = useRouter()
const showScanTicketBarcode = ref(false)
const keyIncement = ref(0)
const ticketBarcode = ref<number | undefined>(undefined)
const input = ref<HTMLInputElement>()

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
    console.log('asd')
    input.value && input.value.focus()
  }
}

</script>

<template>
  <div class="finance-dashboard dashboard">
    <div class="columns">
      <div class="column is-12">
        <div class="columns is-multiline">
          <div class="column is-12">
            <div class="asset-category">
              <div @click="onClickScanBarcode" v-permission="Permissions.CONFIRM_PAYMENT_TICKET" class="category">
                <div class="asset">
                  <div class="asset-logo">
                    <i class="fas fa-barcode" aria-hidden="true"></i>
                  </div>
                </div>
                <div class="asset-name">{{ t('dashboards.accountant.confirm_ticket_payment') }}</div>
              </div>
              <div @click="toCreateSupplierCashReceipt" v-permission="Permissions.SUPPLIER_EMPLOYEE_CASH_RECEIPT_CREATE"
                class="category">
                <div class="asset">
                  <div class="asset-logo">
                    <i class="lnir lnir-ticket-alt-1" aria-hidden="true"></i>
                  </div>
                </div>
                <div class="asset-name">{{ t('dashboards.accountant.supplier_cash_receipt') }}</div>
              </div>
              <div @click="toCreateClientCashReceipt" v-permission="Permissions.CLIENT_CASH_RECEIPT_CREATE"
                class="category">
                <div class="asset">
                  <div class="asset-logo">
                    <i class="lnir lnir-ticket-alt-2" aria-hidden="true"></i>
                  </div>
                </div>
                <div class="asset-name">{{ t('dashboards.accountant.client_cash_receipt') }}</div>
              </div>
            </div>
          </div>
          <div class="form-layout column is-12" :class="[!showScanTicketBarcode && 'hidden-position']">
            <div
              :class="[!showScanTicketBarcode && 'input-hidden-position', showScanTicketBarcode && 'input-show-position']"
              class="form-outer">
              <VPlaceholderSection :title="t('dashboards.accountant.scan_barcode_helper')" />
              <div class="form-fieldset">
                <div class="columns is-multiline">
                  <div class="column is-12">
                    <VField class="column">
                      <VControl class="control">
                        <input class="input" v-model="ticketBarcode" type="number" ref="input" />
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
