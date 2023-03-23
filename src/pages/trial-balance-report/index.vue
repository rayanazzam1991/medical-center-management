<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "permissions": [
            "trial_balance_generate"
        ]
    }
}
</route>
    
<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { Notyf } from 'notyf';
import { ErrorMessage } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import { useNotyf } from '/@src/composable/useNotyf';
import { TrialBalance, defaultTrialBalance, AccountConsts } from '/@src/models/Accounting/Account/account';
import { generateTrailBalanceReport } from '/@src/services/Accounting/Account/accountService';
import { useAccount } from '/@src/stores/Accounting/Account/accountStore';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import usePrint from '/@src/composable/usePrint';
import { trialBalancePrintStyle } from '/@src/utils/PrintStyles/printStyles'


const viewWrapper = useViewWrapper()
const { t } = useI18n()
viewWrapper.setPageTitle(t('trial_balance_report.title'))

useHead({ title: t('trial_balance_report.title'), })
const notif = useNotyf() as Notyf
const accountStore = useAccount()
const trialBalance = ref<TrialBalance>(defaultTrialBalance)
const keyIncrement = ref(0)
const router = useRouter()
const isExpanded = ref(false)
onMounted(async () => {
    const { trial_balance } = await generateTrailBalanceReport()
    trialBalance.value = trial_balance
    keyIncrement.value++


});
const toggle = () => {
    isExpanded.value = !isExpanded.value
    keyIncrement.value++
}
const { printDiv } = usePrint('');
const print = () => printDiv('printerable')

</script>

<template>
    <div class="header is-flex is-justify-content-space-between is-align-items-center">
        <h1>{{ t('trial_balance_report.title') }}</h1>
        <div class="is-flex is-align-items-center">

            <VButton class="mr-2" :loading="accountStore.loading" color="primary" @click="toggle">{{
                t('trial_balance_report.expand_collapse_button') }} </VButton>
            <VIconButton icon="lnir lnir-printer" :loading="accountStore.loading" outlined color="primary" @click="print" />
        </div>
    </div>

    <div class="trial-balance-report-layout">

        <div v-if="accountStore.loading" class="columns is-multiline">
            <div ref="markdownContainer" class="column doc-column is-12">
                <VPlaceholderPage :title="t('trial_balance_report.place_holder.title')"
                    :subtitle="t('trial_balance_report.place_holder.subtitle')" larger>
                    <template #image>
                        <img class="light-image" src="/@src/assets/illustrations/placeholders/search-1.svg" alt="" />
                        <img class="dark-image" src="/@src/assets/illustrations/placeholders/search-1-dark.svg" alt="" />
                    </template>
                </VPlaceholderPage>
            </div>
        </div>
        <div v-else>
            <div v-if="trialBalance.main_charts.length != 0"
                class="account-details table-header columns is-flex-direction-row-reverse is-justify-content-end account-details-padding my-0">
                <div class="is-flex">
                    <div class="chart-row">
                        <div class="accounts-cell has-bold">
                            {{ t('trial_balance_report.credit') }}
                        </div>
                    </div>
                    <div class="chart-row mr-5">
                        <div class="accounts-cell has-bold">
                            {{ t('trial_balance_report.debit') }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="column is-12 pb-0">
                <TrailBalanceCollapse :items="trialBalance.main_charts" with-chevron :key="keyIncrement"
                    :is_expanded="isExpanded" />
        </div>

        <div v-if="trialBalance.main_charts.length != 0"
                class="account-details accounts-footer columns is-flex-direction-row-reverse is-justify-content-end account-details-padding mt-4 mb-0">
                <div class="is-flex">
                <div class="chart-row">
                    <div class="accounts-cell has-bold">
                        {{ trialBalance.total_credits }}
                        </div>

                    </div>
                    <div class="chart-row mr-5">
                        <div class="accounts-cell has-bold">
                            {{ trialBalance.total_debits }}
                        </div>

                    </div>
                </div>
                <div class="chart-row total"> {{ t('trial_balance_report.final_total') }} </div>
            </div>

        </div>
    </div>
    <div class="is-hidden" id="printerable">
        <h1 style="font-weight: 600;text-align: center; margin:20px; padding: 20px;">{{ t('print.date') }} {{ new
            Date().toLocaleDateString() }}
        </h1>
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
@import '/@src/scss/Styles/TrialBalanceReport/trialBalance.scss';
</style>
