<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { Notyf } from 'notyf';
import { useI18n } from 'vue-i18n';
import { useNotyf } from '/@src/composable/useNotyf';
import { Account, AccountSearchFilter, AccountConsts } from '/@src/models/Accounting/Account/account';
import { ChartOfAccountConsts } from '/@src/models/Accounting/ChartOfAccount/chartOfAccount';
import { Currency, defaultCurrencySearchFilter } from '/@src/models/Accounting/Currency/currency';
import { CreateRecords, createRecordsWithDefault, TransactionConsts } from '/@src/models/Accounting/Transaction/record';
import { transferCashMoneyValidationSchema } from '../../rules/Accounting/Transaction/transferCashMoneyValidation';
import { getAccountsList } from '/@src/services/Accounting/Account/accountService';
import { getCurrenciesList } from '/@src/services/Accounting/Currency/currencyService';
import { useTransaction } from '/@src/stores/Accounting/Transaction/transactionStore';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { ErrorMessage, useForm } from 'vee-validate';
import { addCustomerRevenueValidationSchema } from '/@src/rules/Accounting/Transaction/addCustomRevenueValidation';
import { createRecords } from '/@src/services/Accounting/Transaction/transactionService';




const { t } = useI18n()
const viewWrapper = useViewWrapper();
viewWrapper.setPageTitle(t('add_custom_revenue.form.title'));
const head = useHead({
    title: t('add_custom_revenue.form.title'),
});
const notif = useNotyf() as Notyf
const router = useRouter()
const transactionStore = useTransaction()
const pageTitle = t('add_custom_revenue.form.title');
const cashAccountsList = ref<Account[]>([])
const revenuesAccountsList = ref<Account[]>([])
const clientsAccountsList = ref<Account[]>([])
const currenciesList = ref<Currency[]>([])
const availableCurrenciesList = ref<Currency[]>([])
const clientAccountId = ref<number>(0)
const cashAccountId = ref<number>(0)
const revenueAccountId = ref<number>(0)
const currencyId = ref<number>(0)
const currencyRate = ref<number>(1)
const enableCurrencyRate = ref(false)
const cashAmount = ref(0)
const revenueAmount = ref(0)
const remainAmount = ref(0)
const createRecord = ref<CreateRecords>(createRecordsWithDefault)
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
            } else
                if (account.chart_account?.parent?.code == ChartOfAccountConsts.REVENUE) {
                    revenuesAccountsList.value.push(account)
                }
    });
    const { currencies } = await getCurrenciesList(defaultCurrencySearchFilter)
    currenciesList.value = currencies
    availableCurrenciesList.value = currencies

})

