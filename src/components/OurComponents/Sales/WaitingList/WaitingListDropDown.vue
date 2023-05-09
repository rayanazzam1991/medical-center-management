<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { checkPermission } from '/@src/composable/checkPermission';
export interface TicketDropDownProps {
    changeAvailabilityPermission: string,
    employeeAvailability: boolean
}
const props = withDefaults(defineProps<TicketDropDownProps>(), {
    changeAvailabilityPermission: undefined,
    employeeAvailability: undefined

})
const changeAvailabilityPermission = props.changeAvailabilityPermission

const { t } = useI18n()
const emits = defineEmits<{
    (e: 'changeAvailability'): void
}>()
</script>

<template>
    <VDropdown icon="feather:more-vertical" class="is-pushed-mobile" spaced right>
        <template #content="{ close }">
            <a v-permission="changeAvailabilityPermission" role="menuitem" href="#" class="dropdown-item is-media"
                @click.prevent="() => {
                    emits('changeAvailability')
                    close()
                }
                    ">
                <div>
                    <span>{{ t('drop_down.change_provider_availability') }}
                        <span :class="!$props.employeeAvailability ? 'has-text-success' : 'has-text-danger'"> {{
                            !$props.employeeAvailability ? t('drop_down.is_available') : t('drop_down.is_not_available')
                        }}</span>
                    </span>
                </div>
            </a>
            <a v-if="!checkPermission(changeAvailabilityPermission)" role="menuitem" class="dropdown-item is-media">
                <div>
                    <span>{{ t('drop_down.no_actions') }}</span>
                </div>
            </a>

        </template>
    </VDropdown>
</template>
