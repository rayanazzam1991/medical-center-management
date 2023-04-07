


<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Permissions } from '/@src/utils/consts/rolesPermissions';


const { t } = useI18n()
const router = useRouter()


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
        <div class="columns is-multiline">
          <div class="column is-12">
            <div class="asset-category">
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
          <div class="column is-12">
            <PendingTicketsTable with_title />
          </div>
          <div class="column is-12">
            <ClientsCashReceiptsTable with-title :is_for_show="false" :is_on_day="true" />
          </div>
          <div class="column is-12">
            <SupplierEmployeeCashReceiptsTable with-title :is_for_show="false" :is_on_day="true" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '/@src/scss/Styles/Dashboards/accountantDashboard.scss';
</style>
