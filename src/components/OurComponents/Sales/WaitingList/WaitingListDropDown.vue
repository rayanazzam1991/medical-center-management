<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { checkPermission } from '/@src/composable/checkPermission';
export interface TicketDropDownProps {
    changeAvailabilityPermission: string,
    alertProviderPermission: string,
    employeeAvailability: boolean,
    showAlert: boolean


}
const props = withDefaults(defineProps<TicketDropDownProps>(), {
    changeAvailabilityPermission: undefined,
    alertProviderPermission: undefined,
    employeeAvailability: undefined,
    showAlert: undefined

})
const changeAvailabilityPermission = props.changeAvailabilityPermission
const alertProviderPermission = props.alertProviderPermission

const { t } = useI18n()
const emits = defineEmits<{
    (e: 'changeAvailability'): void
    (e: 'alertProvider'): void
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
            <a v-if="$props.showAlert" v-permission="alertProviderPermission" role="menuitem" href="#"
                class="dropdown-item is-media" @click.prevent="() => {
                    emits('alertProvider')
                    close()
                }
                    ">
                <div>
                    <span>{{ t('drop_down.alert_provider') }}
                    </span>
                </div>
            </a>
            <a v-if="!checkPermission(changeAvailabilityPermission) && !checkPermission(alertProviderPermission) && !$props.showAlert"
                role="menuitem" class="dropdown-item is-media">
                <div>
                    <span>{{ t('drop_down.no_actions') }}</span>
                </div>
            </a>

        </template>
    </VDropdown>
</template>
