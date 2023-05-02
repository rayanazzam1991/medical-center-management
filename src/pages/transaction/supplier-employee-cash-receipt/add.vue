<route lang="json">
{
  "meta": {
    "requiresAuth": true,
    "permissions": [
      "supplier_employee_cash_receipt_create"
    ]
  }
}
</route>
  
<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { Notyf } from 'notyf';
import { useI18n } from 'vue-i18n';
import { useNotyf } from '/@src/composable/useNotyf';
import { Account, AccountSearchFilter, AccountConsts, defaultAccount } from '/@src/models/Accounting/Account/account';
import { ChartOfAccountConsts } from '/@src/models/Accounting/ChartOfAccount/chartOfAccount';
import { Currency, defaultCurrencySearchFilter } from '/@src/models/Accounting/Currency/currency';
import { CreateRecords, createRecordsWithDefault, TransactionConsts } from '/@src/models/Accounting/Transaction/record';
import { getAccountsList } from '/@src/services/Accounting/Account/accountService';
import { getCurrenciesList } from '/@src/services/Accounting/Currency/currencyService';
import { useTransaction } from '/@src/stores/Accounting/Transaction/transactionStore';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { ErrorMessage, useForm } from 'vee-validate';
import { createRecords } from '/@src/services/Accounting/Transaction/transactionService';
import { supplierCashReceiptValidationSchema } from '/@src/rules/Accounting/Transaction/supplierCashReceiptValidation';
import { onMounted } from 'vue';



const { t } = useI18n()
const viewWrapper = useViewWrapper();
viewWrapper.setPageTitle(t('supplier_cash_receipt.form.title'));
const head = useHead({
  title: t('supplier_cash_receipt.form.title'),
});
const notif = useNotyf() as Notyf
const router = useRouter()
const transactionStore = useTransaction()
const pageTitle = t('supplier_cash_receipt.form.title');
const cashAccountsList = ref<Account[]>([])
const suppliersAccountsList = ref<Account[]>([])
const employeesAccountsList = ref<Account[]>([])
const currenciesList = ref<Currency[]>([])
const availableCurrenciesList = ref<Currency[]>([])
const supplierEmployeeAccountId = ref<number>(0)
const cashAccountId = ref<number>(0)
const currencyId = ref<number>(0)
const currencyRate = ref<number>(1)
const enableCurrencyRate = ref(false)
const cashAmount = ref(0)
const createRecord = ref<CreateRecords>(createRecordsWithDefault)
const currencyDifferencesAccountId = ref<number>(0)
const currencyDifferencesAmount = ref<number>(0)
const currencyDifferencesCashAmount = ref<number>(0)
const currencyDifferencesSupplierAmount = ref<number>(0)
const confirmPopup = ref<boolean>(false)
const keyIncrement = ref(0)
const isEmployee = ref(false)

onMounted(async () => {
  let accountSearchFilter = {} as AccountSearchFilter
  accountSearchFilter.status = AccountConsts.ACTIVE
  accountSearchFilter.per_page = 500
  const { accounts } = await getAccountsList(accountSearchFilter)
  accounts.forEach((account) => {
    if (account.chart_account?.code == ChartOfAccountConsts.CASH_CODE) {
      cashAccountsList.value.push(account)
    } else
      if (account.chart_account?.code == ChartOfAccountConsts.SUPPLIER_CODE) {
        suppliersAccountsList.value.push(account)
      } else if (account.chart_account?.code == ChartOfAccountConsts.EMPLOYEE_CODE && account.code != ChartOfAccountConsts.EMPLOYEE_EMPLOYEE_CODE) {
        employeesAccountsList.value.push(account)
      }
      else if (account.chart_account?.code == ChartOfAccountConsts.CURRENCY_DIFFERENCES_CODE) {
        currencyDifferencesAccountId.value = account.id ?? 0
      }
  });
  const { currencies } = await getCurrenciesList(defaultCurrencySearchFilter)
  currenciesList.value = currencies
  availableCurrenciesList.value = currencies

})

