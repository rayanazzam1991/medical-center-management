<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "permissions": [
            "transaction_list"
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
import { AccountConsts } from '/@src/models/Accounting/Account/account';
import { JournalEntry } from '/@src/models/Accounting/JournalEntry/journalEntry';
import { defaultTransaction, defaultTransactionSearchFilter, Transaction, TransactionSearchFilter } from '/@src/models/Accounting/Transaction/record';
import { getTransactionsList } from '/@src/services/Accounting/Transaction/transactionService';
import { useTransaction } from '/@src/stores/Accounting/Transaction/transactionStore';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { defaultPagination } from '/@src/utils/response';


const { t } = useI18n()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle(t('transaction.table.title'))
useHead({
    title: t('transaction.table.title'),
})
const notif = useNotyf() as Notyf
const searchFilter = ref(defaultTransactionSearchFilter)
const transactionsList = ref<Array<Transaction>>([])
const paginationVar = ref(defaultPagination)
const router = useRouter()
const transactionStore = useTransaction()
const keyIncrement = ref(0)
const default_per_page = ref(1)
const entriesPopup = ref(false)
const selectedTransaction = ref<Transaction>(defaultTransaction)

onMounted(async () => {

    const { transactions, pagination } = await getTransactionsList(searchFilter.value)
    transactionsList.value = transactions
    paginationVar.value = pagination
    keyIncrement.value = keyIncrement.value + 1
    default_per_page.value = pagination.per_page


});


const search = async (newSearchFilter: TransactionSearchFilter) => {
    paginationVar.value.per_page = newSearchFilter.per_page ?? paginationVar.value.per_page
    const { transactions, pagination } = await getTransactionsList(newSearchFilter)

    transactionsList.value = transactions
    paginationVar.value = pagination
    searchFilter.value = newSearchFilter
}

const resetFilter = async (newSearchFilter: TransactionSearchFilter) => {
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

const onRowClicked = (row: Transaction) => {
    selectedTransaction.value = row
    entriesPopup.value = true
}

const columns = {
    title: {
        align: 'center',
        label: t('transaction.table.columns.title'),
        grow: true,

    },
    amount: {
        align: 'center',
        label: t('transaction.table.columns.amount'),
        renderRow: (row: Transaction) =>
            h('span', row.amount),
    },
    currency: {
        align: 'center',
        label: t('transaction.table.columns.currency'),
        renderRow: (row: Transaction) =>
            h('span', row.currency.name),
    },
    currency_rate: {
        align: 'center',
        label: t('transaction.table.columns.currency_rate'),
        renderRow: (row: Transaction) =>
            h('span', row.currency_rate),
    },
    note: {
        align: 'center',
        label: t('transaction.table.columns.note'),
        renderRow: (row: Transaction) =>
            h('span', {
                innerHTML: row.note ?
                    `<div class="tooltip">${stringTrim(row.note, 10)}<div class="tooltiptext"><p class="text-white">${row.note}</p></div></div>` : '-',

            }),
    },
    date: {
        align: 'center',
        label: t('transaction.table.columns.action_date'),
        renderRow: (row: Transaction) =>
            h('span', row.date ?? '-'),
        sortable: true
    },
    created_at: {
        align: 'center',
        label: t('transaction.table.columns.created_at'),
        renderRow: (row: Transaction) =>
            h('span', row.created_at ?? '-'),
        sortable: true
    },
    created_by: {
        align: 'center',
        label: t('transaction.table.columns.created_by'),
        renderRow: (row: Transaction) =>
            h('span', row.created_by ? (row.created_by?.first_name + ' ' + row.created_by?.last_name) : '-'),
    },
} as const
const entriesColumns = {
    account: {
        align: 'center',
        label: t('transaction.table.entries.columns.account'),
        grow: true,
        renderRow: (row: JournalEntry) =>
            h('span', row.account.code + ' ' + row.account.name),
    },
    credit: {
        align: 'center',
        label: t('transaction.table.entries.columns.credit'),
        renderRow: (row: JournalEntry) =>
            h('span', row.account_type == AccountConsts.CREDIT_TYPE ? row.amount : '0.00'),
    },
    debit: {
        align: 'center',
        label: t('transaction.table.entries.columns.debit'),
        renderRow: (row: JournalEntry) =>
            h('span', row.account_type == AccountConsts.DEBIT_TYPE ? row.amount : '0.00'),
    },
} as const
</script>

<template>
    <TransactionTableHeader :key="keyIncrement" :title="viewWrapper.pageTitle" @search="search" :pagination="paginationVar"
        :default_per_page="default_per_page" @resetFilter="resetFilter" />
    <VFlexTableWrapper :columns="columns" :data="transactionsList" :limit="searchFilter.per_page"
        @update:sort="transactionSort">

        <VFlexTable separators clickable @row-click="onRowClicked">
            <template #body>
                <div v-if="transactionStore?.loading" class="flex-list-inner">
                    <div v-for="key in paginationVar.per_page" :key="key" class="flex-table-item">
                        <VFlexTableCell>
                            <VPlaceload />
                        </VFlexTableCell>

                    </div>
                </div>
                <div v-else-if="transactionsList.length === 0" class="flex-list-inner">
                    <VPlaceholderSection :title="t('tables.placeholder.title')" :subtitle="t('tables.placeholder.subtitle')"
                        class="my-6">
                    </VPlaceholderSection>
                </div>

            </template>
        </VFlexTable>
        <VFlexPagination v-if="(transactionsList.length != 0 && paginationVar.max_page != 1)"
            :current-page="paginationVar.page" class="mt-6" :item-per-page="paginationVar.per_page"
            :total-items="paginationVar.total" :max-links-displayed="3" no-router
            @update:current-page="getTransactionsPerPage" />
        <h6 class="pt-2 is-size-7" v-if="transactionsList.length != 0 && !transactionStore?.loading">
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
    <VModal :key="keyIncrement" :title="selectedTransaction.title ?? t('transaction.table.entries.place_holder_title')"
        :open="entriesPopup" actions="right" @close="entriesPopup = false"
        :cancel-label="t('transaction.table.entries.cancel_label')">
        <template #content>
            <VFlexTableWrapper :columns="entriesColumns" :data="selectedTransaction.entries">
                <VFlexTable separators clickable>
                    <template #body>
                        <div v-if="transactionStore?.loading" class="flex-list-inner">
                            <div class="flex-table-item">
                                <VFlexTableCell>
                                    <VPlaceload />
                                </VFlexTableCell>
                            </div>
                        </div>
                        <div v-else-if="transactionsList.length === 0" class="flex-list-inner">
                            <VPlaceholderSection :title="t('tables.placeholder.title')"
                                :subtitle="t('tables.placeholder.subtitle')" class="my-6">
                            </VPlaceholderSection>
                        </div>
                    </template>
                </VFlexTable>
            </VFlexTableWrapper>
        </template>
        <template>
            <VButton color="primary" raised @click="">sadsad</VButton>
        </template>
    </VModal>
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
