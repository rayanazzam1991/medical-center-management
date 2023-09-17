


<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Permissions } from '/@src/utils/consts/rolesPermissions';
import { getPendingTicketByBarcode } from '/@src/services/Sales/Ticket/ticketService';
import { useNotyf } from '/@src/composable/useNotyf';
import { Notyf } from 'notyf';
//@ts-ignore
import debounce from 'lodash.debounce';
import { getAccountsList } from '/@src/services/Accounting/Account/accountService';
import { Account, AccountConsts, AccountSearchFilter } from '/@src/models/Accounting/Account/account';
import { Employee, EmployeeSearchFilter } from '/@src/models/Employee/employee';
import { UserStatusConsts } from '/@src/models/Others/UserStatus/userStatus';
import { getEmployeesList } from '/@src/services/Employee/employeeService';
import { ChartOfAccountConsts } from '/@src/models/Accounting/ChartOfAccount/chartOfAccount';
import { CurrencyConsts } from '/@src/models/Accounting/Currency/currency';
import { useAccount } from '/@src/stores/Accounting/Account/accountStore';
import sleep from '/@src/utils/sleep';


const { t } = useI18n()
const notif = useNotyf() as Notyf
const router = useRouter()
const showScanTicketBarcode = ref(false)
const ticketBarcode = ref<number | undefined>(undefined)
const input = ref<HTMLInputElement>()
const barcodeSearchLoading = ref(false)
const IQDcashAccountsList = ref<Account[]>([])
const USDcashAccountsList = ref<Account[]>([])
const keyIncrementResetCashAccounts = ref(0)
const resetCashAccountPopup = ref(false)
const cashiersList = ref<Employee[]>()
const accountStore = useAccount()
const resetCashSetupLoading = ref(false)
const resetCashAccountSetup = async () => {
  resetCashSetupLoading.value = true
  while (accountStore.loading) {
    await sleep()
  }
  await getAllAccounts()
  const employeesSearchFilter: EmployeeSearchFilter = {
    is_cashier: true,
    user_status_id: UserStatusConsts.ACTIVE,
    per_page: 5000
  }
  const { employees, success, message } = await getEmployeesList(employeesSearchFilter)
  if (success) {
    cashiersList.value = employees
    keyIncrementResetCashAccounts.value++
    resetCashAccountPopup.value = true
  } else {
    notif.error(message)
  }
  resetCashSetupLoading.value = false
}
const getAllAccounts = async () => {
  IQDcashAccountsList.value = []
  USDcashAccountsList.value = []
  let accountSearchFilter = {} as AccountSearchFilter
  accountSearchFilter.status = AccountConsts.ACTIVE
  accountSearchFilter.per_page = 5000
  const { accounts } = await getAccountsList(accountSearchFilter)
  accounts.forEach((account) => {
    if (account.chart_account?.code == ChartOfAccountConsts.CASH_CODE) {
      if (account.currency?.code == CurrencyConsts.IQD_CODE) {
        IQDcashAccountsList.value.push(account)
      } else {
        USDcashAccountsList.value.push(account)
      }
    }
  });
}
const cashAccountPostReset = async () => {
  resetCashAccountPopup.value = false
}
const popUpTrigger = (value: boolean) => {
  resetCashAccountPopup.value = value
}

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
              <div v-permission="Permissions.CASH_ACCOUNT_RESET" class="category" @click="resetCashAccountSetup">
                <div class="asset">
                  <div class="asset-logo">
                    <i aria-hidden="true" class="fas fa-cash-register"></i>
                  </div>
                </div>
                <div class="asset-name">{{ t('dashboards.accountant.reset_cash') }}
                  <div v-if="resetCashSetupLoading" class="loader is-loading reset-loader">
                  </div>
                </div>
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
                  <div class="column is-12" style="position: relative;">
                    <div v-if="barcodeSearchLoading" class="loader is-loading custom-loader">
                    </div>
                    <VField class="column">
                      <VControl class="control">
                        <input class="input" :disabled="barcodeSearchLoading" v-model="ticketBarcode" type="number"
                          ref="input" />
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
          <div class="column is-12">
            <ResetCashAccountsTable with-title />
          </div>
        </div>
      </div>
    </div>
  </div>
  <ResetCashAccountsModal :key="keyIncrementResetCashAccounts" :openModal="resetCashAccountPopup" :in-dashboard="true"
    @reseted="cashAccountPostReset" :iqd-cash-accounts="IQDcashAccountsList" :usd-cash-accounts="USDcashAccountsList"
    @openModal="popUpTrigger" :cashiers-list="cashiersList" />
</template>

<style scoped lang="scss">
@import '/@src/scss/styles/Dashboards/accountantDashboard.scss';

.custom-loader {
  padding: 1rem;
  margin: -1.5rem;
  margin-top: 1rem;
}

.reset-loader {
  bottom: 20px;
  right: 110px;
  margin-bottom: -20px;
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
