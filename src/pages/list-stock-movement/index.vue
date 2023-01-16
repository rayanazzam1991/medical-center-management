<script setup lang="ts">
import { useHead } from '@vueuse/head'
import VTag from '/@src/components/base/tags/VTag.vue'
import { changeItemHistoryStatus, getItemHistoriesList } from '/@src/services/Warehouse/ItemHistory/itemHistoryService'
import { useNotyf } from '/@src/composable/useNotyf'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { defaultPagination } from '/@src/utils/response'
import { useitemHistory } from '/@src/stores/Warehouse/ItemHistory/itemHistoryStore'
import sleep from '/@src/utils/sleep'
import {
    defaultChangeItemHistoryStatus,
    defaultItemHistory,
    defaultItemHistorySearchFilter,
    ItemHistorySearchFilter,
    ItemHsitoryConsts,
    itemHistory
} from '/@src/models/Warehouse/ItemHistory/itemHistory'
import { Notyf } from 'notyf'
import { BaseConsts } from '/@src/utils/consts/base'
import { useI18n } from 'vue-i18n'
const viewWrapper = useViewWrapper()
const {t} = useI18n()
viewWrapper.setPageTitle(t('list_stock_movement.table.title'))
useHead({
    title: t('list_stock_movement.table.title'),
})
const notif = useNotyf() as Notyf
const searchFilter = ref(defaultItemHistorySearchFilter)
const itemHistoriesList = ref<Array<itemHistory>>([])
const changeStatusPopup = ref(false)
const itemChangeStatus = ref<itemHistory>(defaultItemHistory)
const currentChangeStatusItemHistory = ref(defaultChangeItemHistoryStatus)
const paginationVar = ref(defaultPagination)
const router = useRouter()
const itemHistoryStore = useitemHistory()
const keyIncrement = ref(0)
const default_per_page = ref(1)

onMounted(async () => {
    searchFilter.value = {} as ItemHistorySearchFilter
    searchFilter.value.status = BaseConsts.ACTIVE
    const { itemHistories, pagination } = await getItemHistoriesList(searchFilter.value)
    itemHistoriesList.value = itemHistories
    paginationVar.value = pagination
    keyIncrement.value = keyIncrement.value + 1
    default_per_page.value = pagination.per_page
});

const changestatusItemHistory = async () => {
    currentChangeStatusItemHistory.value.id = currentChangeStatusItemHistory.value.id
    const { message, success } = await changeItemHistoryStatus(currentChangeStatusItemHistory.value)
    if (success) {
        await search(searchFilter.value)
        // @ts-ignore
        notif.dismissAll()
        await sleep(200);
        // @ts-ignore
        notif.success(t('toast.success.edit'))
    } else {
        await sleep(200);
        notif.error(message)
    }
    changeStatusPopup.value = false
}
const search = async (searchFilter2: ItemHistorySearchFilter) => {
    searchFilter2.status = BaseConsts.ACTIVE

    paginationVar.value.per_page = searchFilter2.per_page ?? paginationVar.value.per_page
    const { itemHistories, pagination } = await getItemHistoriesList(searchFilter2)
    itemHistoriesList.value = itemHistories
    paginationVar.value = pagination
    searchFilter.value = searchFilter2
}

const resetFilter = async (searchFilter2: ItemHistorySearchFilter) => {
    searchFilter.value = searchFilter2
    searchFilter.value.status = BaseConsts.ACTIVE

    await search(searchFilter.value)
}

