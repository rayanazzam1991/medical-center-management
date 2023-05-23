<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "permissions": [
            "cash_account_reset_list"
        ]
    }
}
</route>
        
<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { Notyf } from 'notyf';
import { useI18n } from 'vue-i18n';
import { stringTrim } from '/@src/composable/helpers/stringHelpers';
import { useNotyf } from '/@src/composable/useNotyf';
import { Account, AccountConsts, AccountSearchFilter } from '/@src/models/Accounting/Account/account';
import { defaultResetCashAccountsListSearchFilter, ResetCashAccountsListSearchFilter, Transaction } from '/@src/models/Accounting/Transaction/record';
import { getResetCashAccountsList } from '/@src/services/Accounting/Transaction/transactionService';
import { useTransaction } from '/@src/stores/Accounting/Transaction/transactionStore';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { defaultPagination } from '/@src/utils/response';
import { defaultEmployee, Employee } from '/@src/models/Employee/employee';
import { CurrencyConsts } from '/@src/models/Accounting/Currency/currency';
import { getAccountsList } from '/@src/services/Accounting/Account/accountService';
import { ChartOfAccountConsts } from '/@src/models/Accounting/ChartOfAccount/chartOfAccount';


const { t } = useI18n()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle(t('reset_cash_accounts.table.title'))
useHead({
    title: t('reset_cash_accounts.table.title'),
})
const notif = useNotyf() as Notyf
const searchFilter = ref(defaultResetCashAccountsListSearchFilter)
const resetCashAccountsList = ref<Array<Transaction>>([])
const paginationVar = ref(defaultPagination)
const router = useRouter()
const transactionStore = useTransaction()
const keyIncrement = ref(0)
const default_per_page = ref(1)
const cashAccountsList = ref<Account[]>([])
onMounted(async () => {
    const { reset_cash_account_transactions, pagination } = await getResetCashAccountsList(searchFilter.value)
    resetCashAccountsList.value = reset_cash_account_transactions
    paginationVar.value = pagination
    default_per_page.value = pagination.per_page


    let accountSearchFilter = {} as AccountSearchFilter
    accountSearchFilter.status = AccountConsts.ACTIVE
    accountSearchFilter.per_page = 5000
    const { accounts } = await getAccountsList(accountSearchFilter)
    accounts.forEach((account) => {
        if (account.chart_account?.code == ChartOfAccountConsts.CASH_CODE) {
            cashAccountsList.value.push(account)
        }
    });
    keyIncrement.value = keyIncrement.value + 1


});


const search = async (newSearchFilter: ResetCashAccountsListSearchFilter) => {
    paginationVar.value.per_page = newSearchFilter.per_page ?? paginationVar.value.per_page
    const { reset_cash_account_transactions, pagination } = await getResetCashAccountsList(newSearchFilter)

    resetCashAccountsList.value = reset_cash_account_transactions
    paginationVar.value = pagination
    searchFilter.value = newSearchFilter
}

const resetFilter = async (newSearchFilter: ResetCashAccountsListSearchFilter) => {
    searchFilter.value = newSearchFilter
    await search(searchFilter.value)
}

const getTransactionsPerPage = async (pageNum: number) => {
    searchFilter.value.page = pageNum
    await search(searchFilter.value)
}
const transactionSort = async (value: string) => {
    if (value != undefined) {
        const [sortField, sortOrder] = value.split(':') as [string, 'desc' | 'asc']

        searchFilter.value.order_by = sortField
        searchFilter.value.order = sortOrder
    }
    else {
        searchFilter.value.order = undefined
        searchFilter.value.order_by = undefined
    }
    await search(searchFilter.value)

}


