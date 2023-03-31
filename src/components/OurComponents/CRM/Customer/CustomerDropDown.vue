<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { checkPermission } from '/@src/composable/checkPermission';
export interface CustomerDropDownProps {
    viewPermission: string,
    changeStatusPermission: string,
    addReminderPermission: string,

}

const { t } = useI18n()
const emits = defineEmits<{
    (e: 'view'): void
    (e: 'changeStatus'): void
    (e: 'addReminder'): void

}>()
const props = withDefaults(defineProps<CustomerDropDownProps>(), {
    viewPermission: undefined,
    changeStatusPermission: undefined,
    addReminderPermission: undefined,

})
const addReminderPermission = props.addReminderPermission
const viewPermission = props.viewPermission
const changeStatusPermission = props.changeStatusPermission

</script>

<template>
    <VDropdown icon="feather:more-vertical" class="is-pushed-mobile" spaced right>
        <template #content="{ close }">
            <a v-permission="viewPermission" role="menuitem" href="#" class="dropdown-item is-media" @click.prevent="
                () => {
                    emits('view')
                    close()
                }
            ">
                <div class="icon">
                    <i aria-hidden="true" class="fas fa-eye"></i>
                </div>
                <div class="meta">
                    <span>{{ t('drop_down.view') }}</span>
                </div>
            </a>

            <a v-permission="changeStatusPermission" role="menuitem" href="#" class="dropdown-item is-media" @click.prevent="
                () => {
                    emits('changeStatus')
                    close()
                }
            ">
                <div class="icon">
                    <i class="fas fa-user-edit" aria-hidden="true"></i>
                </div>
                <div class="meta">
                    <span>{{ t('drop_down.change_status') }}</span>
                </div>
            </a>
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
            <a v-if="!checkPermission(viewPermission) && !checkPermission(changeStatusPermission) && !checkPermission(addReminderPermission)"
                role="menuitem" class="dropdown-item is-media">
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
