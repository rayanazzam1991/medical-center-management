<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { Notyf } from 'notyf';
import { useI18n } from 'vue-i18n';
import { addParenthesisToString } from '/@src/composable/helpers/stringHelpers';
import { useNotyf } from '/@src/composable/useNotyf';
import { Currency, defaultCurrency } from '/@src/models/Accounting/Currency/currency';
import { defaultItemsInInventorySearchFilter, ItemsInInventory, defaultItemsInInventory, ItemsInInventorySearchFilter, ItemInInventory } from '/@src/models/Warehouse/Item/item';
import { getCurrenciesFromStorage } from '/@src/services/Accounting/Currency/currencyService';
import { getItemsInInventory } from '/@src/services/Warehouse/Item/itemService';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { useItem } from '/@src/stores/Warehouse/Item/itemStore';
import { defaultPagination } from '/@src/utils/response';


const viewWrapper = useViewWrapper()
const { t } = useI18n()
viewWrapper.setPageTitle(t('inventory.details.title'))
useHead({
    title: t('inventory.details.title'),
})
const route = useRoute()
const inventoryId = ref(0)
// @ts-ignore
inventoryId.value = route.params?.id as number ?? 0
const notif = useNotyf() as Notyf
const searchFilter = ref(defaultItemsInInventorySearchFilter)
const itemsInInvetory = ref<ItemsInInventory>(defaultItemsInInventory)
const paginationVar = ref(defaultPagination)
const router = useRouter()
const itemStore = useItem()
const keyIncrement = ref(0)
const default_per_page = ref(1)
const currencies = getCurrenciesFromStorage()
const mainCurrency: Currency = currencies.find((currency) => currency.is_main) ?? defaultCurrency

onMounted(async () => {
    const { items_in_inventory, pagination } = await getItemsInInventory(inventoryId.value, searchFilter.value)

    itemsInInvetory.value = items_in_inventory
    paginationVar.value = pagination
    keyIncrement.value = keyIncrement.value + 1
    default_per_page.value = pagination.per_page
    viewWrapper.setPageTitle(itemsInInvetory.value.inventory.name)

});

const search = async (newSearchFilter: ItemsInInventorySearchFilter) => {
    searchFilter.value = newSearchFilter
    paginationVar.value.per_page = newSearchFilter.per_page ?? paginationVar.value.per_page
    const { items_in_inventory, pagination } = await getItemsInInventory(inventoryId.value, searchFilter.value)
    itemsInInvetory.value = items_in_inventory
    paginationVar.value = pagination
}

const resetFilter = async (newSearchFilter: ItemsInInventorySearchFilter) => {
    searchFilter.value = newSearchFilter
    await search(searchFilter.value)
}

const getItemsPerPage = async (pageNum: number) => {
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
const columns = {
    name: {
        sortable: true,
        align: 'center',
        label: t('inventory.details.table.name'),
        renderRow: (row: ItemInInventory) =>
            h('span', row?.name)
    },
    "categories.categories.name": {
        grow: true,
        align: 'center',
        label: t('inventory.details.table.level_1'),
        renderRow: (row: ItemInInventory) =>
            h('span', row?.category.parent?.name)
    },
    "categories.name": {
        align: 'center',
        label: t('inventory.details.table.level_2'),
        renderRow: (row: ItemInInventory) =>
            h('span', row?.category.name)
    },
    "inventory_items.quantity": {
        align: 'center',
        label: t('inventory.details.table.quantity'),
        renderRow: (row: ItemInInventory) =>
            h('span', row?.quantity),
    },
    price: {
        align: 'center',
        label: t('inventory.details.table.price') + addParenthesisToString(mainCurrency.name),
        renderRow: (row: ItemInInventory) =>
            h('span', row?.price),
        sortable: true,
    },
    cost: {
        align: 'center',
        label: t('inventory.details.table.cost') + addParenthesisToString(mainCurrency.name),
        renderRow: (row: ItemInInventory) =>
            h('span', row?.cost),
        sortable: true,
    },

} as const
</script>

<template>
    <ItemsInInventoryTableHeader :key="keyIncrement" :title="itemsInInvetory.inventory.name"
        :status="itemsInInvetory.inventory.status" @search="search" :pagination="paginationVar"
        :default_per_page="default_per_page" @resetFilter="resetFilter" />
    <VFlexTableWrapper :columns="columns" :data="itemsInInvetory.items" @update:sort="itemSort">
        <VFlexTable separators clickable>
            <template #body>
                <div v-if="itemStore?.loading" class="flex-list-inner">
                    <div v-for="key in paginationVar.per_page" :key="key" class="flex-table-item">
                        <VFlexTableCell>
                            <VPlaceload />
                        </VFlexTableCell>
                    </div>
                </div>
                <div v-else-if="itemsInInvetory.items.length === 0" class="flex-list-inner">
                    <VPlaceholderSection :title="t('tables.placeholder.title')" :subtitle="t('tables.placeholder.subtitle')"
                        class="my-6">
                    </VPlaceholderSection>
                </div>
            </template>
        </VFlexTable>
        <VFlexPagination v-if="(itemsInInvetory.items.length != 0 && paginationVar.max_page != 1)"
            :current-page="paginationVar.page" class="mt-6" :item-per-page="paginationVar.per_page"
            :total-items="paginationVar.total" :max-links-displayed="3" no-router @update:current-page="getItemsPerPage" />
        <h6 v-if="itemsInInvetory.items.length != 0 && !itemStore?.loading">
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

        <VPlaceloadText v-if="itemStore?.loading" :lines="1" last-line-width="20%" class="mx-2" />
</VFlexTableWrapper>
</template>
