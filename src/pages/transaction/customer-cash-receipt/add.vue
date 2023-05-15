<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "permissions": [
            "client_cash_receipt_create"
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
import { Currency, CurrencyConsts, defaultCurrencySearchFilter } from '/@src/models/Accounting/Currency/currency';
import { CreateRecords, createRecordsWithDefault, TransactionConsts } from '/@src/models/Accounting/Transaction/record';
import { cutomerCashReceiptValidationSchema } from '/@src/rules/Accounting/Transaction/customerCashReceiptValidation';
import { getAccountsList, getAuthenticatedCashierAccounts } from '/@src/services/Accounting/Account/accountService';
import { getCurrenciesList } from '/@src/services/Accounting/Currency/currencyService';
import { createRecords } from '/@src/services/Accounting/Transaction/transactionService';
import { useTransaction } from '/@src/stores/Accounting/Transaction/transactionStore';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { useAuth } from '/@src/stores/Others/User/authStore';
import { defaultUser } from '/@src/models/Others/User/user';





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
const IQDcashAccountsList = ref<Account[]>([])
const USDcashAccountsList = ref<Account[]>([])
const clientsAccountsList = ref<Account[]>([])
const currenciesList = ref<Currency[]>([])
const availableCurrenciesList = ref<Currency[]>([])
const clientAccountId = ref<number>(0)
const USDcashAccountId = ref<number>(0)
const IQDcashAccountId = ref<number>(0)
const currencyId = ref<number>(0)
const USDcurrencyRate = ref<number>(1)
const IQDcurrencyRate = ref<number>(1)
const IQDcashAmount = ref(0)
const USDcashAmount = ref(0)
const USDcashAmountInUSD = ref(0)
const createRecord = ref<CreateRecords>(createRecordsWithDefault)
const currencyDifferencesAccountId = ref<number>(0)
const currencyDifferencesAmount = ref<number>(0)
const userAuth = useAuth();
const haveCashierRole = userAuth.getUser()?.roles?.find((role) => role.name == 'Cashier')
const isCashier = haveCashierRole ? true : false


const iconArrow = locale.value == "ar" ? "lnir-arrow-right" : "lnir-arrow-left"

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
            if (account.chart_account?.code == ChartOfAccountConsts.CLIENTS_CODE) {
                clientsAccountsList.value.push(account)
            } else if (account.chart_account?.code == ChartOfAccountConsts.CURRENCY_DIFFERENCES_CODE) {
                currencyDifferencesAccountId.value = account.id ?? 0
            }
    });
    const { currencies } = await getCurrenciesList(defaultCurrencySearchFilter)
    currenciesList.value = currencies
    availableCurrenciesList.value = currencies
    const usdCurrency = currenciesList.value.find((currency) => !currency.is_main)
    if (usdCurrency) {
        USDcurrencyRate.value = usdCurrency.rate
    }
    createRecord.value.date = new Date().toISOString().substring(0, 10)
    if (isCashier) {
        console.log(IQDcashAccountsList.value)
        console.log(USDcashAccountsList.value)
        // IQDcashAccountId.value = IQDcashAccountsList.value[0].id ?? 0
        // USDcashAccountId.value = USDcashAccountsList.value[0].id ?? 0
    }
})