const columns = {
    cashier: {
        align: 'center',
        label: t('reset_cash_accounts.table.columns.cashier'),
        renderRow: (row: Transaction) => {
            let cashierName = '-'
            const accountContact = row.entries.find((entry) => entry.account_type == AccountConsts.CREDIT_TYPE)?.account.contact as Employee ?? defaultEmployee
            cashierName = accountContact.user.first_name + ' ' + accountContact.user.last_name
            return h('span', cashierName)
        },
    },
    amount: {
        align: 'center',
        label: t('reset_cash_accounts.table.columns.amount'),
        renderRow: (row: Transaction) => {
            let amount = '0.00'
            if (row.entries.find((entry) => entry.account_type == AccountConsts.CREDIT_TYPE)?.account.currency?.code == CurrencyConsts.USD_CODE) {
                amount = (Number(row.amount.replace(/,/g, '')) / row.currency_rate).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })
            } else {
                amount = row.amount
            }
            return h('span', amount)
        }
    },
    currency: {
        align: 'center',
        label: t('reset_cash_accounts.table.columns.currency'),
        renderRow: (row: Transaction) => {
            let currencyName = ''
            if (row.entries.find((entry) => entry.account_type == AccountConsts.CREDIT_TYPE)?.account.currency?.code == CurrencyConsts.USD_CODE) {
                currencyName = t('reset_cash_accounts.table.columns.usd')
            } else {
                currencyName = t('reset_cash_accounts.table.columns.iqd')
            }
            return h('span', currencyName)
        }
    },
    note: {
        align: 'center',
        label: t('reset_cash_accounts.table.columns.note'),
        renderRow: (row: Transaction) =>
            h('span', {
                innerHTML: row.note ?
                    `<div class="tooltip">${stringTrim(row.note, 20)}<div class="tooltiptext"><p class="text-white">${row.note}</p></div></div>` : '-',

            }),
    },
    date: {
        align: 'center',
        label: t('reset_cash_accounts.table.columns.action_date'),
        renderRow: (row: Transaction) =>
            h('span', row.date ?? '-'),
        sortable: true
    },
    target_account: {
        align: 'center',
        label: t('reset_cash_accounts.table.columns.target_account'),
        renderRow: (row: Transaction) =>
            h('span', row.entries.find((entry) => entry.account_type == AccountConsts.DEBIT_TYPE)?.account.name ?? '-'),
    },
} as const
</script>
    
<template>
    <ResetCashAccountsTableHeader :key="keyIncrement" :title="viewWrapper.pageTitle" @search="search"
        :cash-accounts="cashAccountsList" :pagination="paginationVar" :default_per_page="default_per_page"
        @resetFilter="resetFilter" />
    <VFlexTableWrapper :columns="columns" :data="resetCashAccountsList" :limit="searchFilter.per_page"
        @update:sort="transactionSort">
        <VFlexTable separators clickable>
            <template #body>
                <div v-if="transactionStore?.loading" class="flex-list-inner">
                    <div v-for="key in paginationVar.per_page" :key="key" class="flex-table-item">
                        <VFlexTableCell>
                            <VPlaceload />
                        </VFlexTableCell>

                    </div>
                </div>
                <div v-else-if="resetCashAccountsList.length === 0" class="flex-list-inner">
                    <VPlaceholderSection :title="t('tables.placeholder.title')" :subtitle="t('tables.placeholder.subtitle')"
                        class="my-6">
                    </VPlaceholderSection>
                </div>

            </template>
        </VFlexTable>
        <VFlexPagination v-if="(resetCashAccountsList.length != 0 && paginationVar.max_page != 1)"
            :current-page="paginationVar.page" class="mt-6" :item-per-page="paginationVar.per_page"
            :total-items="paginationVar.total" :max-links-displayed="3" no-router
            @update:current-page="getTransactionsPerPage" />
        <h6 class="pt-2 is-size-7" v-if="resetCashAccountsList.length != 0 && !transactionStore?.loading">
            {{
                t('tables.pagination_footer', {
                    from_number: paginationVar.page !=
                        paginationVar.max_page
                        ?
                        (1 + ((paginationVar.page - 1) * paginationVar.count)) : paginationVar.page == paginationVar.max_page ? (1 +
                            ((paginationVar.page - 1) * paginationVar.per_page)) : paginationVar.page == 1 ? 1 : paginationVar.total
                    , to_number: paginationVar.page !=
                        paginationVar.max_page ?
                        paginationVar.page *
                        paginationVar.per_page : paginationVar.total, all_number: paginationVar.total
                }) }}</h6>

        <VPlaceloadText v-if="transactionStore?.loading" :lines="1" last-line-width="20%" class="mx-2" />


    </VFlexTableWrapper>
</template>
<style lang="scss">
.tooltip {
    position: relative;
    display: inline-block;
}

.tooltip .tooltiptext {
    visibility: hidden;
    min-width: 150px;
    background-color: white;
    text-align: center;
    border-radius: 6px;
    padding: 10px;
    word-break: keep-all;
    white-space: normal;


    /* Position the tooltip */
    position: absolute;
    z-index: 1;
}

.tooltip:hover .tooltiptext {
    visibility: visible;


}

.is-dark {
    .tooltip .tooltiptext {
        background-color: rgb(43, 41, 41);
    }
}
</style>
    