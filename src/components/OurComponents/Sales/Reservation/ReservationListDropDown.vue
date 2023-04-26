<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { checkPermission } from '/@src/composable/checkPermission';
export interface ReservationListDropDownProps {
    cancelPermission: string,
    deactivatePermission: string,
    canCancelDeactivate: boolean,
}

const props = withDefaults(defineProps<ReservationListDropDownProps>(), {
    cancelPermission: undefined,
    deactivatePermission: undefined,
    canCancelDeactivate: undefined,

})
const cancelPermission = props.cancelPermission
const deactivatePermission = props.deactivatePermission
const canCancelDeactivate = props.canCancelDeactivate
const { t } = useI18n()
const emits = defineEmits<{
    (e: 'cancel'): void
    (e: 'deactivate'): void
}>()

</script>

<template>
    <VDropdown icon="feather:more-vertical" class="is-pushed-mobile" spaced right>
        <template #content="{ close }">
            <a v-if="canCancelDeactivate" v-permission="cancelPermission" role="menuitem" href="#"
                class="dropdown-item is-media" @click.prevent="
                    () => {
                        emits('cancel')
                        close()
                    }
                ">
                <div class="icon">
                    <i class="fas fa-calendar-times" aria-hidden="true"></i>
                </div>
                <div class="meta">
                    <span>{{ t('reservation.drop_down.cancel_reservation') }}</span>
                </div>
            </a>
            <a v-if="canCancelDeactivate" v-permission="deactivatePermission" role="menuitem" href="#"
                class="dropdown-item is-media" @click.prevent="
                    () => {
                        emits('deactivate')
                        close()
                    }
                ">
                <div class="icon">
                    <i class="fas fa-trash" aria-hidden="true"></i>
                </div>
                <div class="meta">
                    <span>{{ t('reservation.drop_down.deactivate_reservation') }}</span>
                </div>
            </a>
            <a v-if="(!checkPermission(deactivatePermission) || !canCancelDeactivate) && (!checkPermission(cancelPermission) || !canCancelDeactivate)"
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
