<script lang="ts">
import { useI18n } from "vue-i18n"
import { AccountConsts, defaultBalanceSheet } from "/@src/models/Accounting/Account/account"


export default defineComponent({
    props: {
        balanceSheet: {
            default: defaultBalanceSheet,
        },

    },

    setup(props, context) {
        const { t } = useI18n()
        const balanceSheet = props.balanceSheet
        return { t, balanceSheet, AccountConsts }
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
            t('balance_sheet_report.title') }}
        </h1>
        <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
            <thead>
                <tr>

                    <th style="text-align: center; padding: 8px; border: 1px solid #ddd;">{{
                        t('print.balance_sheet.balance') }}</th>
                    <th style="text-align: center; padding: 8px; border: 1px solid #ddd;">{{
                        t('print.balance_sheet.account_name') }}</th>
                    <th style="text-align: center; padding: 8px; border: 1px solid #ddd;">{{
                        t('print.balance_sheet.account_code') }}</th>



                </tr>
            </thead>
            <tbody>
                <td colspan="3" style="text-align: center; padding: 16px; border: 2px solid #333;">
                    <strong>{{ balanceSheet.assets.name }}</strong>
                </td>

                <tr v-for="lvl2 in balanceSheet.assets.children">
                <tr v-for="account in lvl2.accounts">
                    <td style="padding: 8px; border: 1px solid #ddd;text-align: center;">{{ account.balance }}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;text-align: center;">{{ account.name }}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;text-align: center;">{{ account.code }}</td>

                </tr>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;text-align: center;">{{
                        balanceSheet.assets.total_balances }}
                    </td>

                    <td colspan="2" style="text-align: center; padding: 8px; border: 1px solid #ddd;">
                        <strong>{{ t('print.balance_sheet.total_assets') }}</strong>
                    </td>
                </tr>
                <td colspan="3" style="text-align: center; padding: 16px; border: 2px solid #333;">
                    <strong>{{ balanceSheet.liabilities.name }}</strong>
                </td>

                <tr v-for="lvl2 in balanceSheet.liabilities.children">
                <tr v-for="account in lvl2.accounts">
                    <td style="padding: 8px; border: 1px solid #ddd;text-align: center;">{{ account.balance }}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;text-align: center;">{{ account.name }}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;text-align: center;">{{ account.code }}</td>


                </tr>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;text-align: center;">{{
                        balanceSheet.liabilities.total_balances
                    }}</td>

                    <td colspan="2" style="text-align: center; padding: 8px; border: 1px solid #ddd;">
                        <strong>{{ t('print.balance_sheet.total_liabilities') }}</strong>
                    </td>
                </tr>

            </tbody>

        </table>
    </div>
</template>

<style   lang="scss">
@import '/@src/scss/styles/tableHeader.scss';
</style>
