<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { checkPermission } from '/@src/composable/checkPermission';
export interface TicketServiceDropDownProps {
    addReminderPermission: string,
}
const props = withDefaults(defineProps<TicketServiceDropDownProps>(), {
    addReminderPermission: undefined,
})
const addReminderPermission = props.addReminderPermission

const { t } = useI18n()
const emits = defineEmits<{
    (e: 'addReminder'): void
}>()
</script>

<template>
    <VDropdown icon="feather:more-vertical" class="is-pushed-mobile" spaced right>
        <template #content="{ close }">
            <a v-permission="addReminderPermission" role="menuitem" href="#" class="dropdown-item is-media" @click.prevent="
                () => {
                    emits('addReminder')
                    close()
                }
            ">
                <div class="icon">
                    <i class="fas fa-bell" aria-hidden="true"></i>
                </div>
                <div class="meta">
                    <span>{{ t('requested_services.drop_down.add_reminder') }}</span>
                </div>
            </a>
            <a v-if="!checkPermission(addReminderPermission)" role="menuitem" class="dropdown-item is-media">
                <div class=" icon">
                    <i class="fas fa-window-close" aria-hidden="true"></i>
                </div>
                <div class="meta">
                    <span>{{ t('drop_down.no_actions') }}</span>
                </div>
            </a>

        </template>
    </VDropdown>
</template>
