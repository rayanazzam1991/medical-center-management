<script lang="ts">
import { useI18n } from "vue-i18n"
import { addParenthesisToString } from "/@src/composable/helpers/stringHelpers"
import { AccountConsts, defaultBalanceSheet } from "/@src/models/Accounting/Account/account"
import { defaultTransaction } from "/@src/models/Accounting/Transaction/record"


export default defineComponent({
    props: {
        cashReceipt: {
            default: defaultTransaction,
        },

    },

    setup(props, context) {
        const { t } = useI18n()
        const cashReceipt = ref(defaultTransaction)
        cashReceipt.value = props.cashReceipt
        console.log(cashReceipt.value)

        return { t, cashReceipt, AccountConsts, addParenthesisToString }
    },


})




</script>

<template>
    <div class="is-hidden" id="printerable">
        <div style="display: flex; justify-content: space-around;">

            <h1 style="font-weight: normal; font-size: 1rem;text-align: center;">{{ t('print.date') }} {{ new
                Date().toLocaleDateString() }}
            </h1>
            <img src="/images/logos/logo/logo.png" alt="SBC LOGO" width="100">

        </div>
        <h1 style="font-weight: 600;text-align: center; margin:20px; padding: 20px; font-size: 24px;">{{
            t('customer_cash_receipt.table.print_title') }}
        </h1>
        <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
            <thead>
                <tr>
                </tr>
            </thead>
            <tbody>
                <td colspan="3"
                    style="text-align: center; padding: 16px;text-decoration: underline; border: 2px solid #333;">
                    <strong>{{ t('print.customer_cash_receipt.for_customer') }}
                        {{ cashReceipt.entries.find((entry) => entry.account.chart_account?.code ==
                            AccountConsts.SUPPLIER_CODE || entry.account.chart_account?.code ==
                            AccountConsts.EMPLOYEE_CODE)?.account.name }}
                    </strong>
                </td>
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;text-align: right;">{{
                        cashReceipt.date }}
                    </td>

                    <td colspan="2" style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">
                        <strong>{{ t('print.date') }}</strong>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;text-align: right;">{{
                        cashReceipt.amount }} {{ addParenthesisToString(cashReceipt.currency.name) }}
                    </td>

                    <td colspan="2" style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">
                        <strong>{{ t('print.customer_cash_receipt.amount') }}</strong>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;text-align: right;">{{
                        cashReceipt.entries.find((entry) => entry.account.chart_account?.code ==
                            AccountConsts.CASH_CODE)?.account.name }}
                    </td>

                    <td colspan="2" style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">
                        <strong>{{ t('print.customer_cash_receipt.cash_account') }}</strong>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;text-align: right;">{{
                        cashReceipt.title }}
                    </td>

                    <td colspan="2" style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">
                        <strong>{{ t('print.customer_cash_receipt.for') }}</strong>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #ddd;text-align: right;">{{
                        cashReceipt.note ?? '-' }}
                    </td>

                    <td colspan="2" style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">
                        <strong>{{ t('print.customer_cash_receipt.note') }}</strong>
                    </td>
                </tr>

            </tbody>

        </table>
        <p style="font-weight: normal;text-align: right; font-size: 16px;">{{
            t('print.signature') }}
        </p>
        <p style="font-weight: normal;text-align: right; font-size: 16px; border-buttoms: 1px solid #ddd;">
            ____________________</p>

    </div>
</template>

<style   lang="scss">
@import '/@src/scss/styles/tableHeader.scss';
</style>
