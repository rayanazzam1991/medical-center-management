<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "permissions": [
            "journal_entry_list"
        ]
    }
}
</route>
            
<script setup lang="ts">
import { Notyf } from 'notyf';
import { useI18n } from 'vue-i18n';
import VTag from '/@src/components/base/tags/VTag.vue';
import { useNotyf } from '/@src/composable/useNotyf';
import { defaultJournalEntriesByAccount, JournalEntrySearchFilter, JournalEntriesByAccount, JournalEntryByAccount } from '/@src/models/Accounting/JournalEntry/journalEntry';
import { getJournalEntriesByContact, resetJournalEntrySearchFilter } from '/@src/services/Accounting/JournalEntry/journalEntryService';
import { useJournalEntry } from '/@src/stores/Accounting/JournalEntry/journalEntryStore';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { defaultPagination } from '/@src/utils/response';
export interface JournalEntryTableProps {
    isForCustomer: boolean,
    customerId: number | undefined
    isForEmployee: boolean,
    employeeId: number | undefined
}
const props = withDefaults(defineProps<JournalEntryTableProps>(), {
    isForCustomer: false,
    customerId: undefined,
    isForEmployee: false,
    employeeId: undefined

})
const emits = defineEmits<{
    (e: 'updateBalance', balance: string, currency: string): void
}>()



const viewWrapper = useViewWrapper()
const { t } = useI18n()
const notif = useNotyf() as Notyf
const journalEntryStore = useJournalEntry()
const searchFilter = ref(resetJournalEntrySearchFilter())
if (props.isForCustomer && props.customerId) {
    searchFilter.value.model_type = 'Customer'
} else if (props.isForEmployee && props.employeeId) {
    searchFilter.value.model_type = 'Employee'
}


const journalEntriesByAccount = ref<JournalEntriesByAccount>(defaultJournalEntriesByAccount)
const paginationVar = ref(defaultPagination)
const keyIncrement = ref(0)
const router = useRouter()
const default_per_page = ref(1)

onMounted(async () => {
    const { journal_entries, pagination } = await getJournalEntriesByContact(props.isForCustomer ? props.customerId : props.isForEmployee ? props.employeeId : undefined, searchFilter.value)
    journalEntriesByAccount.value = journal_entries
    paginationVar.value = pagination
    keyIncrement.value = keyIncrement.value + 1
    default_per_page.value = pagination.per_page
    emits('updateBalance', journalEntriesByAccount.value.account.balance, journalEntriesByAccount.value.account.currency?.name ?? '')


});

const search = async (newSearchFilter: JournalEntrySearchFilter) => {
    paginationVar.value.per_page = newSearchFilter.per_page ?? paginationVar.value.per_page
    if (props.isForCustomer && props.customerId) {
        newSearchFilter.model_type = "Customer"
    } else if (props.isForEmployee && props.employeeId) {
        newSearchFilter.model_type = 'Employee'
    }


    const { journal_entries, pagination } = await getJournalEntriesByContact(props.isForCustomer ? props.customerId : props.isForEmployee ? props.employeeId : undefined, searchFilter.value)
    journalEntriesByAccount.value = journal_entries
    paginationVar.value = pagination
    searchFilter.value = newSearchFilter
}

const resetFilter = async (newSearchFilter: JournalEntrySearchFilter) => {
    if (props.isForCustomer && props.customerId) {
        newSearchFilter.model_type = "Customer"
    } else if (props.isForEmployee && props.employeeId) {
        newSearchFilter.model_type = 'Employee'
    }


    searchFilter.value = newSearchFilter
    await search(searchFilter.value)
}

const getJournalEntriesPerPage = async (pageNum: number) => {

    searchFilter.value.page = pageNum
    search(searchFilter.value)
}
const journalEntrySort = async (value: string) => {
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
    "type": {
        align: 'center',
        label: t("journal_entry.table.columns.type"),
        renderRow: (row: JournalEntryByAccount) =>
            h('span', row?.type),
    },
    "in_out": {
        align: 'center',
        label: t("journal_entry.table.columns.in_out"),
        renderRow: (row: JournalEntryByAccount) => {
            return h(
                VTag,
                {
                    rounded: true,
                    color: row.account_type == journalEntriesByAccount.value?.account.chart_account?.account_type ? 'success' : 'danger',
                    label: row.account_type == journalEntriesByAccount.value?.account.chart_account?.account_type ? t('journal_entry.table.columns.in') : t('journal_entry.table.columns.out')
                },
            );
        }
    },
    "amount": {
        align: 'center',
        label: t("journal_entry.table.columns.amount"),
        renderRow: (row: JournalEntryByAccount) =>
            h('span', { class: row.account_type == journalEntriesByAccount.value?.account.chart_account?.account_type ? 'has-text-success' : 'has-text-danger' }, row?.amount),
    },
    "date": {
        align: 'center',
        label: t("journal_entry.table.columns.date"),
        renderRow: (row: JournalEntryByAccount) =>
            h('span', row?.created_at),
    },



} as const

</script>
        
<template>
    <JournalEntryTableHeader :is_for_customer="props.isForCustomer" :is_for_employee="props.isForEmployee"
        :key="keyIncrement" :title="viewWrapper.pageTitle" @search="search" :pagination="paginationVar"
        :default_per_page="default_per_page" @resetFilter="resetFilter" />


    <VFlexTableWrapper :columns="columns" :data="journalEntriesByAccount?.movements" @update:sort="journalEntrySort">

        <VFlexTable separators clickable>
            <template #body>
                <div v-if="journalEntryStore?.loading" class="flex-list-inner">
                    <div v-for="key in paginationVar.per_page" :key="key" class="flex-table-item">
                        <VFlexTableCell>
                            <VPlaceload />
                        </VFlexTableCell>
                    </div>
                </div>
                <div v-else-if="journalEntriesByAccount?.movements.length === 0" class="flex-list-inner">
                    <VPlaceholderSection :title="t('tables.placeholder.title')" :subtitle="t('tables.placeholder.subtitle')"
                        class="my-6">
                    </VPlaceholderSection>
                </div>
            </template>
        </VFlexTable>
        <VFlexPagination v-if="(journalEntriesByAccount?.movements.length != 0 && paginationVar.max_page != 1)"
            :current-page="paginationVar.page" class="mt-6" :item-per-page="paginationVar.per_page"
            :total-items="paginationVar.total" :max-links-displayed="3" no-router
            @update:current-page="getJournalEntriesPerPage" />
        <h6 class="pt-2 is-size-7" v-if="journalEntriesByAccount?.movements.length != 0 && !journalEntryStore?.loading">
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
        <VPlaceloadText v-if="journalEntryStore?.loading" :lines="1" last-line-width="20%" class="mx-2" />
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
        