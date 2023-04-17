<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { checkPermission } from '/@src/composable/checkPermission';
import { Permissions } from '/@src/utils/consts/rolesPermissions'


type TabId = 'reporting'
const activeTab = ref<TabId>('reporting')
const { t } = useI18n()
const emits = defineEmits<{
    (e: 'close'): void
}>()

</script>

<template>
    <div class="navbar-subnavbar-inner tabs-wrapper" @mouseleave="() => emits('close')">
        <div class="container">
            <div class="tab-content" :class="[activeTab === 'reporting' && 'is-active']">
                <div class="tab-content-inner">
                    <div class="center">
                        <div class="columns">
                            <div class="column is-6" v-if="checkPermission(Permissions.REPORTING_ACCESS)">
                                <h4 v-permission="Permissions.REPORTING_ACCESS" class="column-heading">{{
                                    t('reporting_subnav.report.reports') }}</h4>
                                <ul>
                                    <li v-permission="Permissions.BEST_CLIENT_REPORT">
                                        <RouterLink to="/report/best-client-report">
                                            <i class="lnir lnir-pie-report" aria-hidden="true"></i>
                                            <span>{{ t('reporting_subnav.report.best_client_report') }}</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                    <li v-permission="Permissions.BEST_SERVICE_PROVIDER_REPORT">
                                        <RouterLink to="/report/best-service-provider-report">
                                            <i class="lnir lnir-pie-report" aria-hidden="true"></i>
                                            <span>{{ t('reporting_subnav.report.best_service_provider_report') }}</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                    <li v-permission="Permissions.BEST_SOLD_ITEM_REPORT">
                                        <RouterLink to="/report/best-sold-item-report">
                                            <i class="lnir lnir-pie-report" aria-hidden="true"></i>
                                            <span>{{ t('reporting_subnav.report.best_sold_item_report') }}</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                    <li v-permission="Permissions.MOST_CONSUMED_ITEM_REPORT">
                                        <RouterLink to="/report/most-consumed-item-report">
                                            <i class="lnir lnir-pie-report" aria-hidden="true"></i>
                                            <span>{{ t('reporting_subnav.report.most_consumed_item_report') }}</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                    <li v-permission="Permissions.SERVICE_PROVIDER_MONTHLY_REPORT">
                                        <RouterLink to="/report/service-provider-monthly-report">
                                            <i class="lnir lnir-pie-report" aria-hidden="true"></i>
                                            <span>{{ t('reporting_subnav.report.service_provider_monthly_report') }}</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                    <li v-permission="Permissions.BEST_ATTENDING_EMPLOYEE_REPORT">
                                        <RouterLink to="/report/best-attending-employee-report">
                                            <i class="lnir lnir-pie-report" aria-hidden="true"></i>
                                            <span>{{ t('reporting_subnav.report.best_attending_employee_report') }}</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                    <li v-permission="Permissions.WORST_ATTENDING_EMPLOYEE_REPORT">
                                        <RouterLink to="/report/worst-attending-employee-report">
                                            <i class="lnir lnir-pie-report" aria-hidden="true"></i>
                                            <span>{{ t('reporting_subnav.report.worst_attending_employee_report') }}</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                    <li v-permission="Permissions.ACCOUNT_HISTORY_REPORT">
                                        <RouterLink to="/report/account-history-report">
                                            <i class="lnir lnir-pie-report" aria-hidden="true"></i>
                                            <span>{{ t('reporting_subnav.report.account_history_report') }}</span>
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

<style lang="scss"></style>
