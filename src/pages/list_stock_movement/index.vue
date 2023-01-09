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
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('ItemHistory')
useHead({
    title: 'ItemHistory',
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
    const { itemHistories, pagination } = await getItemHistoriesList(searchFilter.value)
    searchFilter.value = defaultItemHistorySearchFilter
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
        notif.success(`${itemChangeStatus.value.name} status was edited successfully`)
    } else {
        await sleep(200);
        notif.error(message)
    }
    changeStatusPopup.value = false
}
const search = async (searchFilter2: ItemHistorySearchFilter) => {
    paginationVar.value.per_page = searchFilter2.per_page ?? paginationVar.value.per_page
    const { itemHistories, pagination } = await getItemHistoriesList(searchFilter2)
    itemHistoriesList.value = itemHistories
    paginationVar.value = pagination
    searchFilter.value = searchFilter2
}

const resetFilter = async (searchFilter2: ItemHistorySearchFilter) => {
    searchFilter.value = searchFilter2
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
    if(value == undefined){
        return ''
    }
    else{
        let trimmedString = value?.substring(0, 10);
        return trimmedString + '...'
    }
}
const columns = {
    Level1: {
        searchable: true,
        grow: true,
        align: 'center',
        label: 'Level 1',
        renderRow: (row: any) =>
            h('span', row?.item.category?.parent?.name)
    },
    Level2: {
        searchable: true,
        grow: true,
        align: 'center',
        label: 'Level 2',
        renderRow: (row: any) =>
            h('span', row?.item.category?.name)
    },
    Item: {
        searchable: true,
        grow: true,
        align: 'center',
        label: 'Item',
        renderRow: (row: any) =>
            h('span', row?.item.name)
    },
    type: {
        sortable: true,
        align: 'center',
        searchable: true,
        grow: true,
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
        label: 'quantity',

    },
    add_item_cost: {
        sortable: true,
        align: 'center',
        searchable: true,
        label: 'cost',
        grow: true,


    },
    withdraw_item_price: {
        sortable: true,
        align: 'center',
        searchable: true,
        label: 'Price',
        grow: true,
    },
    requester_name: {
        searchable: true,
        grow: true,
        align: 'center',
        label: 'requester',
    },
    note: {
        align: 'center',
        searchable: true,
        grow: true,
        renderRow: (row: any) =>
            h('span', {
                innerHTML:
                    `<div class="tooltip">${noteTrim(row?.note)}<div class="tooltiptext"><p>${row?.note}</p></div></div>`,

            }),

    },
    created_at: {
        align: 'center',
        label: 'Create_at',
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
        label: 'Created_by',
        renderRow: (row: any) =>
            h('span', row?.created_by?.first_name)
    },
    // status: {
    //     align: 'center',
    //     renderRow: (row: any) =>
    //         h(
    //             VTag,
    //             {
    //                 rounded: true,
    //                 color:
    //                     row.status === ItemHsitoryConsts.INACTIVE
    //                         ? 'orange'
    //                         : row.status === ItemHsitoryConsts.ACTIVE
    //                             ? 'success'
    //                             : undefined,
    //             },
    //             {
    //                 default() {
    //                     return ItemHsitoryConsts.showStatusName(row.status)
    //                 },
    //             }
    //         ),
    // },
} as const
</script>

<template>
    <ListStockMovementTableHeader :key="keyIncrement" :title="viewWrapper.pageTitle"
        :button_name="`Add ${viewWrapper.pageTitle}`" @search="search" :pagination="paginationVar"
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
                    <VPlaceholderSection title="No matches" subtitle="There is no data that match your search."
                        class="my-6">
                    </VPlaceholderSection>
                </div>
            </template>
        </VFlexTable>
        <VFlexPagination v-if="(itemHistoriesList.length != 0 && paginationVar.max_page != 1)"
            :current-page="paginationVar.page" class="mt-6" :item-per-page="paginationVar.per_page"
            :total-items="paginationVar.total" :max-links-displayed="3" no-router
            @update:current-page="getItemHistoriesPerPage" />
        <h6 v-if="itemHistoriesList.length != 0 && !itemHistoryStore?.loading">Showing {{
            paginationVar.page !=
                paginationVar.max_page
                ?
                (1 + ((paginationVar.page - 1) * paginationVar.count)) : paginationVar.page == 1 ? 1 : paginationVar.total
        }} to {{
    paginationVar.page !=
        paginationVar.max_page ?
        paginationVar.page *
        paginationVar.per_page : paginationVar.total
}} of {{ paginationVar.total }} entries</h6>

        <VPlaceloadText v-if="itemHistoryStore?.loading" :lines="1" last-line-width="20%" class="mx-2" />
    </VFlexTableWrapper>
    <VModal title="Change ItemHistory Status" :open="changeStatusPopup" actions="center"
        @close="changeStatusPopup = false">
        <template #content>
            <form class="form-layout" @submit.prevent="">
                <!--Fieldset-->
                <div class="form-fieldset">
                    <div class="columns is-multiline">
                        <div class="column is-12">
                            <VField id="status" v-slot="{ field }">
                                <VLabel class="required">{{ viewWrapper.pageTitle }} status</VLabel>
                                <VControl>
                                    <VRadio v-model="currentChangeStatusItemHistory.status"
                                        :value="ItemHsitoryConsts.INACTIVE" :label="ItemHsitoryConsts.showStatusName(0)"
                                        name="status" color="warning" />
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
    </VModal>
</template>
<style  lang="scss">

.tooltip {
    position: relative;
    display: inline-block;
}

.tooltip .tooltiptext {
    visibility: hidden;
    width: auto;
    height: 120px;
    background-color: white;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px;
    word-wrap: break-word;
    /* Position the tooltip */
    position: absolute;
    z-index: 1;
}

.tooltip:hover .tooltiptext {
    visibility: visible;
}
</style>
