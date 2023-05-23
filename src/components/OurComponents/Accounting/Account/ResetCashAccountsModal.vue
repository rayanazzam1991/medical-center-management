<script lang="ts">
import { useI18n } from "vue-i18n"
import { CurrencyConsts } from "/@src/models/Accounting/Currency/currency"
import { AccountConsts, Account } from "/@src/models/Accounting/Account/account"
import { ChartOfAccountConsts } from "/@src/models/Accounting/ChartOfAccount/chartOfAccount"
import { addParenthesisToString } from "/@src/composable/helpers/stringHelpers"
import { Employee, defaultEmployee } from "/@src/models/Employee/employee"
import { resetResetCashAccountsData } from "/@src/services/Accounting/Account/accountService"
import { resetCashAccounts, getCashierAccountsByCashierId } from "/@src/services/Accounting/Account/accountService"
import { useNotyf } from "/@src/composable/useNotyf"
import { Notyf } from "notyf"

export default defineComponent({
    props: {
        cashAccounts: {
            default: [] as Account[],
        },
        openModal: {
            default: false,
        },
        iqdCashAccounts: {
            default: [] as Account[],
        },
        usdCashAccounts: {
            default: [] as Account[],
        },
        inDashboard: {
            default: false,
        },
        cashiersList: {
            default: [] as Employee[]
        }


    },
    emits: ['openModal', 'reseted'],

    setup(props, context) {
        const notif = useNotyf() as Notyf
        const IQDcashAccountsListFiltered = ref<Account[]>([])
        const USDcashAccountsListFiltered = ref<Account[]>([])
        const IQDcashAccountsList = ref<Account[]>([])
        const USDcashAccountsList = ref<Account[]>([])
        const accountContact = ref<Employee>(defaultEmployee)
        const resetCashAccountsData = ref(resetResetCashAccountsData())
        const usdAccountBalance = ref('')
        const iqdAccountBalance = ref('')
        const loading = ref({ fetch: false, submit: false })
        const cashAccounts = ref<Account[]>([])
        IQDcashAccountsList.value = props.iqdCashAccounts
        USDcashAccountsList.value = props.usdCashAccounts
        const cashiersList = props.cashiersList
        if (!props.inDashboard) {
            cashAccounts.value = props.cashAccounts
            accountContact.value = cashAccounts.value[0]?.contact as Employee
            resetCashAccountsData.value.iqd_source_account_id = cashAccounts.value.find((account) => account.chart_account?.code == ChartOfAccountConsts.CASH_CODE && account.currency?.code == CurrencyConsts.IQD_CODE)?.id
            resetCashAccountsData.value.usd_source_account_id = cashAccounts.value.find((account) => account.chart_account?.code == ChartOfAccountConsts.CASH_CODE && account.currency?.code == CurrencyConsts.USD_CODE)?.id
            usdAccountBalance.value = cashAccounts.value.find((account) => account.chart_account?.code == ChartOfAccountConsts.CASH_CODE && account.currency?.code == CurrencyConsts.USD_CODE)?.balance ?? ''
            iqdAccountBalance.value = cashAccounts.value.find((account) => account.chart_account?.code == ChartOfAccountConsts.CASH_CODE && account.currency?.code == CurrencyConsts.IQD_CODE)?.balance ?? ''
            IQDcashAccountsListFiltered.value = IQDcashAccountsList.value.filter(account => {
                return account.id !== resetCashAccountsData.value.iqd_source_account_id
            })
            USDcashAccountsListFiltered.value = USDcashAccountsList.value.filter(account => {
                return account.id !== resetCashAccountsData.value.usd_source_account_id
            })

        }
        const { t } = useI18n()
        let openModal = computed({
            get: () => props.openModal as boolean,
            set(value) {
                value = false
                context.emit('openModal', value)

            },
        })
        const resetAccounts = async () => {
            if (!resetCashAccountsData.value.iqd_target_account_id && !resetCashAccountsData.value.usd_target_account_id) {
                notif.error({ message: t('toast.error.please_select_target_cash_account'), duration: 3000 })
                return
            }
            if (resetCashAccountsData.value.date) {
                const date = new Date(resetCashAccountsData.value.date);
                if (!(!isNaN(date.getTime()) && new Date(resetCashAccountsData.value.date).toISOString().slice(0, 10) === resetCashAccountsData.value.date)) {
                    notif.error({ message: t('validation.date.format'), duration: 3000 })
                    return
                }
            } else {
                notif.error({ message: t('toast.error.date_is_required'), duration: 3000 })
                return
            }
            loading.value.submit = true
            const { message, success } = await resetCashAccounts(resetCashAccountsData.value)
            if (success) {
                notif.success(t('toast.success.reset'))
                context.emit('reseted')

            } else {
                notif.error({ message: message, duration: 3000 })
            }
            loading.value.submit = false




        }
        watch(accountContact, async (value) => {
            if (props.inDashboard && value && value.id != 0 && value.id) {
                loading.value.fetch = true
                const { cashier_accounts, message, success } = await getCashierAccountsByCashierId(value.id)
                if (success) {
                    cashAccounts.value = cashier_accounts
                    resetCashAccountsData.value.iqd_source_account_id = cashAccounts.value.find((account) => account.chart_account?.code == ChartOfAccountConsts.CASH_CODE && account.currency?.code == CurrencyConsts.IQD_CODE)?.id
                    resetCashAccountsData.value.usd_source_account_id = cashAccounts.value.find((account) => account.chart_account?.code == ChartOfAccountConsts.CASH_CODE && account.currency?.code == CurrencyConsts.USD_CODE)?.id
                    usdAccountBalance.value = cashAccounts.value.find((account) => account.chart_account?.code == ChartOfAccountConsts.CASH_CODE && account.currency?.code == CurrencyConsts.USD_CODE)?.balance ?? ''
                    iqdAccountBalance.value = cashAccounts.value.find((account) => account.chart_account?.code == ChartOfAccountConsts.CASH_CODE && account.currency?.code == CurrencyConsts.IQD_CODE)?.balance ?? ''
                    IQDcashAccountsListFiltered.value = IQDcashAccountsList.value.filter(account => {
                        return account.id !== resetCashAccountsData.value.iqd_source_account_id
                    })
                    USDcashAccountsListFiltered.value = USDcashAccountsList.value.filter(account => {
                        return account.id !== resetCashAccountsData.value.usd_source_account_id
                    })
                } else {
                    notif.error(message)
                }
                loading.value.fetch = false
            }
        })

        return {
            t, cashAccounts, openModal, AccountConsts, CurrencyConsts, accountContact, usdAccountBalance, iqdAccountBalance, resetCashAccountsData, USDcashAccountsListFiltered, IQDcashAccountsListFiltered,
            resetAccounts, addParenthesisToString, cashiersList, loading, defaultEmployee
        }
    },
})




