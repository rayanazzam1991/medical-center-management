<script setup lang="ts">import { useHead } from '@vueuse/head';
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
        <VButton color="primary" @click="toggle">{{ t('trial_balance_report.expand_collapse_button') }} </VButton>
    </div>

    <div class="trial-balance-report-layout">

        <div v-if="accountStore.loading" class="columns is-multiline">
            <div ref="markdownContainer" class="column doc-column is-12">
                <VPlaceholderPage :title="t('trial_balance_report.place_holder.title')"
                    :subtitle="t('trial_balance_report.place_holder.subtitle')" larger>
                    <template #image>
                        <img class="light-image" src="/@src/assets/illustrations/placeholders/search-1.svg" alt="" />
                        <img class="dark-image" src="/@src/assets/illustrations/placeholders/search-1-dark.svg"
                            alt="" />
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

<style   lang="scss">
.header {
    background-color: var(--white);
    min-height: 50px;
    border-radius: var(--radius-large);
    border: 1px solid var(--fade-grey-dark-3);
    padding: 20px;

    h1 {
        font-family: var(--font-alt);
        font-size: 1.2rem;
        font-weight: 600;
        line-height: 1.3;
    }

}

.trial-balance-report-layout {
    flex: 1;
    display: inline-block;
    width: 100%;
    padding: 20px;
    background-color: var(--white);
    border-radius: var(--radius-large);
    border: 1px solid var(--fade-grey-dark-3);
    transition: all .3s;

}

.header-level {
    &.is-flex {
        background-color: blue;
        margin-left: 44px;

        .chart-row {
            background-color: red;
            width: 200px;
        }

    }
}

.report-footer {
    padding-right: 1.5rem;
    padding-left: 1.5rem;
}

.account-details {
    padding: 0;
    margin: 0;
    height: 2rem;
    border-bottom: 1px solid var(--fade-grey-dark-3);

    &.table-header {
        border-width: 2px !important;
    }

    &.account-details-padding {
        padding-left: 2.5rem;
        padding-bottom: 0;
    }

    &.accounts-footer {
        border: none;
    }

    .meta {

        .account-name,
        .account-code,
        .accounts-header {
            font-size: 1rem;
            font-weight: 700;
            font-family: var(--font);

            .accounts-cell {
                text-align: center;

            }
        }

        .account-code,
        .accounts-header {

            &.account-header-padding {
                padding-left: 4rem;
            }
        }

    }


    .is-flex {
        margin-left: 44px;
    }

    .chart-row {
        width: 200px;
    }

    .has-bold,
    .total {
        font-weight: 800;
        font-family: var(--font-alt);
    }
}


.is-dark {

    .header {
        background: var(--dark-sidebar-light-6);
        min-height: 50px;
        border-radius: var(--radius-large);
        border-style: solid;
        border-color: var(--dark-sidebar-light-12);
        padding: 20px;

        h1 {
            font-family: var(--font-alt);
            font-size: 1.2rem;
            font-weight: 600;
            line-height: 1.3;
        }

    }


    .trial-balance-report-layout {
        background: var(--dark-sidebar-light-6);
        border-color: var(--dark-sidebar-light-12);
    }

    .account-details {
        border-color: var(--dark-sidebar-light-12);

    }

}
</style>