const validationSchema = cutomerCashReceiptValidationSchema
const { handleSubmit } = useForm({
    validationSchema,
    initialValues: {
        client_account: 0,
        iqd_cash_account: 0,
        usd_cash_account: 0,
        iqd_amount: 0,
        usd_amount: 0,
        iqd_currency_rate: 1,
        usd_currency_rate: USDcurrencyRate.value,
        date: new Date().toISOString().substring(0, 10),
        note: undefined
    }
});
const onSubmit = handleSubmit(async () => {
    if (IQDcashAmount.value == 0 && USDcashAmount.value == 0) {
        notif.error({ message: t('toast.error.please_select_at_least_iqd_or_usd') })
        return
    }
    const clientAccount = clientsAccountsList.value.find((account) => account.id == clientAccountId.value) ?? defaultAccount
    if (!clientAccount.currency?.is_main) {

        currencyDifferencesAmount.value = Number(IQDcashAmount.value) + Number(USDcashAmount.value) - (Number(IQDcashAmount.value) + Number(USDcashAmount.value) * clientAccount.currency_rate / USDcurrencyRate.value)
    } else {
        currencyDifferencesAmount.value = 0
    }

    createRecord.value.accounts = []
    if (USDcashAmount.value != 0) {
        createRecord.value.accounts.push({ account_id: USDcashAccountId.value, amount: USDcashAmount.value, type: AccountConsts.DEBIT_TYPE })
        createRecord.value.currency_id = currenciesList.value.find((currency) => !currency.is_main)?.id ?? 0
        createRecord.value.currency_rate = USDcurrencyRate.value
    } else {
        createRecord.value.currency_rate = 1
        createRecord.value.currency_id = currenciesList.value.find((currency) => currency.is_main)?.id ?? 0

    }
    if (IQDcashAmount.value != 0) {
        createRecord.value.accounts.push({ account_id: IQDcashAccountId.value, amount: IQDcashAmount.value, type: AccountConsts.DEBIT_TYPE })
    }
    createRecord.value.accounts.push(
        { account_id: clientAccountId.value, amount: Number(IQDcashAmount.value) + Number(USDcashAmount.value) - currencyDifferencesAmount.value, type: AccountConsts.CREDIT_TYPE })
    if (currencyDifferencesAmount.value != 0) {
        createRecord.value.accounts.push(
            { account_id: currencyDifferencesAccountId.value, amount: Math.abs(currencyDifferencesAmount.value), type: currencyDifferencesAmount.value > 0 ? AccountConsts.CREDIT_TYPE : AccountConsts.DEBIT_TYPE },
        )
    }
    createRecord.value.transaction_type_id = 1
    createRecord.value.recordType = TransactionConsts.CLIENT_CASH_RECEIPT
    createRecord.value.amount = Number(IQDcashAmount.value) + Number(USDcashAmount.value)
    const { success, message } = await createRecords(createRecord.value)
    if (success) {
        notif.success(t('toast.success.add'));
        router.push({ path: `/transaction/customer-cash-receipt` });

    } else {
        notif.error({ message: message, duration: 3000 })

    }
})

watch(clientAccountId, (value) => {
    if (value != 0) {
        const clientAccount = clientsAccountsList.value.find((account) => account.id == value) ?? defaultAccount
        if (!clientAccount.currency?.is_main) {
            currencyDifferencesAmount.value = Number(IQDcashAmount.value) + Number(USDcashAmount.value) - (Number(IQDcashAmount.value) + Number(USDcashAmount.value) * clientAccount.currency_rate / USDcurrencyRate.value)
        } else {
            currencyDifferencesAmount.value = 0
        }
    }
})
watch(USDcurrencyRate, (value) => {
    USDcashAmount.value = USDcashAmountInUSD.value * value

    const clientAccount = clientsAccountsList.value.find((account) => account.id == clientAccountId.value) ?? defaultAccount

    if (!clientAccount.currency?.is_main) {
        currencyDifferencesAmount.value = Number(IQDcashAmount.value) + Number(USDcashAmount.value) - (Number(IQDcashAmount.value) + Number(USDcashAmount.value) * clientAccount.currency_rate / value)
    } else {
        currencyDifferencesAmount.value = 0
    }
})
watch(USDcashAmount, (value) => {
    const clientAccount = clientsAccountsList.value.find((account) => account.id == clientAccountId.value) ?? defaultAccount

    if (!clientAccount.currency?.is_main) {
        currencyDifferencesAmount.value = Number(IQDcashAmount.value) + Number(value) - (Number(IQDcashAmount.value) + Number(value) * clientAccount.currency_rate / USDcurrencyRate.value)
    } else {
        currencyDifferencesAmount.value = 0
    }
})
watch(IQDcashAmount, (value) => {
    const clientAccount = clientsAccountsList.value.find((account) => account.id == clientAccountId.value) ?? defaultAccount

    if (!clientAccount.currency?.is_main) {
        currencyDifferencesAmount.value = Number(value) + Number(USDcashAmount.value) - (Number(value) + Number(USDcashAmount.value) * clientAccount.currency_rate / USDcurrencyRate.value)
    } else {
        currencyDifferencesAmount.value = 0
    }
})
watch(USDcashAmountInUSD, (value) => {
    USDcashAmount.value = value * USDcurrencyRate.value
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
                                    <div class="column is-12">
                                        <VField id="iqd_currency_rate">
                                            <VLabel class="required">{{ t('customer_cash_receipt.form.iqd_currency_rate') }}
                                            </VLabel>
                                            <VControl icon="feather:dollar-sign">
                                                <VInput disabled v-model="IQDcurrencyRate" placeholder="" type="number" />
                                                <ErrorMessage class="help is-danger" name="iqd_currency_rate" />
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
                                    <div class="column is-12">
                                        <VField id="usd_currency_rate">
                                            <VLabel class="required">{{ t('customer_cash_receipt.form.usd_currency_rate') }}
                                            </VLabel>
                                            <VControl icon="feather:dollar-sign">
                                                <VInput v-model="USDcurrencyRate" placeholder="" type="number" />
                                                <ErrorMessage class="help is-danger" name="usd_currency_rate" />
                                            </VControl>
                                        </VField>
                                    </div>
                                </div>
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
