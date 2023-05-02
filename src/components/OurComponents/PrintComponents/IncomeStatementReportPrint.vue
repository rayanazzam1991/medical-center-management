<script lang="ts">
import { useI18n } from "vue-i18n"
import { AccountConsts, defaultIncomeStatment } from "/@src/models/Accounting/Account/account"


export default defineComponent({
    props: {
        incomeStatement: {
            default: defaultIncomeStatment,
        },

    },

    setup(props, context) {
        const { t } = useI18n()
        const incomeStatement = props.incomeStatement
        return { t, incomeStatement, AccountConsts }
    },


})




</script>

<template>
    <div class="is-hidden" id="printerable">
        <div style="display: flex; justify-content: space-between;">

            <h1 style="font-weight: normal; font-size: 1rem;text-align: center;">{{ t('print.date') }} {{ new
                Date().toLocaleDateString() }}
            </h1>
            <img src="/images/logos/logo/logo.png" alt="SBC LOGO" width="123" height="35">

        </div>
        <h1 style="font-weight: 600;text-align: center; margin:20px; padding: 20px; font-size: 24px;">{{
            t('income_statment_report.title') }}
        </h1>
        <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
            <thead>
                <tr>
                    <th style="text-align: center; padding: 8px; border: 1px solid #ddd;">{{
                        t('print.income_statement.balance') }}</th>
                    <th style="text-align: center; padding: 8px; border: 1px solid #ddd;">{{
                        t('print.income_statement.account_name') }}</th>
                    <th style="text-align: center; padding: 8px; border: 1px solid #ddd;">{{
                        t('print.income_statement.account_code') }}</th>


                </tr>
            </thead>
            <tbody>
                <td colspan="3" style="text-align: center; padding: 16px; border: 2px solid #333;">
                    <strong>{{ incomeStatement.revenues.name }}</strong>
                </td>

                <tr v-for="lvl2 in incomeStatement.revenues.children">
                <tr v-for="account in lvl2.accounts">
                    <td style="padding: 8px; border: 1px solid #ddd;text-align: center;">{{ account.balance }}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;text-align: center;">{{ account.name }}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;text-align: center;">{{ account.code }}</td>

                </tr>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;text-align: center;">{{
                        incomeStatement.revenues.total_balances }}
                    </td>

                    <td colspan="2" style="text-align: center; padding: 8px; border: 1px solid #ddd;">
                        <strong>{{ t('print.income_statement.total_revenues') }}</strong>
                    </td>
                </tr>
                <td colspan="3" style="text-align: center; padding: 16px; border: 2px solid #333;">
                    <strong>{{ incomeStatement.costs.name }}</strong>
                </td>

                <tr v-for="account in incomeStatement.costs.accounts">
                    <td style="padding: 8px; border: 1px solid #ddd;text-align: center;">{{ account.balance }}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;text-align: center;">{{ account.code }}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;text-align: center;">{{ account.name }}</td>


                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;text-align: center;">{{
                        incomeStatement.costs.total_balances
                    }}</td>

                    <td colspan="2" style="text-align: center; padding: 8px; border: 1px solid #ddd;">
                        <strong>{{ t('print.income_statement.total_costs') }}</strong>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;text-align: center;">{{ incomeStatement.gross_profit
                    }}</td>

                    <td colspan="2" style="text-align: center; padding: 8px; border: 1px solid #ddd;">
                        <strong>{{ t('print.income_statement.gross_profit') }}</strong>
                    </td>
                </tr>
                <td colspan="3" style="text-align: center; padding: 16px; border: 2px solid #333;">
                    <strong>{{ incomeStatement.other_expenses.name }}</strong>
                </td>

                <tr v-for="lvl2 in incomeStatement.other_expenses.children">
                <tr v-for="account in lvl2.accounts">
                    <td style="padding: 8px; border: 1px solid #ddd;text-align: center;">{{ account.balance }}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;text-align: center;">{{ account.name }}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;text-align: center;">{{ account.code }}</td>

                </tr>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;text-align: center;">{{
                        incomeStatement.other_expenses.total_balances }}
                    </td>

                    <td colspan="2" style="text-align: center; padding: 8px; border: 1px solid #ddd;">
                        <strong>{{ t('print.income_statement.total_other_expenses') }}</strong>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;text-align: center;">{{
                        incomeStatement.net_income }}
                    </td>

                    <td colspan="2" style="text-align: center; padding: 8px; border: 1px solid #ddd;">
                        <strong>{{ t('print.income_statement.net_income') }}</strong>
                    </td>
                </tr>

            </tbody>

        </table>
    </div>
</template>

<style   lang="scss">
@import '/@src/scss/styles/tableHeader.scss';
</style>
