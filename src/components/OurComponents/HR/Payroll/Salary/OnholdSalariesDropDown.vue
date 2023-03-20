<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { checkPermission } from '/@src/composable/checkPermission';
export interface OnholdSalariesDropDownProps {
    paySalaryPermission: string,
    returnSalaryPermission: string
}

const props = withDefaults(defineProps<OnholdSalariesDropDownProps>(), {
    paySalaryPermission: undefined,
    returnSalaryPermission: undefined
})
const paySalaryPermission = props.paySalaryPermission
const returnSalaryPermission = props.returnSalaryPermission

const { t } = useI18n()
const emits = defineEmits<{
    (e: 'clickPay'): void
    (e: 'clickReturn'): void
}>()
</script>

<template>
    <VDropdown icon="feather:more-vertical" class="is-pushed-mobile" spaced right>
        <template #content="{ close }">
            <a v-permission="paySalaryPermission" role="menuitem" href="#" class="dropdown-item is-media" @click.prevent="
                () => {
                    emits('clickPay')
                    close()
                }
            ">
                <div class="icon">
                    <i class="fas fa-money-check-alt" aria-hidden="true"></i>
                </div>
                <div class="meta">
                    <span>{{ t('onhold_salaries.drop_down.pay') }}</span>
                </div>
            </a>
            <a v-permission="returnSalaryPermission" role="menuitem" href="#" class="dropdown-item is-media" @click.prevent="
                () => {
                    emits('clickReturn')
                    close()
                }
            ">
                <div class="icon">
                    <i class="fas fa-retweet" aria-hidden="true"></i>
                </div>
                <div class="meta">
                    <span>{{ t('onhold_salaries.drop_down.return') }}</span>
                </div>
            </a>
            <a v-if="!checkPermission(returnSalaryPermission) && !checkPermission(paySalaryPermission)" role="menuitem"
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
