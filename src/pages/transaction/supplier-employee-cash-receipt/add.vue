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
import { Currency, CurrencyConsts, defaultCurrencySearchFilter } from '/@src/models/Accounting/Currency/currency';
import { CreateRecords, createRecordsWithDefault, TransactionConsts } from '/@src/models/Accounting/Transaction/record';
import { getAccountsList, getAuthenticatedCashierAccounts, getAccountIdByContactId } from '/@src/services/Accounting/Account/accountService';
import { getCurrenciesList } from '/@src/services/Accounting/Currency/currencyService';
import { useTransaction } from '/@src/stores/Accounting/Transaction/transactionStore';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { ErrorMessage, useForm } from 'vee-validate';
import { createRecords } from '/@src/services/Accounting/Transaction/transactionService';
import { supplierCashReceiptValidationSchema } from '/@src/rules/Accounting/Transaction/supplierCashReceiptValidation';
import { onMounted } from 'vue';
import { useAuth } from '/@src/stores/Others/User/authStore';
import { GetAccountIdByContactIdRequestData } from '/@src/models/Accounting/AccountContact/accountContact';


const { t } = useI18n()
const viewWrapper = useViewWrapper();
viewWrapper.setPageTitle(t('supplier_cash_receipt.form.title'));
const head = useHead({
  title: t('supplier_cash_receipt.form.title'),
});
const route = useRoute()
const notif = useNotyf() as Notyf
const router = useRouter()
const transactionStore = useTransaction()
const pageTitle = t('supplier_cash_receipt.form.title');
const IQDcashAccountsList = ref<Account[]>([])
const USDcashAccountsList = ref<Account[]>([])
const suppliersAccountsList = ref<Account[]>([])
const employeesAccountsList = ref<Account[]>([])
const currenciesList = ref<Currency[]>([])
const availableCurrenciesList = ref<Currency[]>([])
const supplierEmployeeAccountId = ref<number>(0)
const USDcashAccountId = ref<number>(0)
const IQDcashAccountId = ref<number>(0)
const currencyRate = ref<number>(1)
const enableSelectSupplierEmployee = ref(false)
const enableSelectIsEmployee = ref(false)
const IQDcashAmount = ref(0)
const USDcashAmount = ref(0)
const USDcashAmountInUSD = ref(0)
const createRecord = ref<CreateRecords>(createRecordsWithDefault)
const currencyDifferencesAccountId = ref<number>(0)
const currencyDifferencesAmount = ref<number>(0)
const currencyDifferencesCashAmount = ref<number>(0)
const currencyDifferencesSupplierAmount = ref<number>(0)
const confirmPopup = ref<boolean>(false)
const keyIncrement = ref(0)
const isEmployee = ref(false)
const userAuth = useAuth();
const employeeId = ref(0)
const haveCashierRole = userAuth.getUser()?.roles?.find((role) => role.name == 'Cashier')
const isCashier = haveCashierRole ? true : false
if (Number.isInteger(Number(route.query.employee_id)) && !Number.isNaN(Number(route.query.employee_id))) {
  employeeId.value = Number(route.query.employee_id)
  isEmployee.value = true
} else {
  employeeId.value = 0
  enableSelectSupplierEmployee.value = true
  enableSelectIsEmployee.value = true
  isEmployee.value = false
}

