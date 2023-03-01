<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { Notyf } from 'notyf';
import { useI18n } from 'vue-i18n';
import { useNotyf } from '/@src/composable/useNotyf';
import { Account, AccountSearchFilter, AccountConsts, defaultAccount } from '/@src/models/Accounting/Account/account';
import { ChartOfAccountConsts } from '/@src/models/Accounting/ChartOfAccount/chartOfAccount';
import { Currency, defaultCurrencySearchFilter } from '/@src/models/Accounting/Currency/currency';
import { CreateRecords, createRecordsWithDefault, TransactionConsts } from '/@src/models/Accounting/Transaction/record';
import { transferCashMoneyValidationSchema } from '../../rules/Accounting/Transaction/transferCashMoneyValidation';
import { getAccountsList } from '/@src/services/Accounting/Account/accountService';
import { getCurrenciesList } from '/@src/services/Accounting/Currency/currencyService';
import { useTransaction } from '/@src/stores/Accounting/Transaction/transactionStore';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { ErrorMessage, useForm } from 'vee-validate';
import { addCustomExpenseValidationSchema } from '/@src/rules/Accounting/Transaction/addCustomExpenseValidation';
import { createRecords } from '/@src/services/Accounting/Transaction/transactionService';
import { getSuppliersList } from '/@src/services/Others/Supplier/supplierService';
import { Supplier, SupplierSearchFilter } from '/@src/models/Others/Supplier/supplier';




const { t } = useI18n()
const viewWrapper = useViewWrapper();
viewWrapper.setPageTitle(t('add_custom_expense.form.title'));
const head = useHead({
    title: t('add_custom_expense.form.title'),
});
const notif = useNotyf() as Notyf
const router = useRouter()
const transactionStore = useTransaction()
const pageTitle = t('add_custom_expense.form.title');
const cashAccountsList = ref<Account[]>([])
const suppliersList = ref<Supplier[]>([])
const currenciesList = ref<Currency[]>([])
const availableCurrenciesList = ref<Currency[]>([])
const supplierAccountId = ref<number>(0)
const cashAccountId = ref<number>(0)
const selectedExpenseAccount = ref<Account>(defaultAccount)
const currencyId = ref<number>(0)
const currencyRate = ref<number>(1)
const enableCurrencyRate = ref(false)
const cashAmount = ref(0)
const expenseAmount = ref(0)
const remainAmount = ref(0)
const createRecord = ref<CreateRecords>(createRecordsWithDefault)
const currencyDifferencesAccountId = ref<number>(0)
const currencyDifferencesAmount = ref<number>(0)

onMounted(async () => {
    let accountSearchFilter = {} as AccountSearchFilter
    accountSearchFilter.status = AccountConsts.ACTIVE
    accountSearchFilter.per_page = 500
    const { accounts } = await getAccountsList(accountSearchFilter)
    accounts.forEach((account) => {
        if (account.chart_account?.code == ChartOfAccountConsts.CASH_CODE) {
            cashAccountsList.value.push(account)
        } else if (account.chart_account?.code == ChartOfAccountConsts.CURRENCY_DIFFERENCES_CODE) {
            currencyDifferencesAccountId.value = account.id ?? 0
        }
    });

    const { currencies } = await getCurrenciesList(defaultCurrencySearchFilter)
    currenciesList.value = currencies
    availableCurrenciesList.value = currencies

    let supplierSearchFilter = { per_page: 500 } as SupplierSearchFilter
    const { suppliers } = await getSuppliersList(supplierSearchFilter)
    suppliersList.value = suppliers

})