const validationSchema = supplierCashReceiptValidationSchema
const { handleSubmit } = useForm({
  validationSchema,
  initialValues: {
    supplier_account: 0,
    cash_account: 0,
    revenue_amount: 0,
    currency_id: 0,
    currency_rate: 1,
    date: "",
    note: undefined
  }
});
const onSubmitConfirmation = handleSubmit(() => {
  const cashAccount = cashAccountsList.value.find((account) => account.id == cashAccountId.value) ?? defaultAccount
  const supplierAccount = suppliersAccountsList.value.find((account) => account.id == supplierEmployeeAccountId.value) ?? defaultAccount
  if (!cashAccount.currency?.is_main && Number(cashAccount.balance) != 0) {
    currencyDifferencesCashAmount.value = cashAmount.value - (cashAmount.value * cashAccount.currency_rate / currencyRate.value)
  } else {
    currencyDifferencesCashAmount.value = 0
  }
  if (!supplierAccount.currency?.is_main && Number(supplierAccount.balance) != 0) {
    currencyDifferencesSupplierAmount.value = cashAmount.value - (cashAmount.value * supplierAccount.currency_rate / currencyRate.value)
  } else {
    currencyDifferencesSupplierAmount.value = 0
  }
  currencyDifferencesAmount.value = currencyDifferencesCashAmount.value - currencyDifferencesSupplierAmount.value
  confirmPopup.value = true

})
const onSubmit = async () => {
  const cashAccount = cashAccountsList.value.find((account) => account.id == cashAccountId.value) ?? defaultAccount
  createRecord.value.accounts = []
  if (isEmployee.value) {
    const employeeAccount = employeesAccountsList.value.find((account) => account.id == supplierEmployeeAccountId.value) ?? defaultAccount
    createRecord.value.accounts.push(
      { account_id: cashAccountId.value, amount: !cashAccount.currency?.is_main ? cashAmount.value - currencyDifferencesCashAmount.value : cashAmount.value, type: AccountConsts.CREDIT_TYPE },
      { account_id: supplierEmployeeAccountId.value, amount: !employeeAccount.currency?.is_main ? cashAmount.value - currencyDifferencesSupplierAmount.value : cashAmount.value, type: AccountConsts.DEBIT_TYPE })
    if (currencyDifferencesAmount.value != 0) {
      createRecord.value.accounts.push(
        { account_id: currencyDifferencesAccountId.value, amount: Math.abs(currencyDifferencesAmount.value), type: currencyDifferencesAmount.value > 0 ? AccountConsts.CREDIT_TYPE : AccountConsts.DEBIT_TYPE },
      )
    }
    createRecord.value.currency_id = currencyId.value
    createRecord.value.currency_rate = currencyRate.value
    createRecord.value.transaction_type_id = 1
    createRecord.value.recordType = TransactionConsts.EMPLOYEE_CASH_RECEIPT
    createRecord.value.amount = cashAmount.value
  }

  else {
    const supplierAccount = suppliersAccountsList.value.find((account) => account.id == supplierEmployeeAccountId.value) ?? defaultAccount
    createRecord.value.accounts.push(
      { account_id: cashAccountId.value, amount: !cashAccount.currency?.is_main ? cashAmount.value - currencyDifferencesCashAmount.value : cashAmount.value, type: AccountConsts.CREDIT_TYPE },
      { account_id: supplierEmployeeAccountId.value, amount: !supplierAccount.currency?.is_main ? cashAmount.value - currencyDifferencesSupplierAmount.value : cashAmount.value, type: AccountConsts.DEBIT_TYPE })
    if (currencyDifferencesAmount.value != 0) {
      createRecord.value.accounts.push(
        { account_id: currencyDifferencesAccountId.value, amount: Math.abs(currencyDifferencesAmount.value), type: currencyDifferencesAmount.value > 0 ? AccountConsts.CREDIT_TYPE : AccountConsts.DEBIT_TYPE },
      )
    }
    createRecord.value.currency_id = currencyId.value
    createRecord.value.currency_rate = currencyRate.value
    createRecord.value.transaction_type_id = 1
    createRecord.value.recordType = TransactionConsts.SUPPLIER_CASH_RECEIPT
    createRecord.value.amount = cashAmount.value
  }

  const { success, message } = await createRecords(createRecord.value)
  if (success) {
    notif.success(t('toast.success.add'));
    router.push({ path: `/transaction/supplier-employee-cash-receipt` });

  } else {
    notif.error({ message: message, duration: 3000 })
  }
  confirmPopup.value = false
}

