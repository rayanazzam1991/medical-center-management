<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { Notyf } from 'notyf';
import { ErrorMessage, useForm } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import { useNotyf } from '/@src/composable/useNotyf';
import { Account, AccountSearchFilter, AccountConsts, defaultAccount } from '/@src/models/Accounting/Account/account';
import { ChartOfAccountConsts } from '/@src/models/Accounting/ChartOfAccount/chartOfAccount';
import { CreateRecords, createRecordsWithDefault, TransactionConsts } from '/@src/models/Accounting/Transaction/record';
import { transferCashMoneyValidationSchema } from '../../rules/Accounting/Transaction/transferCashMoneyValidation';
import { getAccountsList } from '/@src/services/Accounting/Account/accountService';
import { createRecords } from '/@src/services/Accounting/Transaction/transactionService';
import { useTransaction } from '/@src/stores/Accounting/Transaction/transactionStore';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { create } from 'node:domain';
import { Currency, CurrencySearchFilter } from '/@src/models/Accounting/Currency/currency';
import { getCurrenciesList } from '/@src/services/Accounting/Currency/currencyService';



const { t } = useI18n()
const viewWrapper = useViewWrapper();
viewWrapper.setPageTitle(t('transfer_cash_money.form.title'));
const head = useHead({
    title: t('transfer_cash_money.form.title'),
});
const notif = useNotyf() as Notyf
const router = useRouter()
const transactionStore = useTransaction()
const pageTitle = t('transfer_cash_money.form.title');
const cashAccountsList = ref<Account[]>([])
const fromCashAccountsList = ref<Account[]>([])
const toCashAccountsList = ref<Account[]>([])
const fromAccountId = ref<number>(0)
const toAccountId = ref<number>(0)
const amount = ref<number>(0)
const currencyDifferencesAccountId = ref<number>(0)
const currencyDifferencesAmount = ref<number>(0)
const currencyRate = ref<number>(1)
const currenciesList = ref<Currency[]>([])
const createRecord = ref<CreateRecords>(createRecordsWithDefault)
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
    fromCashAccountsList.value = cashAccountsList.value
    toCashAccountsList.value = cashAccountsList.value

    let currencySearchFilter = {} as CurrencySearchFilter
    const { currencies } = await getCurrenciesList(currencySearchFilter)
    currenciesList.value = currencies

})
watch(fromAccountId, (value) => {
    if (value != 0) {
        const fromAccount = cashAccountsList.value.find((account) => account.id == value) ?? defaultAccount
        toCashAccountsList.value = []

        cashAccountsList.value.forEach((account) => {
            if (account.currency?.is_main != fromAccount.currency?.is_main) {
                toCashAccountsList.value.push(account)
            }
        });
        if (!fromAccount.currency?.is_main) {
            currencyDifferencesAmount.value = amount.value - (amount.value * fromAccount.currency_rate / currencyRate.value)
        } else {
            currencyDifferencesAmount.value = 0

        }
    } else {
        toCashAccountsList.value = cashAccountsList.value
    }

})
watch(toAccountId, (value) => {
    if (value != 0) {
        const toAccount = cashAccountsList.value.find((account) => account.id == value) ?? defaultAccount

        fromCashAccountsList.value = []
        cashAccountsList.value.forEach((account) => {
            if (account.currency?.is_main != toAccount.currency?.is_main) {
                fromCashAccountsList.value.push(account)

            }
        });
    } else {
        fromCashAccountsList.value = cashAccountsList.value

    }
})
watch(amount, (value) => {
    const fromAccount = cashAccountsList.value.find((account) => account.id == fromAccountId.value) ?? defaultAccount

    if (!fromAccount.currency?.is_main) {
        currencyDifferencesAmount.value = value - (value * fromAccount.currency_rate / currencyRate.value)
    } else {
        currencyDifferencesAmount.value = 0
    }
})
watch(currencyRate, (value) => {
    const fromAccount = cashAccountsList.value.find((account) => account.id == fromAccountId.value) ?? defaultAccount

    if (!fromAccount.currency?.is_main) {
        currencyDifferencesAmount.value = amount.value - (amount.value * fromAccount.currency_rate / value)
    } else {
        currencyDifferencesAmount.value = 0

    }
})