const validationSchema = addCustomExpenseValidationSchema
const { handleSubmit } = useForm({
    validationSchema,
    initialValues: {
        supplier_account: 0,
        cash_account: 0,
        expense_amount: 0,
        cash_amount: 0,
        remain_amount: 0,
        currency_id: 0,
        currency_rate: 1,
        date: "",
        note: undefined
    }
});
const onSubmit = handleSubmit(async () => {
    const cashAccount = cashAccountsList.value.find((account) => account.id == cashAccountId.value) ?? defaultAccount

    if (!cashAccount.currency?.is_main) {
        currencyDifferencesAmount.value = cashAmount.value - (cashAmount.value * cashAccount.currency_rate / currencyRate.value)
    } else {
        currencyDifferencesAmount.value = 0
    }

    createRecord.value.accounts = []
    createRecord.value.accounts.push(
        { account_id: cashAccountId.value, amount: cashAmount.value - currencyDifferencesAmount.value, type: AccountConsts.CREDIT_TYPE },
        { account_id: selectedExpenseAccount.value.id, amount: expenseAmount.value, type: AccountConsts.DEBIT_TYPE })
    if (remainAmount.value > 0) {
        createRecord.value.accounts.push(
            { account_id: supplierAccountId.value, amount: remainAmount.value, type: AccountConsts.CREDIT_TYPE },
        )
    }
    if (currencyDifferencesAmount.value != 0) {
        createRecord.value.accounts.push(
            { account_id: currencyDifferencesAccountId.value, amount: Math.abs(currencyDifferencesAmount.value), type: currencyDifferencesAmount.value > 0 ? AccountConsts.CREDIT_TYPE : AccountConsts.DEBIT_TYPE },
        )
    }
    createRecord.value.currency_id = currencyId.value
    createRecord.value.currency_rate = currencyRate.value
    createRecord.value.transaction_type_id = 1
    createRecord.value.recordType = TransactionConsts.CUSTOM_EXPENSE
    createRecord.value.amount = expenseAmount.value
    const { success, message } = await createRecords(createRecord.value)
    if (success) {
        notif.success(t('toast.success.add'));
        router.push({ path: `/transaction` });

    } else {
        notif.error({ message: message, duration: 3000 })

    }
})

