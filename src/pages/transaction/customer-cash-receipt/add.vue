<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "permissions": [
            "transaction_create"
        ]
    }
}
</route>
    
<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { Notyf } from 'notyf';
import { ErrorMessage, useForm } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import { useNotyf } from '/@src/composable/useNotyf';
import { Account, AccountSearchFilter, AccountConsts, defaultAccount } from '/@src/models/Accounting/Account/account';
import { ChartOfAccountConsts } from '/@src/models/Accounting/ChartOfAccount/chartOfAccount';
import { Currency, defaultCurrencySearchFilter } from '/@src/models/Accounting/Currency/currency';
import { CreateRecords, createRecordsWithDefault, TransactionConsts } from '/@src/models/Accounting/Transaction/record';
import { cutomerCashReceiptValidationSchema } from '/@src/rules/Accounting/Transaction/customerCashReceiptValidation';
import { getAccountsList } from '/@src/services/Accounting/Account/accountService';
import { getCurrenciesList } from '/@src/services/Accounting/Currency/currencyService';
import { createRecords } from '/@src/services/Accounting/Transaction/transactionService';
import { useTransaction } from '/@src/stores/Accounting/Transaction/transactionStore';
import { useViewWrapper } from '/@src/stores/viewWrapper';





const { t, locale } = useI18n()
const viewWrapper = useViewWrapper();
viewWrapper.setPageTitle(t('customer_cash_receipt.form.title'));
const head = useHead({
    title: t('customer_cash_receipt.form.title'),
});
const notif = useNotyf() as Notyf
const router = useRouter()
const transactionStore = useTransaction()
const pageTitle = t('customer_cash_receipt.form.title');
const cashAccountsList = ref<Account[]>([])
const clientsAccountsList = ref<Account[]>([])
const currenciesList = ref<Currency[]>([])
const availableCurrenciesList = ref<Currency[]>([])
const clientAccountId = ref<number>(0)
const cashAccountId = ref<number>(0)
const currencyId = ref<number>(0)
const currencyRate = ref<number>(1)
const enableCurrencyRate = ref(false)
const cashAmount = ref(0)
const createRecord = ref<CreateRecords>(createRecordsWithDefault)
const currencyDifferencesAccountId = ref<number>(0)
const currencyDifferencesAmount = ref<number>(0)

const iconArrow = locale.value == "ar" ? "lnir-arrow-right" : "lnir-arrow-left"

onMounted(async () => {
    let accountSearchFilter = {} as AccountSearchFilter
    accountSearchFilter.status = AccountConsts.ACTIVE
    accountSearchFilter.per_page = 500
    const { accounts } = await getAccountsList(accountSearchFilter)
    accounts.forEach((account) => {
        if (account.chart_account?.code == ChartOfAccountConsts.CASH_CODE) {
            cashAccountsList.value.push(account)
        } else
            if (account.chart_account?.code == ChartOfAccountConsts.CLIENTS_CODE) {
                clientsAccountsList.value.push(account)
            } else if (account.chart_account?.code == ChartOfAccountConsts.CURRENCY_DIFFERENCES_CODE) {
                currencyDifferencesAccountId.value = account.id ?? 0
            }
    });
    const { currencies } = await getCurrenciesList(defaultCurrencySearchFilter)
    currenciesList.value = currencies
    availableCurrenciesList.value = currencies

})

