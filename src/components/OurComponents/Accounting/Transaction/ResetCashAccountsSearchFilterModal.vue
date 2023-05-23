<script lang="ts">
import { useI18n } from "vue-i18n"
import { defaultResetCashAccountsListSearchFilter } from "/@src/models/Accounting/Transaction/record"
import { Account } from "/@src/models/Accounting/Account/account"

export default defineComponent({
    props: {
        search_filter_popup: {
            default: false,
        },
        is_reseted: {
            type: Boolean,
            default: false,
        },
        cashAccounts: {
            default: [] as Account[]
        }


    },
    emits: ['search_filter_popup', 'search', 'resetFilter'],
    setup(props, context) {
        const { t } = useI18n()
        const searchDateFrom = ref()
        const searchDateTo = ref()
        const searchCashierName = ref()
        const searchTargetCashAccountId = ref()
        const searchFilter = ref(defaultResetCashAccountsListSearchFilter)
        const cashAccounts = props.cashAccounts
        let search_filter_popup = computed({
            get: () => props.search_filter_popup as boolean,
            set(value) {
                value = false
                context.emit('search_filter_popup', value)

            },
        })
        const search = () => {
            searchFilter.value = {
                cashier_name: searchCashierName.value,
                date_from: searchDateFrom.value,
                date_to: searchDateTo.value,
                target_cash_account_id: searchTargetCashAccountId.value,
            }
            context.emit('search', searchFilter.value)
            search_filter_popup.value = false
        }
        const resetFilter = () => {
            searchCashierName.value = undefined
            searchDateFrom.value = undefined
            searchDateTo.value = undefined
            searchTargetCashAccountId.value = undefined
            searchFilter.value.cashier_name = undefined
            searchFilter.value.date_from = undefined
            searchFilter.value.date_to = undefined
            searchFilter.value.target_cash_account_id = undefined
            context.emit('resetFilter', searchFilter.value)
        }
        return { t, search, resetFilter, search_filter_popup, cashAccounts, searchCashierName, searchDateFrom, searchDateTo, searchTargetCashAccountId }
    },
})




</script>

<template>
    <VModal :title="t('reset_cash_accounts.search_filter.title')" :open="search_filter_popup" actions="center"
        @close="search_filter_popup = false">
        <template #content>
            <form class="form-layout" @submit.prevent="">
                <VField class="column filter">
                    <VControl icon="feather:search">
                        <input v-model="searchCashierName" type="text" class="input "
                            :placeholder="t('reset_cash_accounts.search_filter.cashier_name')" />
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl>
                        <VSelect v-model="searchTargetCashAccountId" class="">
                            <VOption value="">{{ t('reset_cash_accounts.search_filter.target_cash_account_id') }}</VOption>
                            <VOption v-for="account in cashAccounts" :key="account.id" :value="account.id">
                                {{ account.code }} - {{ account.name }}
                            </VOption>
                        </VSelect>
                    </VControl>
                </VField>
                <div class="column filter columns-is-multiliine">
                    <h1 class="column-is-12">{{ t('reset_cash_accounts.search_filter.action_date') }}</h1>
                    <VField class="column-is-6 filter">
                        <VLabel>{{ t('reset_cash_accounts.search_filter.from') }} </VLabel>
                        <VControl icon="feather:chevrons-right">
                            <VInput v-model="searchDateFrom" type="date" />
                        </VControl>
                    </VField>
                    <VField class="column-is-6 filter">
                        <VLabel>{{ t('reset_cash_accounts.search_filter.to') }} </VLabel>
                        <VControl icon="feather:chevrons-right">
                            <VInput v-model="searchDateTo" type="date" />
                        </VControl>
                    </VField>
                </div>
                <VButton type="submit" @click="search" class="is-hidden" />
            </form>
        </template>
        <template #action="{ close }">
            <VButton icon="fas fa-filter" color="primary" raised @click="search">{{ t('modal.buttons.filter') }}</VButton>
        </template>
    </VModal>
</template>

