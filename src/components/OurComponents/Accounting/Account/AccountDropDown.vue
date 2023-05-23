<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { checkPermission } from '/@src/composable/checkPermission';
export interface AccountDropDownProps {
    changeCurrencyPermission: string
    changeStatusPermission: string
    cashResetPermission: string
    isCashierCash: boolean
}

const { t } = useI18n()
const emits = defineEmits<{
    (e: 'changeCurrency'): void
    (e: 'changeStatus'): void
    (e: 'resetCash'): void
}>()
const props = withDefaults(defineProps<AccountDropDownProps>(), {
    changeCurrencyPermission: undefined,
    changeStatusPermission: undefined,
    cashResetPermission: undefined,
    isCashierCash: false,
})
const changeCurrencyPermission = props.changeCurrencyPermission
const changeStatusPermission = props.changeStatusPermission
const cashResetPermission = props.cashResetPermission
const isCashierCash = props.isCashierCash
</script>

<template>
    <VDropdown icon="feather:more-vertical" class="is-pushed-mobile" spaced right>
        <template #content="{ close }">
            <a v-permission="changeCurrencyPermission" role="menuitem" href="#" class="dropdown-item is-media"
                @click.prevent="() => {
                    emits('changeCurrency')
                    close()
                }
                    ">
                <div class="icon">
                    <i class="fas fa-dollar-sign" aria-hidden="true"></i>
                </div>
                <div class="meta">
                    <span>{{ t('account.drop_down.change_currency') }}</span>
                </div>
            </a>

            <a v-permission="changeStatusPermission" role="menuitem" href="#" class="dropdown-item is-media" @click.prevent="() => {
                emits('changeStatus')
                close()
            }
                ">
                <div class="icon">
                    <i class="fas fa-edit" aria-hidden="true"></i>
                </div>
                <div class="meta">
                    <span>{{ t('account.drop_down.change_status') }}</span>
                </div>
            </a>
            <a v-if="isCashierCash" v-permission="cashResetPermission" role="menuitem" href="#"
                class="dropdown-item is-media" @click.prevent="() => {
                    emits('resetCash')
                    close()
                }
                    ">
                <div class="icon">
                    <i class="fas fa-cash-register" aria-hidden="true"></i>
                </div>
                <div class="meta">
                    <span>{{ t('account.drop_down.reset_cash') }}</span>
                </div>
            </a>
            <a v-if="!checkPermission(changeCurrencyPermission) && !checkPermission(changeStatusPermission) && !checkPermission(cashResetPermission) && !isCashierCash"
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