watch(currencyId, (value) => {
    let selectedCurreny = currenciesList.value.find((currency) => currency.id === value);
    if (selectedCurreny?.is_main) {
        enableCurrencyRate.value = false
        currencyRate.value = 1
    } else {
        enableCurrencyRate.value = true
    }
})
watch(expenseAmount, (value) => {
    remainAmount.value = value - cashAmount.value
})
watch(cashAmount, (value) => {
    remainAmount.value = expenseAmount.value - value
    let selectedCashAccount = cashAccountsList.value.find((account) => account.id === cashAccountId.value) ?? defaultAccount
    if (!selectedCashAccount.currency?.is_main) {
        currencyDifferencesAmount.value = cashAmount.value - (cashAmount.value * selectedCashAccount.currency_rate / currencyRate.value)
    } else {
        currencyDifferencesAmount.value = 0
    }
})
watch(cashAccountId, (value) => {
    if (value) {
        let selectedCashAccount = cashAccountsList.value.find((account) => account.id === value) ?? defaultAccount
        availableCurrenciesList.value = []
        currenciesList.value.forEach((currency) => {
            if (currency.is_main == selectedCashAccount?.currency?.is_main) {
                availableCurrenciesList.value.push(currency)
            }
        });
        currencyId.value = 0
        if (!selectedCashAccount.currency?.is_main) {
            currencyDifferencesAmount.value = cashAmount.value - (cashAmount.value * selectedCashAccount.currency_rate / currencyRate.value)
        } else {
            currencyDifferencesAmount.value = 0
        }
    } else {
        availableCurrenciesList.value = currenciesList.value
    }
})
watch(supplierAccountId, (value) => {
    if (value) {
        const selectedSupplier = suppliersList.value.find((supplier) => supplier.account_contacts.find((accountContact) => accountContact.account.id == supplierAccountId.value))
        const expenseAccount = selectedSupplier?.account_contacts.find((accountContact) => accountContact.is_expense_account)?.account
        selectedExpenseAccount.value = expenseAccount ?? defaultAccount
    }
})
watch(currencyRate, (value) => {
    const cashAccount = cashAccountsList.value.find((account) => account.id == cashAccountId.value) ?? defaultAccount

    if (!cashAccount.currency?.is_main) {
        currencyDifferencesAmount.value = cashAmount.value - (cashAmount.value * cashAccount.currency_rate / value)
    } else {
        currencyDifferencesAmount.value = 0
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
                                <VButton :loading="transactionStore.loading" @click="onSubmit" color="primary" raised> {{
                                    t('add_custom_expense.form.button') }} </VButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <form class="form-layout" @submit.prevent="onSubmit">
            <div class="form-outer">
                <div class="form-body">
                    <div class="form-fieldset">
                        <div class="fieldset-heading">
                            <h4>{{ pageTitle }}</h4>
                        </div>
                        <p class="help is-danger is-size-6 mb-2" v-if="currencyDifferencesAmount != 0 && cashAmount != 0">{{
                            t('transfer_cash_money.form.currency_differences_helper', {
                                difference_amount:
                                    currencyDifferencesAmount
                            }) }}
                        </p>

                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField id="supplier_account">
                                    <VLabel class="required">{{ t('add_custom_expense.form.supplier_account') }}</VLabel>
                                    <VControl>
                                        <VSelect v-model="supplierAccountId">
                                            <VOption :value="0"> {{
                                                t('add_custom_expense.form.select_account') }}</VOption>
                                            <VOption v-for="supplier in suppliersList"
                                                :value="supplier.account_contacts.find((account) => !account.is_expense_account)?.account.id">
                                                {{ supplier.account_contacts.find((account) =>
                                                    !account.is_expense_account)?.account.code }} - {{
        supplier.account_contacts.find((account) =>
            !account.is_expense_account)?.account.name }}
                                            </VOption>
                                        </VSelect>
                                        <ErrorMessage class="help is-danger" name="supplier_account" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-12">
                                <VField id="expense_account">
                                    <VLabel class="required">{{ t('add_custom_expense.form.expense_account') }}</VLabel>
                                    <VControl>
                                        <VInput disabled v-model="selectedExpenseAccount.name" placeholder="" type="text" />
                                        <ErrorMessage class="help is-danger" name="expense_account" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-12">
                                <VField id="expense_amount">
                                    <VLabel class="required">{{ t('add_custom_expense.form.expense_amount') }}</VLabel>
                                    <VControl>
                                        <VInput v-model="expenseAmount" placeholder="" type="number" />
                                        <ErrorMessage class="help is-danger" name="expense_amount" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-12">
                                <VField id="cash_account">
                                    <VLabel class="required">{{ t('add_custom_expense.form.cash_account') }}</VLabel>
                                    <VControl>
                                        <VSelect v-model="cashAccountId">
                                            <VOption :value="0"> {{ t('add_custom_expense.form.select_account')
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
                                <VField id="cash_amount">
                                    <VLabel class="required">{{ t('add_custom_expense.form.cash_amount') }}</VLabel>
                                    <VControl>
                                        <VInput v-model="cashAmount" placeholder="" type="number" />
                                        <ErrorMessage class="help is-danger" name="cash_amount" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-12">
                                <VField id="currency_id">
                                    <VLabel class="required">{{ t('add_custom_expense.form.currency') }}</VLabel>
                                    <VControl>
                                        <VSelect v-model="currencyId">
                                            <VOption :value="0"> {{ t('add_custom_expense.form.select_currency')
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
                                    <VLabel class="required">{{ t('add_custom_expense.form.currency_rate') }}</VLabel>
                                    <VControl icon="feather:dollar-sign">
                                        <VInput :disabled="!enableCurrencyRate" v-model="currencyRate" placeholder=""
                                            type="number" />
                                        <ErrorMessage class="help is-danger" name="currency_rate" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-12">
                                <VField id="remain_amount">
                                    <VLabel class="required">{{ t('add_custom_expense.form.remain_amount') }}</VLabel>
                                    <VControl>
                                        <VInput disabled v-model="remainAmount" placeholder="" type="number" />
                                        <ErrorMessage class="help is-danger" name="remain_amount" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-12">
                                <VField id="date">
                                    <VLabel class="required">{{ t('add_custom_expense.form.date') }}</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="createRecord.date" placeholder="" type="date" />
                                        <ErrorMessage class="help is-danger" name="date" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-12">
                                <VField id="note">
                                    <VLabel>{{ t('add_custom_expense.form.note') }}</VLabel>
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
</template>


<style  scoped lang="scss">
@import '/@src/scss/styles/formPage.scss';
</style>
