<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { Notyf } from 'notyf';
import { ErrorMessage } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import { useNotyf } from '/@src/composable/useNotyf';
import { TrialBalance, defaultTrialBalance } from '/@src/models/Accounting/Account/account';
import { generateTrailBalanceReport } from '/@src/services/Accounting/Account/accountService';
import { useAccount } from '/@src/stores/Accounting/Account/accountStore';
import { useViewWrapper } from '/@src/stores/viewWrapper';



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
</script>

<template>
    <div class="header is-flex is-justify-content-space-between is-align-items-center">
        <h1>{{ t('trial_balance_report.title') }}</h1>
        <VButton :loading="accountStore.loading" color="primary" @click="toggle">{{
            t('trial_balance_report.expand_collapse_button') }} </VButton>
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
</template>

<style   lang="scss">@import '/@src/scss/Styles/TrialBalanceReport/trialBalance.scss';</style>
