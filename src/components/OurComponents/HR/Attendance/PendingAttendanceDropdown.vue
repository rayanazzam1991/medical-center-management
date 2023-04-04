<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { checkPermission } from '/@src/composable/checkPermission';
export interface PendingAttendanceDropDownProps {
    justifyPermission: string,
    unjustifyPermission: string
}

const { t } = useI18n()
const emits = defineEmits<{
    (e: 'justifyAttendance'): void
    (e: 'unjustifyAttendance'): void
}>()
const props = withDefaults(defineProps<PendingAttendanceDropDownProps>(), {
    justifyPermission: undefined,
    unjustifyPermission: undefined
})
const justifyPermission = props.justifyPermission
const unjustifyPermission = props.unjustifyPermission

</script>

<template>
    <VDropdown icon="feather:more-vertical" class="is-pushed-mobile" spaced right>
        <template #content="{ close }">
            <a v-permission="justifyPermission" role="menuitem" href="#" class="dropdown-item is-media" @click.prevent="
                () => {
                    emits('justifyAttendance')
                    close()
                }
            ">
                <div class="icon">
                    <i aria-hidden="true" class="fas fa-check"></i>
                </div>
                <div class="meta">
                    <span>{{ t('pending_attendances.drop_down.justify_attendance') }}</span>
                </div>
            </a>

            <a v-permission="unjustifyPermission" role="menuitem" href="#" class="dropdown-item is-media" @click.prevent="
                () => {
                    emits('unjustifyAttendance')
                    close()
                }
            ">
                <div class="icon">
                    <i class="fas fa-times" aria-hidden="true"></i>
                </div>
                <div class="meta">
                    <span>{{ t('pending_attendances.drop_down.unjustify_attendance') }}</span>
                </div>
            </a>
            <a v-if="!checkPermission(justifyPermission) && !checkPermission(unjustifyPermission)" role="menuitem"
                class="dropdown-item is-media">
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