onMounted(async () => {

  if (isCashier) {
    const { cashierAccounts } = await getAuthenticatedCashierAccounts()
    cashierAccounts.forEach((account) => {
      if (account.chart_account?.code == ChartOfAccountConsts.CASH_CODE) {
        if (account.currency?.code == CurrencyConsts.IQD_CODE) {
          IQDcashAccountsList.value.push(account)
          IQDcashAccountId.value = account.id ?? 0
        } else {
          USDcashAccountsList.value.push(account)
          USDcashAccountId.value = account.id ?? 0
        }
      }
    });
  }

  let accountSearchFilter = {} as AccountSearchFilter
  accountSearchFilter.status = AccountConsts.ACTIVE
  accountSearchFilter.per_page = 500
  const { accounts } = await getAccountsList(accountSearchFilter)
  accounts.forEach((account) => {
    if (account.chart_account?.code == ChartOfAccountConsts.CASH_CODE) {
      if (!isCashier) {
        if (account.currency?.code == CurrencyConsts.IQD_CODE) {
          IQDcashAccountsList.value.push(account)
        } else {
          USDcashAccountsList.value.push(account)
        }
      }
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
  const usdCurrency = currenciesList.value.find((currency) => !currency.is_main)
  if (usdCurrency) {
    currencyRate.value = usdCurrency.rate
  }
  createRecord.value.date = new Date().toISOString().substring(0, 10)
  if (employeeId.value != 0) {
    const data: GetAccountIdByContactIdRequestData = {
      contact_id: employeeId.value,
      contact_type: 'Employee'
    }
    const { account_id, success, message } = await getAccountIdByContactId(data)
    if (success) {
      supplierEmployeeAccountId.value = account_id
    } else {
      notif.error({ message: message, duration: 3000 })
    }
  }

})

const validationSchema = supplierCashReceiptValidationSchema
const { handleSubmit, setFieldValue } = useForm({
  validationSchema,
  initialValues: {
    supplier_employee_account: 0,
    iqd_cash_account: IQDcashAccountId.value,
    usd_cash_account: USDcashAccountId.value,
    iqd_amount: 0,
    usd_amount: 0,
    currency_id: 0,
    currency_rate: currencyRate.value,
    date: new Date().toISOString().substring(0, 10),
    note: undefined
  }
});
const onSubmitConfirmation = handleSubmit(async () => {
  if (IQDcashAmount.value == 0 && USDcashAmount.value == 0) {
    notif.error({ message: t('toast.error.please_select_at_least_iqd_or_usd') })
    return
  }
  if (IQDcashAmount.value != 0 && IQDcashAccountId.value == 0) {
    notif.error({ message: t('toast.error.please_select_cash_account') })
    return

  }
  if (USDcashAmount.value != 0 && USDcashAccountId.value == 0) {
    notif.error({ message: t('toast.error.please_select_cash_account') })
    return

  }
  if (isEmployee.value) {
    const employeeAccount = employeesAccountsList.value.find((account) => account.id == supplierEmployeeAccountId.value)
    if (USDcashAmount.value == 0 && employeeAccount?.currency?.code == CurrencyConsts.IQD_CODE) {
      currencyRate.value = 1
      const notyf = new Notyf({
        duration: 4000,
        position: {
          x: 'right',
          y: 'bottom',
        },
        types: [
          {
            type: 'info',
            background: useCssVar('--info').value,
            icon: {
              className: 'fas fa-info-circle',
              tagName: 'i',
              text: '',
            },
          },
        ],
      })
      notyf.open({
        type: 'info',
        message: t('toast.info.currency_rate_is_set_to_1'),
      })
    }
  } else {
    const supplierAccount = suppliersAccountsList.value.find((account) => account.id == supplierEmployeeAccountId.value)
    if (USDcashAmount.value == 0 && supplierAccount?.currency?.code == CurrencyConsts.IQD_CODE) {
      currencyRate.value = 1
      const notyf = new Notyf({
        duration: 4000,
        position: {
          x: 'right',
          y: 'bottom',
        },
        types: [
          {
            type: 'info',
            background: useCssVar('--info').value,
            icon: {
              className: 'fas fa-info-circle',
              tagName: 'i',
              text: '',
            },
          },
        ],
      })
      notyf.open({
        type: 'info',
        message: t('toast.info.currency_rate_is_set_to_1'),
      })
    }

  }
  const USDcashAccount = USDcashAccountsList.value.find((account) => account.id == USDcashAccountId.value) ?? defaultAccount
  if (USDcashAmount.value != 0) {
    currencyDifferencesCashAmount.value = (Number(USDcashAmount.value)) - ((Number(USDcashAmount.value)) * USDcashAccount.currency_rate / currencyRate.value)
  } else {
    currencyDifferencesCashAmount.value = 0
  }
  if (!isEmployee.value) {
    const supplierAccount = suppliersAccountsList.value.find((account) => account.id == supplierEmployeeAccountId.value) ?? defaultAccount

    if (!supplierAccount.currency?.is_main) {
      currencyDifferencesSupplierAmount.value = (Number(USDcashAmount.value) + Number(IQDcashAmount.value)) - ((Number(USDcashAmount.value) + Number(IQDcashAmount.value)) * supplierAccount.currency_rate / currencyRate.value)
    } else {
      currencyDifferencesSupplierAmount.value = 0
    }
  } else {
    currencyDifferencesSupplierAmount.value = 0
  }

  currencyDifferencesAmount.value = currencyDifferencesCashAmount.value - currencyDifferencesSupplierAmount.value
  if (currencyDifferencesAmount.value == 0) {
    await onSubmit()
  } else {
    confirmPopup.value = true
  }

})
const onSubmit = async () => {
  createRecord.value.accounts = []
  if (isEmployee.value) {
    if (USDcashAmount.value != 0) {
      createRecord.value.accounts.push({ account_id: USDcashAccountId.value, amount: USDcashAmount.value - currencyDifferencesCashAmount.value, type: AccountConsts.CREDIT_TYPE })
      createRecord.value.currency_id = currenciesList.value.find((currency) => !currency.is_main)?.id ?? 0
      createRecord.value.currency_rate = currencyRate.value
    } else {
      createRecord.value.currency_rate = 1
      createRecord.value.currency_id = currenciesList.value.find((currency) => currency.is_main)?.id ?? 0

    }
    if (IQDcashAmount.value != 0) {
      createRecord.value.accounts.push({ account_id: IQDcashAccountId.value, amount: IQDcashAmount.value, type: AccountConsts.CREDIT_TYPE })
    }

    createRecord.value.accounts.push(
      { account_id: supplierEmployeeAccountId.value, amount: Number(IQDcashAmount.value) + Number(USDcashAmount.value) - currencyDifferencesSupplierAmount.value, type: AccountConsts.DEBIT_TYPE })
    if (currencyDifferencesAmount.value != 0) {
      createRecord.value.accounts.push(
        { account_id: currencyDifferencesAccountId.value, amount: Math.abs(currencyDifferencesAmount.value), type: currencyDifferencesAmount.value > 0 ? AccountConsts.CREDIT_TYPE : AccountConsts.DEBIT_TYPE },
      )
    }
    createRecord.value.transaction_type_id = 1
    createRecord.value.recordType = TransactionConsts.EMPLOYEE_CASH_RECEIPT
    createRecord.value.amount = Number(IQDcashAmount.value) + Number(USDcashAmount.value)
  }
  else {
    if (USDcashAmount.value != 0) {
      createRecord.value.accounts.push({ account_id: USDcashAccountId.value, amount: USDcashAmount.value - currencyDifferencesCashAmount.value, type: AccountConsts.CREDIT_TYPE })
      createRecord.value.currency_id = currenciesList.value.find((currency) => !currency.is_main)?.id ?? 0
      createRecord.value.currency_rate = currencyRate.value
    } else {
      createRecord.value.currency_rate = 1
      createRecord.value.currency_id = currenciesList.value.find((currency) => currency.is_main)?.id ?? 0

    }
    if (IQDcashAmount.value != 0) {
      createRecord.value.accounts.push({ account_id: IQDcashAccountId.value, amount: IQDcashAmount.value, type: AccountConsts.CREDIT_TYPE })
    }

    createRecord.value.accounts.push(
      { account_id: supplierEmployeeAccountId.value, amount: Number(IQDcashAmount.value) + Number(USDcashAmount.value) - currencyDifferencesSupplierAmount.value, type: AccountConsts.DEBIT_TYPE })
    if (currencyDifferencesAmount.value != 0) {
      createRecord.value.accounts.push(
        { account_id: currencyDifferencesAccountId.value, amount: Math.abs(currencyDifferencesAmount.value), type: currencyDifferencesAmount.value > 0 ? AccountConsts.CREDIT_TYPE : AccountConsts.DEBIT_TYPE },
      )
    }
    createRecord.value.transaction_type_id = 1
    createRecord.value.recordType = TransactionConsts.SUPPLIER_CASH_RECEIPT
    createRecord.value.amount = Number(IQDcashAmount.value) + Number(USDcashAmount.value)
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

watch(isEmployee, (value) => {
  supplierEmployeeAccountId.value = 0
  currencyDifferencesAmount.value = 0
  setFieldValue('supplier_employee_account', 0)
})
watch(supplierEmployeeAccountId, (value) => {
  if (value != 0) {
    const USDcashAccount = USDcashAccountsList.value.find((account) => account.id == USDcashAccountId.value) ?? defaultAccount
    if (USDcashAmount.value != 0) {
      currencyDifferencesCashAmount.value = (Number(USDcashAmount.value)) - ((Number(USDcashAmount.value)) * USDcashAccount.currency_rate / currencyRate.value)
    } else {
      currencyDifferencesCashAmount.value = 0
    }
    if (!isEmployee.value) {
      const supplierAccount = suppliersAccountsList.value.find((account) => account.id == value) ?? defaultAccount

      if (!supplierAccount.currency?.is_main) {
        currencyDifferencesSupplierAmount.value = (Number(USDcashAmount.value) + Number(IQDcashAmount.value)) - ((Number(USDcashAmount.value) + Number(IQDcashAmount.value)) * supplierAccount.currency_rate / currencyRate.value)
      } else {
        currencyDifferencesSupplierAmount.value = 0
      }
    } else {
      currencyDifferencesSupplierAmount.value = 0
    }

    currencyDifferencesAmount.value = currencyDifferencesCashAmount.value - currencyDifferencesSupplierAmount.value
  }
})
watch(USDcashAccountId, (value) => {
  if (value != 0) {
    const USDcashAccount = USDcashAccountsList.value.find((account) => account.id == value) ?? defaultAccount
    if (USDcashAmount.value != 0) {
      currencyDifferencesCashAmount.value = (Number(USDcashAmount.value)) - ((Number(USDcashAmount.value)) * USDcashAccount.currency_rate / currencyRate.value)
    } else {
      currencyDifferencesCashAmount.value = 0
    }
    if (!isEmployee.value) {
      const supplierAccount = suppliersAccountsList.value.find((account) => account.id == supplierEmployeeAccountId.value) ?? defaultAccount

      if (!supplierAccount.currency?.is_main) {
        currencyDifferencesSupplierAmount.value = (Number(USDcashAmount.value) + Number(IQDcashAmount.value)) - ((Number(USDcashAmount.value) + Number(IQDcashAmount.value)) * supplierAccount.currency_rate / currencyRate.value)
      } else {
        currencyDifferencesSupplierAmount.value = 0
      }
    } else {
      currencyDifferencesSupplierAmount.value = 0
    }

    currencyDifferencesAmount.value = currencyDifferencesCashAmount.value - currencyDifferencesSupplierAmount.value
  }
})
watch(currencyRate, (value) => {
  USDcashAmount.value = USDcashAmountInUSD.value * value
  const USDcashAccount = USDcashAccountsList.value.find((account) => account.id == USDcashAccountId.value) ?? defaultAccount
  if (USDcashAmount.value != 0) {
    currencyDifferencesCashAmount.value = (Number(USDcashAmount.value)) - ((Number(USDcashAmount.value)) * USDcashAccount.currency_rate / value)
  } else {
    currencyDifferencesCashAmount.value = 0
  }
  if (!isEmployee.value) {
    const supplierAccount = suppliersAccountsList.value.find((account) => account.id == supplierEmployeeAccountId.value) ?? defaultAccount

    if (!supplierAccount.currency?.is_main) {
      currencyDifferencesSupplierAmount.value = (Number(USDcashAmount.value) + Number(IQDcashAmount.value)) - ((Number(USDcashAmount.value) + Number(IQDcashAmount.value)) * supplierAccount.currency_rate / value)
    } else {
      currencyDifferencesSupplierAmount.value = 0
    }
  } else {
    currencyDifferencesSupplierAmount.value = 0
  }

  currencyDifferencesAmount.value = currencyDifferencesCashAmount.value - currencyDifferencesSupplierAmount.value
})
watch(USDcashAmount, (value) => {
  const USDcashAccount = USDcashAccountsList.value.find((account) => account.id == USDcashAccountId.value) ?? defaultAccount
  if (value != 0) {
    currencyDifferencesCashAmount.value = (Number(value)) - ((Number(USDcashAmount.value)) * USDcashAccount.currency_rate / currencyRate.value)
  } else {
    currencyDifferencesCashAmount.value = 0
  }
  if (!isEmployee.value) {
    const supplierAccount = suppliersAccountsList.value.find((account) => account.id == supplierEmployeeAccountId.value) ?? defaultAccount

    if (!supplierAccount.currency?.is_main) {
      currencyDifferencesSupplierAmount.value = (Number(value) + Number(IQDcashAmount.value)) - ((Number(value) + Number(IQDcashAmount.value)) * supplierAccount.currency_rate / currencyRate.value)
    } else {
      currencyDifferencesSupplierAmount.value = 0
    }
  } else {
    currencyDifferencesSupplierAmount.value = 0
  }
  currencyDifferencesAmount.value = currencyDifferencesCashAmount.value - currencyDifferencesSupplierAmount.value
})
watch(IQDcashAmount, (value) => {
  const USDcashAccount = USDcashAccountsList.value.find((account) => account.id == USDcashAccountId.value) ?? defaultAccount
  if (USDcashAmount.value != 0) {
    currencyDifferencesCashAmount.value = (Number(USDcashAmount.value)) - ((Number(USDcashAmount.value)) * USDcashAccount.currency_rate / currencyRate.value)
  } else {
    currencyDifferencesCashAmount.value = 0
  }
  if (!isEmployee.value) {
    const supplierAccount = suppliersAccountsList.value.find((account) => account.id == supplierEmployeeAccountId.value) ?? defaultAccount

    if (!supplierAccount.currency?.is_main) {
      currencyDifferencesSupplierAmount.value = (Number(USDcashAmount.value) + Number(value)) - ((Number(USDcashAmount.value) + Number(value)) * supplierAccount.currency_rate / currencyRate.value)
    } else {
      currencyDifferencesSupplierAmount.value = 0
    }
  } else {
    currencyDifferencesSupplierAmount.value = 0
  }
  currencyDifferencesAmount.value = currencyDifferencesCashAmount.value - currencyDifferencesSupplierAmount.value
})
watch(USDcashAmountInUSD, (value) => {
  USDcashAmount.value = value * currencyRate.value
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
                      <VSwitchSegment :key="keyIncrement" v-model="isEmployee" :disabled="!enableSelectIsEmployee"
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
                    <VSelect v-model="supplierEmployeeAccountId" :disabled="!enableSelectSupplierEmployee">
                      <VOption :value="0"> {{
                        t('supplier_cash_receipt.form.select_account') }}</VOption>
                      <VOption v-for="account in suppliersAccountsList" :value="account.id" :key="account.id">
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
                    <VSelect v-model="supplierEmployeeAccountId" :disabled="!enableSelectSupplierEmployee">
                      <VOption :value="0"> {{
                        t('supplier_cash_receipt.form.select_account') }}</VOption>
                      <VOption v-for="account in employeesAccountsList" :value="account.id" :key="account.id">
                        {{ account.code }} - {{ account.name }}
                      </VOption>
                    </VSelect>
                    <ErrorMessage class="help is-danger" name="supplier_employee_account" />
                  </VControl>
                </VField>
              </div>
              <div class="column is-12 columns p-0 m-0 py-2">
                <div class="column is-6 columns is-multiline m-0 p-0 my-2 split-border">
                  <div class="column is-12">
                    <VField id="iqd_amount">
                      <VLabel class="required">{{ t('customer_cash_receipt.form.iqd_amount') }}
                      </VLabel>
                      <VControl>
                        <VInput v-model="IQDcashAmount" placeholder="" type="number" />
                        <ErrorMessage class="help is-danger" name="iqd_amount" />
                      </VControl>
                    </VField>
                  </div>
                  <div class="column is-12">
                    <VField id="iqd_cash_account">
                      <VLabel>{{ t('customer_cash_receipt.form.iqd_cash_account') }}
                      </VLabel>
                      <VControl>
                        <VSelect :disabled="isCashier" v-model="IQDcashAccountId">
                          <VOption :value="0"> {{ t('customer_cash_receipt.form.select_account')
                          }}</VOption>
                          <VOption v-for="account in IQDcashAccountsList" :value="account.id">
                            {{ account.code }} - {{ account.name }}
                          </VOption>
                        </VSelect>
                        <ErrorMessage class="help is-danger" name="iqd_cash_account" />
                      </VControl>
                    </VField>
                  </div>
                </div>
                <div class="column is-6 columns is-multiline m-0 p-0 my-2">
                  <div class="column is-12">
                    <VField id="usd_amount">
                      <VLabel class="required">{{ t('customer_cash_receipt.form.usd_amount') }}
                      </VLabel>
                      <VControl>
                        <VInput v-model="USDcashAmountInUSD" placeholder="" type="number" />
                        <ErrorMessage class="help is-danger" name="usd_amount" />
                      </VControl>
                    </VField>
                  </div>
                  <div class="column is-12">
                    <VField id="usd_cash_account">
                      <VLabel>{{ t('customer_cash_receipt.form.usd_cash_account') }}
                      </VLabel>
                      <VControl>
                        <VSelect :disabled="isCashier" v-model="USDcashAccountId">
                          <VOption :value="0"> {{ t('customer_cash_receipt.form.select_account')
                          }}</VOption>
                          <VOption v-for="account in USDcashAccountsList" :value="account.id">
                            {{ account.code }} - {{ account.name }}
                          </VOption>
                        </VSelect>
                        <ErrorMessage class="help is-danger" name="usd_cash_account" />
                      </VControl>
                    </VField>
                  </div>
                </div>
              </div>
              <div class="column is-12">
                <VField id="currency_rate">
                  <VLabel class="required">{{ t('supplier_cash_receipt.form.currency_rate') }}
                  </VLabel>
                  <VControl icon="feather:dollar-sign">
                    <VInput v-model="currencyRate" placeholder="" type="number" />
                    <ErrorMessage class="help is-danger" name="currency_rate" />
                  </VControl>
                </VField>
              </div>
              <div v-if="currencyDifferencesAmount != 0 && IQDcashAmount + USDcashAmount != 0"
                class="column is-12 is-flex is-justify-content-center">
                <p class="help is-size-6 is-danger">
                  {{
                    t('transfer_cash_money.form.currency_differences_helper', {
                      difference_amount:
                        currencyDifferencesAmount
                    }) }}
                </p>
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

.form-fieldset {
  max-width: 60%;
}

.split-border {
  border-left: 3px solid var(--fade-grey-dark-3);
}

.is-dark {
  .split-border {
    border-color: var(--dark-sidebar-light-12) !important;

  }
}
</style>
