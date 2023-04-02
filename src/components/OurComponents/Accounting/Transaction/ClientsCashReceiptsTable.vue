<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "permissions": [
            "client_cash_receipt_list"
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
import { defaultClientsCashReceiptsSearchFilter, Transaction, ClientsCashReceiptsSearchFilter, defaultTransaction } from '/@src/models/Accounting/Transaction/record';
import { getClientsCashReceiptsList, resetClientsCashReceiptsSearchFilter } from '/@src/services/Accounting/Transaction/transactionService';
import { useTransaction } from '/@src/stores/Accounting/Transaction/transactionStore';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { Permissions } from '/@src/utils/consts/rolesPermissions';
import { defaultPagination } from '/@src/utils/response';
import PrintDropDown from '/@src/components/OurComponents/PrintComponents/PrintDropDown.vue'
import usePrint from '/@src/composable/usePrint';
import sleep from '/@src/utils/sleep';

export interface ClientsCashReceiptsTableProps {
    isForCustomer: boolean,
    customerId: number | undefined
}
const props = withDefaults(defineProps<ClientsCashReceiptsTableProps>(), {
    isForCustomer: false,
    customerId: undefined
})

const { t } = useI18n()
const viewWrapper = useViewWrapper()
const notif = useNotyf() as Notyf
const searchFilter = ref(resetClientsCashReceiptsSearchFilter())
if (props.isForCustomer && props.customerId) {
    searchFilter.value.customer_id = props.customerId
}

const clientsCashReceiptsList = ref<Array<Transaction>>([])
const paginationVar = ref(defaultPagination)
const router = useRouter()
const transactionStore = useTransaction()
const keyIncrement = ref(0)
const default_per_page = ref(1)
const selectedReceiptForPrint = ref(defaultTransaction)

onMounted(async () => {

    const { clients_cash_receipts, pagination } = await getClientsCashReceiptsList(searchFilter.value)
    clientsCashReceiptsList.value = clients_cash_receipts
    paginationVar.value = pagination
    keyIncrement.value = keyIncrement.value + 1
    default_per_page.value = pagination.per_page


});

const { printDiv } = usePrint('');
const print = async () => {
    await sleep(500)
    printDiv('printerable', t('customer_cash_receipt.table.print_title'))
}
const search = async (newSearchFilter: ClientsCashReceiptsSearchFilter) => {
    paginationVar.value.per_page = newSearchFilter.per_page ?? paginationVar.value.per_page
    if (props.isForCustomer && props.customerId) {
        newSearchFilter.customer_id = props.customerId
    }

    const { clients_cash_receipts, pagination } = await getClientsCashReceiptsList(newSearchFilter)
    clientsCashReceiptsList.value = clients_cash_receipts
    paginationVar.value = pagination
    searchFilter.value = newSearchFilter
}

const resetFilter = async (newSearchFilter: ClientsCashReceiptsSearchFilter) => {
    if (props.isForCustomer && props.customerId) {
        newSearchFilter.customer_id = props.customerId
    }

    searchFilter.value = newSearchFilter
    await search(searchFilter.value)
}

const getClientsReceiptsPerPage = async (pageNum: number) => {
    searchFilter.value.page = pageNum
    await search(searchFilter.value)
}

const clientReceiptSort = async (value: string) => {
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
    client_name: {
        align: 'center',
        label: t('customer_cash_receipt.table.columns.client_name'),
        renderRow: (row: Transaction) =>
            h('span', row.entries.find((entry) => entry.account.chart_account?.code == AccountConsts.CLIENTS_CODE)?.account.name),
        grow: true,
    },
    amount: {
        align: 'center',
        label: t('customer_cash_receipt.table.columns.amount'),
        renderRow: (row: Transaction) =>
            h('span', row.amount),
    },
    currency: {
        align: 'center',
        label: t('customer_cash_receipt.table.columns.currency'),
        renderRow: (row: Transaction) =>
            h('span', row.currency.name),
    },
    currency_rate: {
        align: 'center',
        label: t('customer_cash_receipt.table.columns.currency_rate'),
        renderRow: (row: Transaction) =>
            h('span', row.currency_rate),
    },
    cash_account: {
        align: 'center',
        label: t('customer_cash_receipt.table.columns.cash_account'),
        renderRow: (row: Transaction) =>
            h('span', row.entries.find((entry) => entry.account.chart_account?.code == AccountConsts.CASH_CODE)?.account.name),
        grow: true,
    },
    note: {
        align: 'center',
        label: t('customer_cash_receipt.table.columns.note'),
        renderRow: (row: Transaction) =>
            h('span', {
                innerHTML: row.note ?
                    `<div class="tooltip">${stringTrim(row.note, 10)}<div class="tooltiptext"><p class="text-white">${row.note}</p></div></div>` : '-',

            }),
    },
    date: {
        align: 'center',
        label: t('customer_cash_receipt.table.columns.action_date'),
        renderRow: (row: Transaction) =>
            h('span', row.date ?? '-'),
        sortable: true
    },
    created_at: {
        align: 'center',
        label: t('customer_cash_receipt.table.columns.created_at'),
        renderRow: (row: Transaction) =>
            h('span', row.created_at ?? '-'),
        sortable: true
    },
    created_by: {
        align: 'center',
        label: t('customer_cash_receipt.table.columns.created_by'),
        renderRow: (row: Transaction) =>
            h('span', row.created_by ? (row.created_by?.first_name + ' ' + row.created_by?.last_name) : '-'),
    },
    actions: {
        align: 'center',
        label: t('customer_cash_receipt.table.columns.actions'),
        renderRow: (row: Transaction) =>
            h(PrintDropDown, {
                printPermission: Permissions.TRANSACTION_SHOW,
                onPrint: async () => {
                    selectedReceiptForPrint.value = row
                    keyIncrement.value++
                    await print()
                },
            }),
    },

} as const
</script>
    
<template>
    <ClientsCashReceiptsTableHeader :is_for_customer="props.isForCustomer" :key="keyIncrement"
        :title="viewWrapper.pageTitle" @search="search" :pagination="paginationVar" :default_per_page="default_per_page"
        @resetFilter="resetFilter" />
    <VFlexTableWrapper :columns="columns" :data="clientsCashReceiptsList" :limit="searchFilter.per_page"
        @update:sort="clientReceiptSort">
        <VFlexTable separators clickable>
            <template #body>
                <div v-if="transactionStore?.loading" class="flex-list-inner">
                    <div v-for="key in paginationVar.per_page" :key="key" class="flex-table-item">
                        <VFlexTableCell>
                            <VPlaceload />
                        </VFlexTableCell>
                    </div>
                </div>
                <div v-else-if="clientsCashReceiptsList.length === 0" class="flex-list-inner">
                    <VPlaceholderSection :title="t('tables.placeholder.title')" :subtitle="t('tables.placeholder.subtitle')"
                        class="my-6">
                    </VPlaceholderSection>
                </div>
            </template>
        </VFlexTable>
        <VFlexPagination v-if="(clientsCashReceiptsList.length != 0 && paginationVar.max_page != 1)"
            :current-page="paginationVar.page" class="mt-6" :item-per-page="paginationVar.per_page"
            :total-items="paginationVar.total" :max-links-displayed="3" no-router
            @update:current-page="getClientsReceiptsPerPage" />
        <h6 class="pt-2 is-size-7" v-if="clientsCashReceiptsList.length != 0 && !transactionStore?.loading">
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

    <CustomerCashReceiptPrint :key="keyIncrement" :customer-cash-receipt="selectedReceiptForPrint" />
</template>
<style lang="scss">
.tooltip {
    position: relative;
    display: inline-block;
}

.tooltip .tooltiptext {
    visibility: hidden;
    width: 150px;
    background-color: white;
    text-align: center;
    border-radius: 6px;
    padding: 5px;
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
    