const getItemHistoriesPerPage = async (pageNum: number) => {
    searchFilter.value.page = pageNum
    await search(searchFilter.value)
}
const itemSort = async (value: string) => {
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
const noteTrim = (value: string) => {
    if (value == undefined) {
        return ''
    }
    else {
        let trimmedString = value?.substring(0, 10);
        return trimmedString + '...'
    }
}
const columns = {
    item: {
        searchable: true,
        grow: "xl",
        align: 'center',
        label: t('list_stock_movement.table.columns.item'),
        renderRow: (row: any) =>
            h('span', row?.item.name)
    },
    type: {
        sortable: true,
        align: 'center',
        searchable: true,
        grow: true,
        label: t('list_stock_movement.table.columns.type'),

        renderRow: (row: any) =>
            h(
                VTag,
                {
                    rounded: true,
                    color:
                        row.type === 'in'
                            ? 'success'
                            : row.type === 'out'
                                ? 'danger'
                                : undefined,
                },
                {
                    default() {
                        return row.type
                    },
                }
            ),
    },
    item_quantity: {
        align: 'center',
        searchable: true,
        grow: true,
        label: t('list_stock_movement.table.columns.quantity'),

    },
    add_item_cost: {
        sortable: true,
        align: 'center',
        searchable: true,
        label: t('list_stock_movement.table.columns.cost'),
        renderRow: (row: any) =>
            h('span', row?.add_item_cost ? row?.add_item_cost : '-'),


        grow: true,
    },
    withdraw_item_price: {
        sortable: true,
        align: 'center',
        searchable: true,
        label: t('list_stock_movement.table.columns.price'),
        grow: true,
        renderRow: (row: any) =>
            h('span', row?.withdraw_item_price ? row?.withdraw_item_price : '-'),


    },
    requester_name: {
        searchable: true,
        grow: 'lg',
        align: 'center',
        label: t('list_stock_movement.table.columns.requester'),
        renderRow: (row: any) =>
            h('span', {
                innerHTML: row?.requester_name ?
                    `<div class="tooltip">${noteTrim(row?.requester_name)}<div class="tooltiptext"><p class="text-white">${row?.requester_name}</p></div></div>` : '-',

            }),

    },
    note: {
        align: 'center',
        searchable: true,
        grow: true,
        label: t('list_stock_movement.table.columns.note'),

        renderRow: (row: any) =>
            h('span', {
                innerHTML:
                    `<div class="tooltip">${noteTrim(row?.note)}<div class="tooltiptext"><p class="text-white">${row?.note}</p></div></div>`,

            }),

    },
    created_at: {
        align: 'center',
        label: t('list_stock_movement.table.columns.created_at'),
        grow: true,
        renderRow: (row: any) =>
            h('span', row?.created_at),
        searchable: true,
        sortable: true,
    },
    created_by: {
        searchable: true,
        grow: true,
        align: 'center',
        label: t('list_stock_movement.table.columns.created_by'),
        renderRow: (row: any) =>
            h('span', row?.created_by?.first_name)
    },
} as const
</script>

<template>
    <ListStockMovementTableHeader :key="keyIncrement" :title="viewWrapper.pageTitle"
        @search="search" :pagination="paginationVar"
        :default_per_page="default_per_page" @resetFilter="resetFilter" />
    <VFlexTableWrapper :columns="columns" :data="itemHistoriesList" @update:sort="itemSort">
        <VFlexTable separators clickable>
            <template #body>
                <div v-if="itemHistoryStore?.loading" class="flex-list-inner">
                    <div v-for="key in paginationVar.per_page" :key="key" class="flex-table-item">
                        <VFlexTableCell>
                            <VPlaceload />
                        </VFlexTableCell>
                    </div>
                </div>
                <div v-else-if="itemHistoriesList.length === 0" class="flex-list-inner">
                    <VPlaceholderSection :title="t('tables.placeholder.title')"
                     :subtitle="t('tables.placeholder.subtitle')"
                        class="my-6">
                    </VPlaceholderSection>
                </div>
            </template>
        </VFlexTable>
        <VFlexPagination v-if="(itemHistoriesList.length != 0 && paginationVar.max_page != 1)"
            :current-page="paginationVar.page" class="mt-6" :item-per-page="paginationVar.per_page"
            :total-items="paginationVar.total" :max-links-displayed="3" no-router
            @update:current-page="getItemHistoriesPerPage" />
        <h6 v-if="itemHistoriesList.length != 0 && !itemHistoryStore?.loading">
            {{
        t('tables.pagination_footer', { from_number: paginationVar.page !=
          paginationVar.max_page
          ?
          (1 + ((paginationVar.page - 1) * paginationVar.count)) : paginationVar.page == paginationVar.max_page ? (1 +
            ((paginationVar.page - 1) * paginationVar.per_page)) : paginationVar.page == 1 ? 1 : paginationVar.total
        , to_number: paginationVar.page !=
          paginationVar.max_page ?
          paginationVar.page *
          paginationVar.per_page : paginationVar.total, all_number: paginationVar.total
      })}}</h6>
        <VPlaceloadText v-if="itemHistoryStore?.loading" :lines="1" last-line-width="20%" class="mx-2" />
    </VFlexTableWrapper>
    <!-- <VModal title="Change Item History Status" :open="changeStatusPopup" actions="center"
        @close="changeStatusPopup = false">
        <template #content>
            <form class="form-layout" @submit.prevent="">
                <div class="form-fieldset">
                    <div class="columns is-multiline">
                        <div class="column is-12">
                            <VField id="status" v-slot="{ field }">
                                <VLabel class="required">{{ viewWrapper.pageTitle }} status</VLabel>
                                <VControl>
                                    <VRadio v-model="currentChangeStatusItemHistory.status"
                                        :value="ItemHsitoryConsts.INACTIVE" :label="ItemHsitoryConsts.showStatusName(0)"
                                        name="status" color="danger" />
                                    <VRadio v-model="currentChangeStatusItemHistory.status"
                                        :value="ItemHsitoryConsts.ACTIVE" :label="ItemHsitoryConsts.showStatusName(1)"
                                        name="status" color="success" />
                                    <ErrorMessage class="help is-danger" name="status" />
                                </VControl>
                            </VField>
                        </div>
                    </div>
                </div>
            </form>
        </template>
        <template #action="{ close }">
            <VButton color="primary" raised @click="changestatusItemHistory()">Confirm</VButton>
        </template>
    </VModal> -->
</template>
<style  lang="scss">
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
