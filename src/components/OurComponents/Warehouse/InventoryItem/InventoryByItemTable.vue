<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "permissions": [
            "inventory_list"
        ]
    }
}
</route>
            
<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { Notyf } from 'notyf';
import { useI18n } from 'vue-i18n';
import { useNotyf } from '/@src/composable/useNotyf';
import { InventoryByItem, InventoryByItemSearchFilter } from '/@src/models/Warehouse/InventoryItem/inventoryItem';
import { resetInventoryByItemSearchFilter, getInventoriesListByItem } from '/@src/services/Warehouse/InventoryItem/inventoryItemService';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { useInventoryItem } from '/@src/stores/Warehouse/InventoryItem/inventoryItemStore';
import { defaultPagination } from '/@src/utils/response';


export interface InventoryByItemTableProps {
    itemId: number
}
const props = withDefaults(defineProps<InventoryByItemTableProps>(), {
    itemId: undefined
})



const viewWrapper = useViewWrapper()
const { t } = useI18n()
const notif = useNotyf() as Notyf
const inventoryItemStore = useInventoryItem()
const searchFilter = ref(resetInventoryByItemSearchFilter())
const inventoriesItemList = ref<Array<InventoryByItem>>([])
const paginationVar = ref(defaultPagination)
const keyIncrement = ref(0)
const router = useRouter()
const default_per_page = ref(1)
const itemId = props.itemId

onMounted(async () => {
    const { inventoriesItem, pagination } = await getInventoriesListByItem(itemId, searchFilter.value)
    inventoriesItemList.value = inventoriesItem
    paginationVar.value = pagination
    keyIncrement.value = keyIncrement.value + 1
    default_per_page.value = pagination.per_page

});

const search = async (newSearchFilter: InventoryByItemSearchFilter) => {
    paginationVar.value.per_page = newSearchFilter.per_page ?? paginationVar.value.per_page


    const { inventoriesItem, pagination } = await getInventoriesListByItem(itemId, newSearchFilter)
    inventoriesItemList.value = inventoriesItem
    paginationVar.value = pagination
    searchFilter.value = newSearchFilter
}

const resetFilter = async (newSearchFilter: InventoryByItemSearchFilter) => {
    searchFilter.value = newSearchFilter
    await search(searchFilter.value)
}

const getInventoriesPerPage = async (pageNum: number) => {

    searchFilter.value.page = pageNum
    await search(searchFilter.value)
}
const InventorySort = async (value: string) => {
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
    "inventories.name": {
        align: 'center',
        label: t("inventories_by_item.table.columns.inventory_name"),
        renderRow: (row: InventoryByItem) =>
            h('span', row.inventory.name),
    },
    "quantity": {
        align: 'center',
        sortable: true,
        label: t("inventories_by_item.table.columns.quantity"),
        renderRow: (row: InventoryByItem) =>
            h('span', row.quantity),
    },
} as const

</script>
        
<template>
    <InventoryByItemTableHeader :key="keyIncrement" :title="viewWrapper.pageTitle" @search="search"
        :pagination="paginationVar" :default_per_page="default_per_page" @resetFilter="resetFilter" />
    <VFlexTableWrapper :columns="columns" :data="inventoriesItemList" @update:sort="InventorySort">

        <VFlexTable separators clickable>
            <template #body>
                <div v-if="inventoryItemStore?.loading" class="flex-list-inner">
                    <div v-for="key in paginationVar.per_page" :key="key" class="flex-table-item">
                        <VFlexTableCell>
                            <VPlaceload />
                        </VFlexTableCell>
                    </div>
                </div>
                <div v-else-if="inventoriesItemList.length === 0" class="flex-list-inner">
                    <VPlaceholderSection :title="t('tables.placeholder.title')" :subtitle="t('tables.placeholder.subtitle')"
                        class="my-6">
                    </VPlaceholderSection>
                </div>
            </template>
        </VFlexTable>
        <VFlexPagination v-if="(inventoriesItemList.length != 0 && paginationVar.max_page != 1)"
            :current-page="paginationVar.page" class="mt-6" :item-per-page="paginationVar.per_page"
            :total-items="paginationVar.total" :max-links-displayed="3" no-router
            @update:current-page="getInventoriesPerPage" />
        <h6 class="pt-2 is-size-7" v-if="inventoriesItemList.length != 0 && !inventoryItemStore?.loading">
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
        <VPlaceloadText v-if="inventoryItemStore?.loading" :lines="1" last-line-width="20%" class="mx-2" />
    </VFlexTableWrapper>
</template>
        
