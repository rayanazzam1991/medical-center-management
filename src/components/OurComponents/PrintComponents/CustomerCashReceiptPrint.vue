<script lang="ts">
import { useI18n } from "vue-i18n"
import { addParenthesisToString } from "/@src/composable/helpers/stringHelpers"
import { AccountConsts, defaultBalanceSheet } from "/@src/models/Accounting/Account/account"
import { defaultTransaction } from "/@src/models/Accounting/Transaction/record"
import { CurrencyConsts } from "/@src/models/Accounting/Currency/currency"


export default defineComponent({
    props: {
        customerCashReceipt: {
            default: defaultTransaction,
        },

    },

    setup(props, context) {
        const { t } = useI18n()
        const customerCashReceipt = ref(defaultTransaction)
        customerCashReceipt.value = props.customerCashReceipt
        const IQDAmount = customerCashReceipt.value.entries.find((entry) => (entry.account.chart_account?.code
            == AccountConsts.CASH_CODE && entry.account.currency?.code ==
            CurrencyConsts.IQD_CODE))?.amount ?? '-'

        const USDAmountInIQD = customerCashReceipt.value?.entries?.find(
            (entry) =>
                entry.account?.chart_account?.code === AccountConsts.CASH_CODE &&
                entry.account?.currency?.code === CurrencyConsts.USD_CODE
        )?.amount
        const USDAmount = USDAmountInIQD ? (Number(USDAmountInIQD.replace(/,/g, '')) / customerCashReceipt.value.currency_rate).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }) : '-'

        return { t, customerCashReceipt, AccountConsts, addParenthesisToString, IQDAmount, USDAmount }
    },


})




</script>

<template>
    <div class="is-hidden" id="printerable">
        <div style="display: flex; justify-content: space-between;">
            <h1 style="font-weight: normal; font-size: 10px;text-align: center;">{{ t('print.date') }} {{ new
                Date().toLocaleDateString() }}
            </h1>
            <img src="/images/logos/logo/logo.png" alt="SBC LOGO" width="123" height="33">
        </div>
        <h1 style="font-weight: 600;text-align: center; margin:2px; padding: 2px; font-size: 12px; margin-bottom: 5px;">{{
            t('customer_cash_receipt.table.print_title') }}
        </h1>
        <table style="width: 100%; font-size: 10px; border-collapse: collapse;">
            <thead>
                <tr>
                </tr>
            </thead>
            <tbody>
                <td colspan="3" style="text-align: center; padding: 3px; border: 2px solid #333;">
                    <strong>{{ t('print.customer_cash_receipt.from_customer') }}
                        {{ customerCashReceipt.entries.find((entry) => entry.account.chart_account?.code ==
                            AccountConsts.CLIENTS_CODE)?.account.name }}
                    </strong>
                </td>
                <tr>
                    <td style="width: 60%; padding: 3px; border-bottom: 1px solid #ddd;text-align: right;">{{
                        customerCashReceipt.date }}
                    </td>

                    <td colspan="2" style="width: auto; text-align: right; padding: 3px; border-bottom: 1px solid #ddd;">
                        <strong>{{ t('print.customer_cash_receipt.date') }}</strong>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 3px; border-bottom: 1px solid #ddd;text-align: right;">{{
                        IQDAmount }}
                    </td>

                    <td colspan="2" style="text-align: right; padding: 3px; border-bottom: 1px solid #ddd;">
                        <strong>{{ t('print.customer_cash_receipt.iqd_amount') }}</strong>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 3px; border-bottom: 1px solid #ddd;text-align: right;">{{
                        USDAmount }}
                    </td>

                    <td colspan="2" style="text-align: right; padding: 3px; border-bottom: 1px solid #ddd;">
                        <strong>{{ t('print.customer_cash_receipt.usd_amount') }}</strong>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 3px; border-bottom: 1px solid #ddd;text-align: right;">{{
                        customerCashReceipt.note ?? '-' }}
                    </td>

                    <td colspan="2" style="text-align: right; padding: 3px; border-bottom: 1px solid #ddd;">
                        <strong>{{ t('print.customer_cash_receipt.note') }}</strong>
                    </td>
                </tr>

            </tbody>

        </table>
        <p style="font-weight: normal;text-align: right; font-size: 8px;">{{
            t('print.signature') }}
        </p>
        <p style="font-weight: normal;text-align: right; font-size: 8px;">
            ____________________</p>

    </div>
</template>

<style   lang="scss">
@import '/@src/scss/styles/tableHeader.scss';
</style>