watch(currencyId, (value) => {
  let selectedCurrency = currenciesList.value.find((currency) => currency.id === value);
  if (selectedCurrency?.is_main) {
    enableCurrencyRate.value = false
    currencyRate.value = 1
  } else {
    enableCurrencyRate.value = true
  }
})
watch(cashAccountId, (value) => {
  if (value) {

    let selectedCashAccount = cashAccountsList.value.find((account) => account.id === value);
    availableCurrenciesList.value = []
    currenciesList.value.forEach((currency) => {
      if (currency.is_main == selectedCashAccount?.currency?.is_main) {
        availableCurrenciesList.value.push(currency)
      }
    });
    currencyId.value = 0
  } else {
    availableCurrenciesList.value = currenciesList.value
  }
})


</script>
<template>
  <div class="page-content-inner">
    <div class="form-layout ">
      <div class="form-outer">
        <div class="form-header">
          <div class="form-header-inner">
            <div class="left">
              <h3>{{ pageTitle }}</h3>

            </div>
            <div class="right">
              <div class="buttons">
                <VButton :loading="transactionStore.loading" @click="onSubmitConfirmation" color="primary" raised> {{
                  t('supplier_cash_receipt.form.button') }} </VButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <form class="form-layout" @submit.prevent="onSubmitConfirmation">
      <div class="form-outer">
        <div class="form-body">
          <div class="form-fieldset">
            <div class="fieldset-heading">
              <h4>{{ pageTitle }}</h4>
            </div>
            <div class="columns is-multiline">
              <div class="form-fieldset">
                <div class="columns is-multiline">
                  <div class="is-flex is-justify-content-center">
                    <VControl class="ml-3">
                      <VSwitchSegment :key="keyIncrement" v-model="isEmployee"
                        :label-true="t('supplier_cash_receipt.form.employee')"
                        :label-false="t('supplier_cash_receipt.form.supplier')" color="success" />
                    </VControl>
                  </div>
                </div>
              </div>
              <div class="column is-12" v-if="!isEmployee">
                <VField id="supplier_employee_account">
                  <VLabel class="required">{{ t('supplier_cash_receipt.form.supplier_account') }}</VLabel>
                  <VControl>
                    <VSelect v-model="supplierEmployeeAccountId">
                      <VOption :value="0"> {{
                        t('supplier_cash_receipt.form.select_account') }}</VOption>
                      <VOption v-for="account in suppliersAccountsList" :value="account.id">
                        {{ account.code }} - {{ account.name }}
                      </VOption>
                    </VSelect>
                    <ErrorMessage class="help is-danger" name="supplier_employee_account" />
                  </VControl>
                </VField>
              </div>
              <div class="column is-12" v-if="isEmployee">
                <VField id="supplier_employee_account">
                  <VLabel class="required">{{ t('supplier_cash_receipt.form.employee_account') }}</VLabel>
                  <VControl>
                    <VSelect v-model="supplierEmployeeAccountId">
                      <VOption :value="0"> {{
                        t('supplier_cash_receipt.form.select_account') }}</VOption>
                      <VOption v-for="account in employeesAccountsList" :value="account.id">
                        {{ account.code }} - {{ account.name }}
                      </VOption>
                    </VSelect>
                    <ErrorMessage class="help is-danger" name="supplier_employee_account" />
                  </VControl>
                </VField>
              </div>
              <div class="column is-12">
                <VField id="amount">
                  <VLabel class="required">{{ t('supplier_cash_receipt.form.amount') }}</VLabel>
                  <VControl>
                    <VInput v-model="cashAmount" placeholder="" type="number" />
                    <ErrorMessage class="help is-danger" name="amount" />
                  </VControl>
                </VField>
              </div>
              <div class="column is-12">
                <VField id="cash_account">
                  <VLabel class="required">{{ t('supplier_cash_receipt.form.cash_account') }}</VLabel>
                  <VControl>
                    <VSelect v-model="cashAccountId">
                      <VOption :value="0"> {{ t('supplier_cash_receipt.form.select_account')
                      }}</VOption>
                      <VOption v-for="account in cashAccountsList" :value="account.id">
                        {{ account.code }} - {{ account.name }}
                      </VOption>
                    </VSelect>
                    <ErrorMessage class="help is-danger" name="cash_account" />
                  </VControl>
                </VField>
              </div>
              <div class="column is-12">
                <VField id="currency_id">
                  <VLabel class="required">{{ t('supplier_cash_receipt.form.currency') }}</VLabel>
                  <VControl>
                    <VSelect v-model="currencyId">
                      <VOption :value="0"> {{ t('supplier_cash_receipt.form.select_currency')
                      }}</VOption>
                      <VOption v-for="currency in availableCurrenciesList" :value="currency.id">
                        {{ currency.code }} - {{ currency.name }}
                      </VOption>
                    </VSelect>
                    <ErrorMessage class="help is-danger" name="currency_id" />
                  </VControl>
                </VField>
              </div>
              <div class="column is-12">
                <VField id="currency_rate">
                  <VLabel class="required">{{ t('supplier_cash_receipt.form.currency_rate') }}</VLabel>
                  <VControl icon="feather:dollar-sign">
                    <VInput :disabled="!enableCurrencyRate" v-model="currencyRate" placeholder="" type="number" />
                    <ErrorMessage class="help is-danger" name="currency_rate" />
                  </VControl>
                </VField>
              </div>
              <div class="column is-12">
                <VField id="date">
                  <VLabel class="required">{{ t('supplier_cash_receipt.form.date') }}</VLabel>
                  <VControl icon="feather:chevrons-right">
                    <VInput v-model="createRecord.date" placeholder="" type="date" />
                    <ErrorMessage class="help is-danger" name="date" />
                  </VControl>
                </VField>
              </div>
              <div class="column is-12">
                <VField id="note">
                  <VLabel>{{ t('supplier_cash_receipt.form.note') }}</VLabel>
                  <VControl icon="feather:chevrons-right">
                    <VTextarea v-model="createRecord.note" />
                    <ErrorMessage class="help is-danger" name="note" />
                  </VControl>
                </VField>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
  <VModal :title="t('supplier_cash_receipt.form.confirm_popup.title')" :open="confirmPopup" actions="center"
    @close="confirmPopup = false">
    <template #content>
      <VPlaceholderSection :title="t('supplier_cash_receipt.form.confirm_popup.confirmation')"
        :subtitle="t('supplier_cash_receipt.form.confirm_popup.currency_difference', { currency_difference: currencyDifferencesAmount })" />
    </template>
    <template #action="{ close }">
      <VLoader size="small" :active="transactionStore.loading">
        <VButton color="primary" raised @click="onSubmit">{{ t('modal.buttons.confirm') }}
        </VButton>
      </VLoader>
    </template>
  </VModal>
</template>


<style  scoped lang="scss">
@import '/@src/scss/styles/formPage.scss';
</style>
