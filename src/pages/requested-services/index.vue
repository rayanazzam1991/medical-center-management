<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { Notyf } from 'notyf';
import { useI18n } from 'vue-i18n';
import VTag from '/@src/components/base/tags/VTag.vue';
import TicketServiceDropDown from '/@src/components/OurComponents/Sales/TicketService/TicketServiceDropDown.vue';
import { addParenthesisToString, stringTrim } from '/@src/composable/helpers/stringHelpers';
import { useNotyf } from '/@src/composable/useNotyf';
import { defaultTicketServiceSearchFilter, TicketService, TicketServiceConsts, TicketServiceSearchFilter } from '/@src/models/Sales/TicketService/ticketService';
import { getTicktServicesList } from '/@src/services/Sales/TicketService/ticketServiceService';
import { useTicketService } from '/@src/stores/Sales/TicketService/ticketServiceStore';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { defaultPagination } from '/@src/utils/response';



const viewWrapper = useViewWrapper()
const { t } = useI18n()
viewWrapper.setPageTitle(t('requested_services.table.title'))
useHead({
    title: t('requested_services.table.title'),
})
const notif = useNotyf() as Notyf
const ticketServiceStore = useTicketService()
const searchFilter = ref(defaultTicketServiceSearchFilter)
const ticketServicesList = ref<Array<TicketService>>([])
const paginationVar = ref(defaultPagination)
const keyIncrement = ref(0)
const router = useRouter()
const default_per_page = ref(1)

onMounted(async () => {
    const { ticket_services, pagination } = await getTicktServicesList(searchFilter.value)
    ticketServicesList.value = ticket_services
    paginationVar.value = pagination
    keyIncrement.value = keyIncrement.value + 1
    default_per_page.value = pagination.per_page

});

const search = async (newSearchFilter: TicketServiceSearchFilter) => {
    paginationVar.value.per_page = newSearchFilter.per_page ?? paginationVar.value.per_page
    const { ticket_services, pagination } = await getTicktServicesList(newSearchFilter)
    ticketServicesList.value = ticket_services
    paginationVar.value = pagination
    searchFilter.value = newSearchFilter
}

const resetFilter = async (newSearchFilter: TicketServiceSearchFilter) => {
    searchFilter.value = newSearchFilter
    await search(searchFilter.value)
}

const getTicketServicePerPage = async (pageNum: number) => {

    searchFilter.value.page = pageNum
    search(searchFilter.value)
}
const TicketServiceSort = async (value: string) => {
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
    "customer_name": {
        align: 'center',
        label: t("requested_services.table.columns.customer_name"),
        renderRow: (row: TicketService) =>
            h('span', row?.ticket?.customer.user.first_name + ' ' + row?.ticket?.customer.user.last_name),
    },
    "provider_name": {
        align: 'center',
        label: t("requested_services.table.columns.provider_name"),
        renderRow: (row: TicketService) =>
            h('span', row?.provider.user.first_name + ' ' + row?.provider.user.last_name),
    },
    "service_name": {
        align: 'center',
        label: t("requested_services.table.columns.service_name"),
        renderRow: (row: TicketService) =>
            h('span', row?.service.name),
    },
    "sell_price": {
        align: 'center',
        label: t("requested_services.table.columns.price"),
        renderRow: (row: TicketService) =>
            h('span', row?.sell_price),
    },
    "currency": {
        align: 'center',
        label: t("requested_services.table.columns.currency"),
        renderRow: (row: TicketService) =>
            h('span', row.ticket?.currency.name),
    },
    "note": {
        align: 'center',
        label: t("requested_services.table.columns.note"),
        renderRow: (row: TicketService) =>
            h('span', {
                innerHTML: row?.note ?
                    `<div class="tooltip">${stringTrim(row?.note, 5)}<div class="tooltiptext"><p class="text-white">${row?.note}</p></div></div>` : '-',
            }),
    },
    "updated_at": {
        align: 'center',
        sortable: true,

        label: t("requested_services.table.columns.action_date"),
        renderRow: (row: TicketService) =>
            h('span', row?.updated_at),
    },
    status: {
        align: 'center',
        label: t("requested_services.table.columns.status"),
        renderRow: (row: TicketService) => {

            return h(
                VTag,
                {
                    rounded: true,
                    color: TicketServiceConsts.getStatusColor(row?.status),
                },
                {
                    default() {
                        return TicketServiceConsts.getStatusName(row?.status)
                    },
                }
            );
        }


    },
    "created_at": {
        align: 'center',
        sortable: true,
        label: t("requested_services.table.columns.created_at"),
        renderRow: (row: TicketService) =>
            h('span', row?.created_at),
    },
    "created_by": {
        align: 'center',
        label: t("requested_services.table.columns.created_by"),
        renderRow: (row: TicketService) =>
            h('span', row?.ticket?.created_by?.first_name + ' ' + row?.ticket?.created_by?.last_name),

    },
    actions: {
        align: 'center',
        label: t('requested_services.table.columns.actions'),

        renderRow: (row: TicketService) =>
            h(TicketServiceDropDown, {
                onAddReminder: () => {
                    router.push({ path: `/reminder/add`, query: { customer_id: row.ticket?.customer.id, ticket_service_id: row.id } })
                },
            }),

    },

} as const
</script>

<template>
    <TicketServiceTableHeader :key="keyIncrement" :title="viewWrapper.pageTitle" @search="search"
        :pagination="paginationVar" :default_per_page="default_per_page" @resetFilter="resetFilter" />


    <VFlexTableWrapper :columns="columns" :data="ticketServicesList" @update:sort="TicketServiceSort">

        <VFlexTable separators clickable>
            <template #body>
                <div v-if="ticketServiceStore?.loading" class="flex-list-inner">
                    <div v-for="key in paginationVar.per_page" :key="key" class="flex-table-item">
                        <VFlexTableCell>
                            <VPlaceload />
                        </VFlexTableCell>
                    </div>
                </div>
                <div v-else-if="ticketServicesList.length === 0" class="flex-list-inner">
                    <VPlaceholderSection :title="t('tables.placeholder.title')" :subtitle="t('tables.placeholder.subtitle')"
                        class="my-6">
                    </VPlaceholderSection>
                </div>
            </template>
        </VFlexTable>
        <VFlexPagination v-if="(ticketServicesList.length != 0 && paginationVar.max_page != 1)"
            :current-page="paginationVar.page" class="mt-6" :item-per-page="paginationVar.per_page"
            :total-items="paginationVar.total" :max-links-displayed="3" no-router
            @update:current-page="getTicketServicePerPage" />
        <h6 class="pt-2 is-size-7" v-if="ticketServicesList.length != 0 && !ticketServiceStore?.loading">
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
        <VPlaceloadText v-if="ticketServiceStore?.loading" :lines="1" last-line-width="20%" class="mx-2" />
    </VFlexTableWrapper>
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
