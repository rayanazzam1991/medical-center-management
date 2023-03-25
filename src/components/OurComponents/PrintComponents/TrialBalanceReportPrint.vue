<script lang="ts">
import { useI18n } from "vue-i18n"
import { AccountConsts, defaultTrialBalance } from "/@src/models/Accounting/Account/account"


export default defineComponent({
    props: {
        trailBalance: {
            default: defaultTrialBalance,
        },

    },

    setup(props, context) {
        const { t } = useI18n()
        const trialBalance = props.trailBalance
        return { t, trialBalance, AccountConsts }
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
            t('trial_balance_report.title') }}
    </h1>
    <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
            <thead>
                <tr>
                    <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">{{
                        t('print.trial_balance.total_credit') }}</th>
                    <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">
                        {{ t('print.trial_balance.total_debit') }}</th>
                    <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">{{
                        t('print.trial_balance.account_name') }}</th>
                    <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">{{
                        t('print.trial_balance.account_code') }}</th>




                </tr>
            </thead>
            <tbody>
                <tr v-for="chart in trialBalance.main_charts">
                    <!-- <td style="padding: 8px; border: 1px solid #ddd;">{{ chart.code }}</td>
                                                                                                                                                                                <td style="padding: 8px; border: 1px solid #ddd;">{{ chart.name }}</td>
                                                                                                                                                                                <td style="padding: 8px; border: 1px solid #ddd;">{{ chart.total_credits }}</td>
                                                                                                                                                                                <td style="padding: 8px; border: 1px solid #ddd;">{{ chart.total_debits }}</td> -->
                <tr v-for="lvl2 in chart.children">
                    <!-- <td style="padding: 8px; border: 1px solid #ddd;">{{ lvl2.code }}</td>
                                                                                                                                                                                <td style="padding: 8px; border: 1px solid #ddd;">{{ lvl2.name }}</td>
                                                                                                                                                                                <td style="padding: 8px; border: 1px solid #ddd;">{{ lvl2.total_credits }}</td>
                                                                                                                                                                                <td style="padding: 8px; border: 1px solid #ddd;">{{ lvl2.total_debits }}</td> -->
                <tr v-for="account in lvl2.accounts">
                    <td style="padding: 8px; border: 1px solid #ddd;">{{ account.absolute_type == AccountConsts.CREDIT_TYPE
                        ? account.absolute_balance : '0.00' }}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">{{ account.absolute_type == AccountConsts.DEBIT_TYPE ?
                        account.absolute_balance : '0.00' }}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">{{ account.name }}</td>

                    <td style="padding: 8px; border: 1px solid #ddd;">{{ account.code }}</td>

                </tr>
                </tr>

                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">{{ trialBalance.total_credits }}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">{{ trialBalance.total_debits }}</td>
                    <td colspan="2" style="text-align: left; padding: 8px; border: 1px solid #ddd;">
                        <strong>{{ t('print.trial_balance.total') }}</strong>
                    </td>

                </tr>
            </tfoot>
        </table>
    </div>
</template>

<style   lang="scss">
@import '/@src/scss/styles/tableHeader.scss';
</style>
