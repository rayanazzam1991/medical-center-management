<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "permissions": [
            "ticket_list"
        ]
    }
}
</route>
        
<script setup lang="ts">
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { defaultPagination } from '/@src/utils/response'
import { useI18n } from 'vue-i18n'
import { useNotyf } from '/@src/composable/useNotyf'
import { Notyf } from 'notyf'
import { resetServiceCardsListSearchFilter } from '/@src/services/Sales/WaitingList/waitingListService'
import { ServiceCard, ServiceCardsListSearchFilter, defaultServiceCard, defaultWaitingListByTicket } from '/@src/models/Sales/WaitingList/waitingList'
import usePrint from '/@src/composable/usePrint'
import { useWaitingList } from '/@src/stores/Sales/WaitingList/waitingListStore'
import { getServiceCardsList } from '/@src/services/Sales/WaitingList/waitingListService'
import IconButton from '../../Warehouse/InventoryItemHistory/IconButton.vue'
import sleep from '/@src/utils/sleep'
import usePrint8CM from '/@src/composable/usePrint8CM'
const viewWrapper = useViewWrapper()
const { t } = useI18n()


const notif = useNotyf() as Notyf
const searchFilter = ref(resetServiceCardsListSearchFilter())
const serviceCardsList = ref<Array<ServiceCard>>([])
const paginationVar = ref(defaultPagination)
const serviceCardPrint = ref(defaultServiceCard)
const router = useRouter()
const waitingListStore = useWaitingList()
const keyIncrement = ref(0)
const default_per_page = ref(1)
const { printDiv8CM } = usePrint8CM('');
const printServiceCard = async () => {
    await sleep(500)
    printDiv8CM('printerable_service_card', t('ticket.table.title'))
}

onMounted(async () => {
    const { service_cards, pagination } = await getServiceCardsList(searchFilter.value)
    serviceCardsList.value = service_cards
    paginationVar.value = pagination
    keyIncrement.value = keyIncrement.value + 1
    default_per_page.value = pagination.per_page
});

const search = async (newSearchFilter: ServiceCardsListSearchFilter) => {
    paginationVar.value.per_page = newSearchFilter.per_page ?? paginationVar.value.per_page

    const { service_cards, pagination } = await getServiceCardsList(newSearchFilter)
    serviceCardsList.value = service_cards
    paginationVar.value = pagination
    searchFilter.value = newSearchFilter
}
const resetFilter = async (newSearchFilter: ServiceCardsListSearchFilter) => {
    searchFilter.value = newSearchFilter
    await search(searchFilter.value)
}
const getServiceCardsPerPage = async (pageNum: number) => {
    searchFilter.value.page = pageNum
    await search(searchFilter.value)
}
const serviceCardsSort = async (value: string) => {
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
    customer_name: {
        align: 'center',
        label: t('service_card.table.columns.customer_name'),
        renderRow: (row: ServiceCard) =>
            h('span', row.customer.user.first_name + ' ' + row.customer.user.last_name)
    },
    provider_name: {
        align: 'center',
        label: t('service_card.table.columns.provider_name'),
        renderRow: (row: ServiceCard) =>
            h('span', row.provider.user.first_name + ' ' + row.provider.user.last_name)
    },
    turn_number: {
        sortable: true,
        align: 'center',
        label: t('service_card.table.columns.turn_number'),
        renderRow: (row: ServiceCard) =>
            h('span', row.turn_number)
    },
    actions: {
        align: 'center',
        label: t('service_card.table.columns.actions'),
        renderRow: (row: any) =>
            h(IconButton, {
                icon: 'lnir lnir-printer',
                onClick: async () => {
                    serviceCardPrint.value = row
                    keyIncrement.value++
                    await printServiceCard()
                }
            })
    },
} as const


</script>
        
<template>
    <ServiceCardTableHeader :key="keyIncrement" :title="viewWrapper.pageTitle" :button_name="t('ticket.header_button')"
        @search="search" :pagination="paginationVar" :default_per_page="default_per_page" @resetFilter="resetFilter" />
    <VFlexTableWrapper :columns="columns" :data="serviceCardsList" @update:sort="serviceCardsSort">
        <VFlexTable separators clickable>
            <template #body>
                <div v-if="waitingListStore?.loading" class="flex-list-inner">
                    <div class="flex-table-item">
                        <VFlexTableCell>
                            <VPlaceload />
                        </VFlexTableCell>
                    </div>
                </div>
                <div v-else-if="serviceCardsList.length === 0" class="flex-list-inner">
                    <VPlaceholderSection :title="t('tables.placeholder.title')" :subtitle="t('tables.placeholder.subtitle')"
                        class="my-6">
                    </VPlaceholderSection>
                </div>
            </template>
        </VFlexTable>
        <VFlexPagination v-if="(serviceCardsList.length != 0 && paginationVar.max_page != 1)"
            :current-page="paginationVar.page" class="mt-6" :item-per-page="paginationVar.per_page"
            :total-items="paginationVar.total" :max-links-displayed="3" no-router
            @update:current-page="getServiceCardsPerPage" />
        <h6 v-if="serviceCardsList.length != 0 && !waitingListStore?.loading">
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

        <VPlaceloadText v-if="waitingListStore?.loading" :lines="1" last-line-width="20%" class="mx-2" />
    </VFlexTableWrapper>
    <ClientServiceCardPrint :key="keyIncrement" :service-card-props="serviceCardPrint" is-service-card />
</template>
<style lang="scss"></style>
        