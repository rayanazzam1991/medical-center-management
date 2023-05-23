<script lang="ts">
import { useI18n } from "vue-i18n"
import { CurrencyConsts } from "/@src/models/Accounting/Currency/currency"
import { AccountConsts } from "/@src/models/Accounting/Account/account"
import { defaultTransaction } from "/@src/models/Accounting/Transaction/record"
import { ChartOfAccountConsts } from "/@src/models/Accounting/ChartOfAccount/chartOfAccount"
import { addParenthesisToString } from "/@src/composable/helpers/stringHelpers"

export default defineComponent({
    props: {
        receipt: {
            default: defaultTransaction,
        },
        openModal: {
            default: false,
        },


    },
    emits: ['openModal'],

    setup(props, context) {
        const receipt = props.receipt
        const { t } = useI18n()
        let openModal = computed({
            get: () => props.openModal as boolean,
            set(value) {
                value = false
                context.emit('openModal', value)

            },
        })

        const IQDAccountCashName = receipt.entries.find((entry) => (entry.account.chart_account?.code
            == AccountConsts.CASH_CODE && entry.account.currency?.code ==
            CurrencyConsts.IQD_CODE))?.account.name ?? '-'
        const IQDAccountCurrencyRate = receipt.entries.find((entry) => (entry.account.chart_account?.code
            == AccountConsts.CASH_CODE && entry.account.currency?.code ==
            CurrencyConsts.IQD_CODE))?.account.currency_rate ?? '-'
        const IQDAmount = receipt.entries.find((entry) => (entry.account.chart_account?.code
            == AccountConsts.CASH_CODE && entry.account.currency?.code ==
            CurrencyConsts.IQD_CODE))?.amount ?? '-'
        const USDAccountCashName = receipt.entries.find((entry) => (entry.account.chart_account?.code
            == AccountConsts.CASH_CODE && entry.account.currency?.code ==
            CurrencyConsts.USD_CODE))?.account.name ?? '-'
        const USDAccountCurrencyRate = USDAccountCashName != '-' ? receipt.currency_rate : '-'
        const USDAmountInIQD = receipt?.entries?.find(
            (entry) =>
                entry.account?.chart_account?.code === AccountConsts.CASH_CODE &&
                entry.account?.currency?.code === CurrencyConsts.USD_CODE
        )?.amount
        const USDAmount = USDAmountInIQD ? (Number(USDAmountInIQD.replace(/,/g, '')) / receipt.currency_rate).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }) : '-'
        const currencyDifferenceAmount = receipt.entries.find((entry) => (entry.account.chart_account?.code
            == ChartOfAccountConsts.CURRENCY_DIFFERENCES_CODE))?.amount ?? '-'

        return {
            t, receipt, openModal, AccountConsts, CurrencyConsts,
            IQDAccountCashName, IQDAccountCurrencyRate, IQDAmount, USDAccountCashName, USDAccountCurrencyRate, USDAmount, currencyDifferenceAmount, addParenthesisToString
        }
    },
})




</script>

<template>
    <VModal :title="receipt.title ?? t('transaction.table.entries.place_holder_title')" :open="openModal" actions="right"
        size="big" @close="openModal = false" :cancel-label="t('transaction.table.entries.cancel_label')">
        <template #content>
            <div class="columns is-multiline p-2">
                <div class="column is-12">
                    <p> {{ receipt.entries.find((entry) =>
                        entry.account.chart_account?.code ==
                        AccountConsts.SUPPLIER_CODE) ? t('supplier_cash_receipt.table.columns.supplier_name') :
                        receipt.entries.find((entry) =>
                            entry.account.chart_account?.code ==
                            AccountConsts.EMPLOYEE_CODE) ? t('supplier_cash_receipt.table.columns.employee_name') :
                            '-' }} :
                        <span class="has-text-primary">
                            {{ receipt.entries.find((entry) =>
                                entry.account.chart_account?.code ==
                                AccountConsts.SUPPLIER_CODE)?.account.name ??
                                receipt.entries.find((entry) =>
                                    entry.account.chart_account?.code ==
                                    AccountConsts.EMPLOYEE_CODE)?.account.name }}
                        </span>
                    </p>
                </div>
                <div class="column is-12 columns p-0 m-0 py-2 px-5">
                    <div class="column is-4 columns is-multiline m-0 p-0 my-2 split-border">
                        <div class="column is-12 split-border-bottom">
                            <p>-</p>
                        </div>

                        <div class="column is-12 split-border-bottom">
                            <p> {{ t('supplier_cash_receipt.table.columns.account') }}</p>
                        </div>
                        <div class="column is-12 split-border-bottom">
                            <p> {{ t('supplier_cash_receipt.table.columns.currency_rate') }}</p>
                        </div>
                        <div class="column is-12">
                            <p> {{ t('supplier_cash_receipt.table.columns.cash_amount') }}</p>
                        </div>
                    </div>

                    <div class="column is-4 columns is-multiline m-0 p-0 my-2 split-border">
                        <div class="column is-12 split-border-bottom">
                            <p> {{ t('supplier_cash_receipt.table.columns.iqd') }} </p>
                        </div>

                        <div class="column is-12 split-border-bottom">
                            <p> {{ IQDAccountCashName }}
                            </p>
                        </div>
                        <div class="column is-12 split-border-bottom">
                            <p> {{ IQDAccountCurrencyRate }}
                            </p>
                        </div>
                        <div class="column is-12">
                            <p> {{ IQDAmount }}
                            </p>
                        </div>
                    </div>
                    <div class="column is-4 columns is-multiline m-0 p-0 my-2">
                        <div class="column is-12 split-border-bottom">
                            <p> {{ t('supplier_cash_receipt.table.columns.usd') }}</p>
                        </div>

                        <div class="column is-12 split-border-bottom">
                            <p> {{ USDAccountCashName }} </p>
                        </div>
                        <div class="column is-12 split-border-bottom">
                            <p> {{ USDAccountCurrencyRate }}
                            </p>
                        </div>
                        <div class="column is-12">
                            <p> {{ USDAmount }}
                            </p>
                        </div>
                    </div>
                </div>
                <div class="column is-12">
                    <p> {{ t('supplier_cash_receipt.table.columns.currency_difference') }} : <span class="has-text-primary">
                            {{ addParenthesisToString(currencyDifferenceAmount) }}</span>
                    </p>
                </div>
                <div class="column is-12">
                    <p> {{ t('supplier_cash_receipt.table.columns.action_date') }} : <span class="has-text-primary">
                            {{ receipt.date }}</span>
                    </p>
                </div>
                <div class="column is-12">
                    <p> {{ t('supplier_cash_receipt.table.columns.note') }} : <span class="has-text-primary">
                            {{ receipt.note ?? '-' }}</span>
                    </p>
                </div>
            </div>
        </template>
    </VModal>
</template>
<style  scoped lang="scss">
.split-border {
    border-left: 1px solid var(--fade-grey-dark-3);
}

.split-border-bottom {
    border-bottom: 1px solid var(--fade-grey-dark-3);

}

.is-dark {
    .split-border {
        border-color: var(--dark-sidebar-light-12) !important;

    }

    .split-border-bottom {
        border-color: var(--dark-sidebar-light-12) !important;

    }
}
</style>