</script>

<template>
    <VModal :title="t('account.reset_cash_account_modal.title')" :open="openModal" actions="right" size="big"
        @close="openModal = false" :cancel-label="t('transaction.table.entries.cancel_label')">
        <template #content>
            <div class="columns is-multiline p-2">
                <div v-if="!$props.inDashboard" class="column is-12">
                    <p> {{ t('account.reset_cash_account_modal.cashier_name') }} :
                        <span class="has-text-primary">
                            {{ accountContact?.user.first_name }}
                            {{ accountContact?.user.last_name }}
                        </span>
                    </p>
                </div>
                <div v-else class="column is-12">
                    <VField>
                        <VLabel class="required">{{ t('account.reset_cash_account_modal.cashier_name') }}
                        </VLabel>
                        <VControl>
                            <VSelect v-model="accountContact">
                                <VOption :value="defaultEmployee"> {{ t('account.reset_cash_account_modal.select_cashier')
                                }}</VOption>
                                <VOption v-for="cashier in cashiersList" :value="cashier">
                                    {{ cashier.user.first_name }} {{ cashier.user.last_name }}
                                </VOption>
                            </VSelect>
                        </VControl>
                    </VField>
                </div>
                <div class="column is-12">
                    <VLoader :hidden="!loading.fetch" size="xl" :active="loading.fetch">
                        <div class="load">
                        </div>
                    </VLoader>
                </div>

                <div v-if="accountContact && accountContact?.id != 0 && !loading.fetch">
                    <div class="column is-12 columns p-0 m-0 py-2">
                        <div class="column is-6 columns is-multiline m-0 p-0 my-2 split-border">
                            <div class="column is-12">
                                <p> {{ t('account.reset_cash_account_modal.balance') }} :
                                    <span class="has-text-primary">
                                        {{ iqdAccountBalance }}
                                    </span>
                                    {{ addParenthesisToString(t('account.reset_cash_account_modal.iqd')) }}

                                </p>
                            </div>
                            <div class="column is-12">
                                <VField>
                                    <VLabel>{{ t('account.reset_cash_account_modal.iqd_cash_account') }}
                                    </VLabel>
                                    <VControl>
                                        <VSelect v-model="resetCashAccountsData.iqd_target_account_id">
                                            <VOption value=""> {{ t('account.reset_cash_account_modal.select_account')
                                            }}</VOption>
                                            <VOption v-for="account in IQDcashAccountsListFiltered" :value="account.id">
                                                {{ account.code }} - {{ account.name }}
                                            </VOption>
                                        </VSelect>
                                    </VControl>
                                </VField>
                            </div>
                        </div>
                        <div class="column is-6 columns is-multiline m-0 p-0 my-2">
                            <div class="column is-12">
                                <p> {{ t('account.reset_cash_account_modal.balance') }} :
                                    <span class="has-text-primary">
                                        {{ usdAccountBalance }}
                                    </span>
                                    {{ addParenthesisToString(t('account.reset_cash_account_modal.usd')) }}

                                </p>
                            </div>
                            <div class="column is-12">
                                <VField>
                                    <VLabel>{{ t('account.reset_cash_account_modal.usd_cash_account') }}
                                    </VLabel>
                                    <VControl>
                                        <VSelect v-model="resetCashAccountsData.usd_target_account_id">
                                            <VOption value=""> {{ t('account.reset_cash_account_modal.select_account')
                                            }}</VOption>
                                            <VOption v-for="account in USDcashAccountsListFiltered" :value="account.id">
                                                {{ account.code }} - {{ account.name }}
                                            </VOption>
                                        </VSelect>
                                    </VControl>
                                </VField>
                            </div>
                        </div>
                    </div>
                    <div class="column is-12">
                        <VField>
                            <VLabel class="required">{{ t('account.reset_cash_account_modal.date') }}
                            </VLabel>
                            <VControl>
                                <VInput v-model="resetCashAccountsData.date" type="date" />
                            </VControl>
                        </VField>
                    </div>
                    <div class="column is-12">
                        <VField>
                            <VLabel>{{ t('account.reset_cash_account_modal.note') }}
                            </VLabel>
                            <VControl>
                                <VTextarea v-model="resetCashAccountsData.note" rows="2" class="is-primary-focus"
                                    :placeholder="t('account.reset_cash_account_modal.note')">
                                </VTextarea>
                            </VControl>
                        </VField>
                    </div>
                </div>
            </div>
        </template>
        <template #action="{ close }">
            <VButton :disabled="!(accountContact && accountContact?.id != 0 && !loading.fetch)" color="primary" raised
                :loading="loading.submit" @click="resetAccounts">{{ t('modal.buttons.confirm') }}</VButton>
        </template>

    </VModal>
</template>
<style  scoped lang="scss">
.load {
    height: 400px;
    width: 500px;
}

.split-border {
    border-left: 1px solid var(--fade-grey-dark-3);
}

.split-border-bottom {
    border-bottom: 1px solid var(--fade-grey-dark-3);

}

.is-dark {
    .split-border {
        border-color: var(--dark-sidebar-light-12) !important;

    }

    .split-border-bottom {
        border-color: var(--dark-sidebar-light-12) !important;

    }
}
</style>