const validationSchema = addCustomerRevenueValidationSchema
const { handleSubmit } = useForm({
    validationSchema,
    initialValues: {
        client_account: 0,
        revenue_account: 0,
        cash_account: 0,
        revenue_amount: 0,
        cash_amount: 0,
        remain_amount: 0,
        currency_id: 0,
        currency_rate: 1,
        date: "",
        note: undefined
    }
});
const onSubmit = handleSubmit(async () => {
    console.log('valid')
    createRecord.value.accounts = []
    createRecord.value.accounts.push(
        { account_id: cashAccountId.value, amount: cashAmount.value, type: AccountConsts.DEBIT_TYPE },
        { account_id: revenueAccountId.value, amount: revenueAmount.value, type: AccountConsts.CREDIT_TYPE })
    if (remainAmount.value > 0) {
        createRecord.value.accounts.push(
            { account_id: clientAccountId.value, amount: remainAmount.value, type: AccountConsts.DEBIT_TYPE },
        )
    }
    createRecord.value.currency_id = currencyId.value
    createRecord.value.currency_rate = currencyRate.value
    createRecord.value.transaction_type_id = 1
    createRecord.value.recordType = TransactionConsts.CUSTOM_REVENUE
    createRecord.value.amount = revenueAmount.value
    const { success, message } = await createRecords(createRecord.value)
    if (success) {
        notif.success(t('toast.success.add'));
        router.push({ path: `/account` });

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
watch(revenueAmount, (value) => {
    remainAmount.value = value - cashAmount.value
})
watch(cashAmount, (value) => {
    remainAmount.value = revenueAmount.value - value
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
                                <VButton :loading="transactionStore.loading" @click="onSubmit" color="primary" raised> {{
                                    t('add_custom_revenue.form.button') }} </VButton>
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
                                    <VLabel class="required">{{ t('add_custom_revenue.form.client_account') }}</VLabel>
                                    <VControl>
                                        <VSelect v-model="clientAccountId">
                                            <VOption :value="0"> {{
                                                t('add_custom_revenue.form.select_account') }}</VOption>
                                            <VOption v-for="account in clientsAccountsList" :value="account.id">
                                                {{ account.code }} - {{ account.name }}
                                            </VOption>
                                        </VSelect>
                                        <ErrorMessage class="help is-danger" name="client_account" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-12">
                                <VField id="revenue_account">
                                    <VLabel class="required">{{ t('add_custom_revenue.form.revenue_account') }}</VLabel>
                                    <VControl>
                                        <VSelect v-model="revenueAccountId">
                                            <VOption :value="0"> {{ t('add_custom_revenue.form.select_account')
                                            }}</VOption>
                                            <VOption v-for="account in revenuesAccountsList" :value="account.id">
                                                {{ account.code }} - {{ account.name }}
                                            </VOption>
                                        </VSelect>
                                        <ErrorMessage class="help is-danger" name="revenue_account" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-12">
                                <VField id="revenue_amount">
                                    <VLabel class="required">{{ t('add_custom_revenue.form.revenue_amount') }}</VLabel>
                                    <VControl icon="feather:dollar-sign">
                                        <VInput v-model="revenueAmount" placeholder="" type="number" />
                                        <ErrorMessage class="help is-danger" name="revenue_amount" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-12">
                                <VField id="cash_account">
                                    <VLabel class="required">{{ t('add_custom_revenue.form.cash_account') }}</VLabel>
                                    <VControl>
                                        <VSelect v-model="cashAccountId">
                                            <VOption :value="0"> {{ t('add_custom_revenue.form.select_account')
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
                                    <VLabel class="required">{{ t('add_custom_revenue.form.cash_amount') }}</VLabel>
                                    <VControl icon="feather:dollar-sign">
                                        <VInput v-model="cashAmount" placeholder="" type="number" />
                                        <ErrorMessage class="help is-danger" name="cash_amount" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-12">
                                <VField id="currency_id">
                                    <VLabel class="required">{{ t('add_custom_revenue.form.currency') }}</VLabel>
                                    <VControl>
                                        <VSelect v-model="currencyId">
                                            <VOption :value="0"> {{ t('add_custom_revenue.form.select_currency')
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
                                    <VLabel class="required">{{ t('add_custom_revenue.form.currency_rate') }}</VLabel>
                                    <VControl icon="feather:dollar-sign">
                                        <VInput :disabled="!enableCurrencyRate" v-model="currencyRate" placeholder=""
                                            type="number" />
                                        <ErrorMessage class="help is-danger" name="currency_rate" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-12">
                                <VField id="remain_amount">
                                    <VLabel class="required">{{ t('add_custom_revenue.form.remain_amount') }}</VLabel>
                                    <VControl icon="feather:dollar-sign">
                                        <VInput disabled v-model="remainAmount" placeholder="" type="number" />
                                        <ErrorMessage class="help is-danger" name="remain_amount" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-12">
                                <VField id="date">
                                    <VLabel class="required">{{ t('add_custom_revenue.form.date') }}</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="createRecord.date" placeholder="" type="date" />
                                        <ErrorMessage class="help is-danger" name="date" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-12">
                                <VField id="note">
                                    <VLabel>{{ t('add_custom_revenue.form.note') }}</VLabel>
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