const validationSchema = transferCashMoneyValidationSchema
const { handleSubmit } = useForm({
    validationSchema,
    initialValues: {
        from_account: 0,
        to_account: 0,
        amount: 0,
        currency_rate: 1,
        date: ""
    }
});
const onSubmit = handleSubmit(async () => {
    const fromAccount = cashAccountsList.value.find((account) => account.id == fromAccountId.value) ?? defaultAccount
    if (!fromAccount.currency?.is_main) {

        currencyDifferencesAmount.value = amount.value - (amount.value * fromAccount.currency_rate / currencyRate.value)
    } else {
        currencyDifferencesAmount.value = 0
    }

    createRecord.value.accounts = []
    createRecord.value.accounts.push(
        { account_id: fromAccountId.value, amount: amount.value - currencyDifferencesAmount.value, type: AccountConsts.CREDIT_TYPE },
        { account_id: toAccountId.value, amount: amount.value, type: AccountConsts.DEBIT_TYPE })

    if (currencyDifferencesAmount.value != 0) {
        createRecord.value.accounts.push(
            { account_id: currencyDifferencesAccountId.value, amount: Math.abs(currencyDifferencesAmount.value), type: currencyDifferencesAmount.value > 0 ? AccountConsts.CREDIT_TYPE : AccountConsts.DEBIT_TYPE },
        )
    }
    createRecord.value.currency_id = currenciesList.value.find((currency) => !currency.is_main)?.id ?? 0
    createRecord.value.amount = amount.value
    createRecord.value.transaction_type_id = 1
    createRecord.value.recordType = TransactionConsts.TRANSFER_CASH
    createRecord.value.currency_rate = currencyRate.value

    const { success, message } = await createRecords(createRecord.value)
    if (success) {
        notif.success(t('toast.success.transfer'));
        router.push({ path: `/account` });

    } else {
        notif.error({ message: message, duration: 3000 })

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
                                    t('transfer_cash_money.form.button') }} </VButton>
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
                                <VField id="from_account">
                                    <VLabel class="required">{{ t('transfer_cash_money.form.from_account') }}</VLabel>
                                    <VControl>
                                        <VSelect v-model="fromAccountId">
                                            <VOption :value="0"> {{
                                                t('transfer_cash_money.form.select_from_account') }}</VOption>
                                            <VOption v-for="account in fromCashAccountsList" :value="account.id">
                                                {{ account.code }} - {{ account.name }}

                                            </VOption>
                                        </VSelect>
                                        <ErrorMessage class="help is-danger" name="from_account" />

                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-12">
                                <VField id="to_account">
                                    <VLabel class="required">{{ t('transfer_cash_money.form.to_account') }}</VLabel>
                                    <VControl>
                                        <VSelect v-model="toAccountId">
                                            <VOption :value="0"> {{ t('transfer_cash_money.form.select_to_account')
                                            }}</VOption>
                                            <VOption v-for="account in toCashAccountsList" :value="account.id">
                                                {{ account.code }} - {{ account.name }}
                                            </VOption>
                                        </VSelect>
                                        <p class="help is-danger" v-if="currencyDifferencesAmount != 0 && amount != 0">{{
                                            t('transfer_cash_money.form.currency_differences_helper', {
                                                difference_amount:
                                                    currencyDifferencesAmount
                                            }) }}
                                        </p>

                                        <ErrorMessage class="help is-danger" name="to_account" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-12">
                                <VField id="amount">
                                    <VLabel class="required">{{ t('transfer_cash_money.form.amount') }}</VLabel>
                                    <VControl>
                                        <VInput v-model="amount" placeholder="" type="number" />
                                        <ErrorMessage class="help is-danger" name="amount" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-12">
                                <VField id="currency_rate">
                                    <VLabel class="required">{{ t('transfer_cash_money.form.currency_rate') }}</VLabel>
                                    <VControl icon="feather:dollar-sign">
                                        <VInput v-model="currencyRate" placeholder="" type="number" />
                                        <ErrorMessage class="help is-danger" name="currency_rate" />
                                    </VControl>
                                </VField>
                            </div>

                        </div>
                    </div>
                    <div class="form-fieldset">
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField id="date">
                                    <VLabel class="required">{{ t('transfer_cash_money.form.date') }}</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="createRecord.date" placeholder="" type="date" />
                                        <ErrorMessage class="help is-danger" name="date" />
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
