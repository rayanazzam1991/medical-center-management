<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { checkPermission } from '/@src/composable/checkPermission';
import { Permissions } from '/@src/utils/consts/rolesPermissions'


type TabId = 'ticketing'
const activeTab = ref<TabId>('ticketing')
const { t } = useI18n()
const emits = defineEmits<{
    (e: 'close'): void
}>()

</script>

<template>
    <div class="navbar-subnavbar-inner tabs-wrapper" @mouseleave="() => emits('close')">
        <div class="container">
            <div class="tab-content" :class="[activeTab === 'ticketing' && 'is-active']">
                <div class="tab-content-inner">
                    <div class="center">
                        <div class="columns">
                            <div class="column is-4"
                                v-if="checkPermission(Permissions.TICKET_ACCESS) || checkPermission(Permissions.WAITING_LIST_ACCESS)">
                                <h4 v-permission="Permissions.TICKET_ACCESS" class="column-heading">{{
                                    t('ticketing_subnav.ticket.tickets') }}</h4>
                                <ul>
                                    <li v-permission="Permissions.TICKET_LIST">
                                        <RouterLink to="/ticket">
                                            <i class="lnir lnir-ticket-alt" aria-hidden="true"></i>
                                            <span>{{ t('ticketing_subnav.ticket.tickets') }}</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                    <li v-permission="Permissions.TICKET_CREATE">
                                        <RouterLink to="/ticket/add">
                                            <i aria-hidden="true" class="lnir lnir-circle-plus"></i>
                                            <span>{{ t('ticketing_subnav.ticket.create_ticket') }}</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                </ul><br />
                                <h4 v-permission="Permissions.WAITING_LIST_ACCESS" class="column-heading">{{
                                    t('ticketing_subnav.waiting_list.waiting_lists') }}</h4>
                                <ul>
                                    <li v-permission="Permissions.WAITING_LIST_LIST">
                                        <RouterLink to="/waiting-list">
                                            <i class="lnir lnir-list" aria-hidden="true"></i>
                                            <span>{{ t('ticketing_subnav.waiting_list.waiting_lists') }}</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                </ul><br />
                            </div>
                            <div class="column is-4"
                                v-if="checkPermission(Permissions.TICKET_SERVICE_ACCESS) || checkPermission(Permissions.REMINDER_ACCESS)">
                                <h4 v-permission="Permissions.TICKET_SERVICE_ACCESS" class="column-heading">{{
                                    t('ticketing_subnav.requested_services.requested_services') }}
                                </h4>
                                <ul>
                                    <li v-permission="Permissions.TICKET_SERVICE_LIST">
                                        <RouterLink to="/requested-services">
                                            <i class="lnir lnir-service" aria-hidden="true"></i>
                                            <span>{{ t('ticketing_subnav.requested_services.requested_services') }}</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                </ul><br />
                                <h4 v-permission="Permissions.REMINDER_ACCESS" class="column-heading">{{
                                    t('ticketing_subnav.reminder.reminders') }}
                                </h4>
                                <ul>
                                    <li v-permission="Permissions.REMINDER_LIST">
                                        <RouterLink to="/reminder">
                                            <i class="lnir lnir-alarm-2" aria-hidden="true"></i>
                                            <span>{{
                                                t('ticketing_subnav.reminder.reminders') }}</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                </ul><br />
                            </div>
                            <div class="column is-4" v-if="checkPermission(Permissions.SERVICE_HISTORY_SCREEN_ACCESS)">
                                <h4 v-permission="Permissions.SERVICE_HISTORY_SCREEN_ACCESS" class="column-heading">{{
                                    t('ticketing_subnav.service_history_screen.service_history_screens') }}
                                </h4>
                                <ul>
                                    <li v-permission="Permissions.SERVICE_HISTORY_SCREEN_LIST">
                                        <RouterLink to="/service-history-screen">
                                            <i class="lnir lnir-display-alt" aria-hidden="true"></i>
                                            <span>{{ t('ticketing_subnav.service_history_screen.service_history_screens')
                                            }}</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>
                                    <li v-permission="Permissions.SERVICE_HISTORY_SCREEN_CREATE">
                                        <RouterLink to="/service-history-screen/add">
                                            <i aria-hidden="true" class="lnir lnir-circle-plus"></i>
                                            <span>{{
                                                t('ticketing_subnav.service_history_screen.create_service_history_screen')
                                            }}</span>
                                            <i aria-hidden="true" class="iconify" data-icon="feather:circle"></i>
                                        </RouterLink>
                                    </li>

                                </ul><br />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
// @import '/@src/scss/abstracts/all';
// @import '/@src/scss/layout/navbar';
// @import '/@src/scss/layout/responsive';
</style>
