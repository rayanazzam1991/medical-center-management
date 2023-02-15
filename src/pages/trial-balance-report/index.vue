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
            <div class="account-details columns is-flex-direction-row-reverse is-justify-content-space-between account-details-padding"
                v-if="trialBalance.main_charts.length != 0">
                <div class="meta is-flex column is-3 columns ml-5">
                    <div class="accounts-header column is-6 account-header-padding ">
                        <h1 class="accounts-cell">
                            {{ t('trial_balance_report.credit') }}
                        </h1>

                    </div>

                    <div class="accounts-header column is-6">
                        <h1 class="accounts-cell">
                            {{ t('trial_balance_report.debit') }}
                        </h1>

                    </div>
                </div>
            </div>

            <div class="column is-12 pb-0">
                <TrailBalanceCollapse :items="trialBalance.main_charts" with-chevron :key="keyIncrement"
                    :is_expanded="isExpanded" />
            </div>

            <div v-if="trialBalance.main_charts.length != 0"
                class="account-details accounts-footer columns is-flex-direction-row-reverse is-justify-content-end account-details-padding mb-2">
                <div class="meta is-flex column is-3 columns ml-5 my-0 ">
                    <div class="account-code column is-6 is-align-self-center account-header-padding">
                        <div class="accounts-cell">
                            {{ trialBalance.total_credits }}
                        </div>

                    </div>

                    <div class="account-name column is-6 is-align-self-center">
                        <div class="accounts-cell">
                            {{ trialBalance.total_debits }}
                        </div>

                    </div>
                </div>
                <div class="mt-1 total"> {{ t('trial_balance_report.final_total') }} </div>

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

.report-footer {
    padding-right: 1.5rem;
    padding-left: 1.5rem;
}

.account-details {
    padding: 0;
    margin: 0;
    height: 2rem;
    border-bottom: 1px solid var(--fade-grey-dark-3);

    &.account-details-padding {
        padding-left: 1.5rem;
        padding-bottom: 2.5rem;
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

    .total {
        margin-left: 2.25rem;
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