const validationSchema = cutomerCashReceiptValidationSchema
const { handleSubmit } = useForm({
    validationSchema,
    initialValues: {
        client_account: 0,
        cash_account: 0,
        revenue_amount: 0,
        currency_id: 0,
        currency_rate: 1,
        date: "",
        note: undefined
    }
});
const onSubmit = handleSubmit(async () => {
    const clientAccount = clientsAccountsList.value.find((account) => account.id == clientAccountId.value) ?? defaultAccount
    if (!clientAccount.currency?.is_main) {

        currencyDifferencesAmount.value = cashAmount.value - (cashAmount.value * clientAccount.currency_rate / currencyRate.value)
    } else {
        currencyDifferencesAmount.value = 0
    }

    createRecord.value.accounts = []
    createRecord.value.accounts.push(
        { account_id: cashAccountId.value, amount: cashAmount.value, type: AccountConsts.DEBIT_TYPE },
        { account_id: clientAccountId.value, amount: cashAmount.value - currencyDifferencesAmount.value, type: AccountConsts.CREDIT_TYPE })
    if (currencyDifferencesAmount.value != 0) {
        createRecord.value.accounts.push(
            { account_id: currencyDifferencesAccountId.value, amount: Math.abs(currencyDifferencesAmount.value), type: currencyDifferencesAmount.value > 0 ? AccountConsts.CREDIT_TYPE : AccountConsts.DEBIT_TYPE },
        )
    }
    createRecord.value.currency_id = currencyId.value
    createRecord.value.currency_rate = currencyRate.value
    createRecord.value.transaction_type_id = 1
    createRecord.value.recordType = TransactionConsts.CLIENT_CASH_RECEIPT
    createRecord.value.amount = cashAmount.value
    const { success, message } = await createRecords(createRecord.value)
    if (success) {
        notif.success(t('toast.success.add'));
        router.push({ path: `/transaction/customer-cash-receipt` });

    } else {
        notif.error({ message: message, duration: 3000 })

    }
})

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
watch(clientAccountId, (value) => {
    if (value != 0) {
        const clientAccountId = clientsAccountsList.value.find((account) => account.id == value) ?? defaultAccount
        if (!clientAccountId.currency?.is_main) {
            currencyDifferencesAmount.value = cashAmount.value - (cashAmount.value * clientAccountId.currency_rate / currencyRate.value)
        } else {
            currencyDifferencesAmount.value = 0
        }
    }
})
watch(currencyRate, (value) => {
    const clientAccount = clientsAccountsList.value.find((account) => account.id == clientAccountId.value) ?? defaultAccount

    if (!clientAccount.currency?.is_main) {
        currencyDifferencesAmount.value = cashAmount.value - (cashAmount.value * clientAccount.currency_rate / value)
    } else {
        currencyDifferencesAmount.value = 0
    }
})
watch(cashAmount, (value) => {
    const clientAccount = cashAccountsList.value.find((account) => account.id == clientAccountId.value) ?? defaultAccount

    if (!clientAccount.currency?.is_main) {
        currencyDifferencesAmount.value = value - (value * clientAccount.currency_rate / currencyRate.value)
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
                                <VButton :icon="`lnir ${iconArrow} rem-100`" to="/transaction/customer-cash-receipt" light
                                    dark-outlined>
                                    {{ t('forms.back_button') }}
                                </VButton>

                                <VButton :loading="transactionStore.loading" @click="onSubmit" color="primary" raised> {{
                                    t('customer_cash_receipt.form.button') }} </VButton>
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
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField id="client_account">
                                    <VLabel class="required">{{ t('customer_cash_receipt.form.client_account') }}</VLabel>
                                    <VControl>
                                        <VSelect v-model="clientAccountId">
                                            <VOption :value="0"> {{
                                                t('customer_cash_receipt.form.select_account') }}</VOption>
                                            <VOption v-for="account in clientsAccountsList" :value="account.id">
                                                {{ account.code }} - {{ account.name }}
                                            </VOption>
                                        </VSelect>
                                        <ErrorMessage class="help is-danger" name="client_account" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-12">
                                <VField id="amount">
                                    <VLabel class="required">{{ t('customer_cash_receipt.form.amount') }}</VLabel>
                                    <VControl>
                                        <VInput v-model="cashAmount" placeholder="" type="number" />
                                        <p class="help is-danger" v-if="currencyDifferencesAmount != 0 && cashAmount != 0">
                                            {{
                                                t('transfer_cash_money.form.currency_differences_helper', {
                                                    difference_amount:
                                                        currencyDifferencesAmount
                                                }) }}
                                        </p>
                                        <ErrorMessage class="help is-danger" name="amount" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-12">
                                <VField id="cash_account">
                                    <VLabel class="required">{{ t('customer_cash_receipt.form.cash_account') }}</VLabel>
                                    <VControl>
                                        <VSelect v-model="cashAccountId">
                                            <VOption :value="0"> {{ t('customer_cash_receipt.form.select_account')
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
                                    <VLabel class="required">{{ t('customer_cash_receipt.form.currency') }}</VLabel>
                                    <VControl>
                                        <VSelect v-model="currencyId">
                                            <VOption :value="0"> {{ t('customer_cash_receipt.form.select_currency')
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
                                    <VLabel class="required">{{ t('customer_cash_receipt.form.currency_rate') }}</VLabel>
                                    <VControl icon="feather:dollar-sign">
                                        <VInput :disabled="!enableCurrencyRate" v-model="currencyRate" placeholder=""
                                            type="number" />
                                        <ErrorMessage class="help is-danger" name="currency_rate" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-12">
                                <VField id="date">
                                    <VLabel class="required">{{ t('customer_cash_receipt.form.date') }}</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="createRecord.date" placeholder="" type="date" />
                                        <ErrorMessage class="help is-danger" name="date" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-12">
                                <VField id="note">
                                    <VLabel>{{ t('customer_cash_receipt.form.note') }}</VLabel>
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
