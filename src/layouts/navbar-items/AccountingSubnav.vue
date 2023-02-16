<script setup lang="ts">
import { useI18n } from 'vue-i18n';

type TabId = 'accounting' | 'templates'
const activeTab = ref<TabId>('accounting')
const emits = defineEmits<{
    (e: 'close'): void
}>()
const { t } = useI18n()

</script>

<template>
    <div class="navbar-subnavbar-inner tabs-wrapper" @mouseleave="() => emits('close')">


        <div class="container">
            <div class="tab-content" :class="[activeTab === 'accounting' && 'is-active']">
                <div class="tab-content-inner">
                    <div class="center has-slimscroll">
                        <div class="columns">
                            <div class="column is-4">
                                <h4 class="column-heading">{{ t('accounting_subnav.salary.salaries') }}</h4>
                                <ul>
                                    <li>
                                        <RouterLink to="/salary">
                                            <i class="fas fa-money-bill-wave mx-3" aria-hidden="true"></i> <span>{{
                                                t('accounting_subnav.salary.salaries_history')
                                            }}</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                    <li>
                                        <RouterLink to="/deliver-salaries">
                                            <i class="fas fa-money-bill-alt mx-3" aria-hidden="true"></i> <span>{{
                                                t('accounting_subnav.salary.deliver_salaries')
                                            }}</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                    <li>
                                        <RouterLink to="/onhold-salaries">
                                            <i class="fas fa-boxes mx-3" aria-hidden="true"></i>
                                            <span>{{ t('accounting_subnav.salary.onhold_salaries') }}</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                </ul>
                            </div>
                            <div class="column is-4">
                                <h4 class="column-heading">{{ t('accounting_subnav.reports.reports') }}</h4>
                                <ul>
                                    <li>
                                        <RouterLink to="/trial-balance-report">
                                            <i class="lnir lnir-sales-report" aria-hidden="true"></i>
                                            <span>{{
                                                t('accounting_subnav.reports.trial_balance_report')
                                            }}</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
@import '/@src/scss/abstracts/all';
@import '/@src/scss/layout/navbar';
@import '/@src/scss/layout/responsive';
</style>
