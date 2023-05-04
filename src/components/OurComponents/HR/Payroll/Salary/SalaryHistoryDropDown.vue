<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { checkPermission } from '/@src/composable/checkPermission';
export interface SalaryHistoryDropDownProps {
    viewSalaryPermission: string,
}
const props = withDefaults(defineProps<SalaryHistoryDropDownProps>(), {
    viewSalaryPermission: undefined,
})
const viewSalaryPermission = props.viewSalaryPermission


const { t } = useI18n()
const emits = defineEmits<{
    (e: 'view'): void
}>()
</script>

<template>
    <VDropdown icon="feather:more-vertical" class="is-pushed-mobile" spaced right>
        <template #content="{ close }">
            <a v-permission="viewSalaryPermission" role="menuitem" href="#" class="dropdown-item is-media" @click.prevent="
                () => {
                    emits('view')
                    close()
                }
            ">
                <div class="icon">
                    <i class="fas fa-money-check-alt" aria-hidden="true"></i>
                </div>
                <div class="meta">
                    <span>{{ t('salary.drop_down.view_payslip') }}</span>
                </div>
            </a>
            <a v-if="!checkPermission(viewSalaryPermission)" role="menuitem" class="dropdown-item is-media">
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
