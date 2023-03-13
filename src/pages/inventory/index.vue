<script setup lang="ts">
import { useHead } from '@vueuse/head'
import VTag from '/@src/components/base/tags/VTag.vue'
import { useNotyf } from '/@src/composable/useNotyf'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { defaultPagination } from '/@src/utils/response'
import { Notyf } from 'notyf'
import { useI18n } from 'vue-i18n'
import { defaultInventorySearchFilter, Inventory, InventoryConsts, InventorySearchFilter } from '/@src/models/Warehouse/Inventory/inventory'
import { useInventory } from '/@src/stores/Warehouse/Inventory/inventoryStore'
import { getInventoriesList } from '/@src/services/Warehouse/Inventory/inventoryService'
import ViewDropDown from '/@src/components/OurComponents/ViewDropDown.vue'

const viewWrapper = useViewWrapper()
const { t } = useI18n()
viewWrapper.setPageTitle(t('inventory.table.title'))
useHead({
  title: t('inventory.table.title'),
})
const notif = useNotyf() as Notyf
const searchFilter = ref(defaultInventorySearchFilter)
const inventoriesList = ref<Array<Inventory>>([])
const paginationVar = ref(defaultPagination)
const router = useRouter()
const inventoryStore = useInventory()
const keyIncrement = ref(0)
const default_per_page = ref(1)
const selectedStatus = ref(0)

// onMounted(async () => {
const { inventories, pagination } = await getInventoriesList(searchFilter.value)
inventoriesList.value = inventories
paginationVar.value = pagination
keyIncrement.value = keyIncrement.value + 1
default_per_page.value = pagination.per_page
// });

const search = async (newSearchFilter: InventorySearchFilter) => {
  paginationVar.value.per_page = newSearchFilter.per_page ?? paginationVar.value.per_page
  const { inventories, pagination } = await getInventoriesList(newSearchFilter)
  inventoriesList.value = inventories
  paginationVar.value = pagination
  searchFilter.value = newSearchFilter
}

const resetFilter = async (newSearchFilter: InventorySearchFilter) => {
  searchFilter.value = newSearchFilter
  await search(searchFilter.value)
}

const getInventoriesPerPage = async (pageNum: number) => {
  searchFilter.value.page = pageNum
  await search(searchFilter.value)
}
const inventorySort = async (value: string) => {
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
    grow: true,
    searchable: true,
    label: t('inventory.table.columns.name'),
    renderRow: (row: any) =>
      h('span', row?.employee_id != undefined ? t('inventory.table.columns.custody') + ' ' + row?.name : row?.name)
  },
  items_count: {
    sortable: true,
    searchable: true,
    grow: true,
    align: 'center',
    label: t('inventory.table.columns.items_count'),
    renderRow: (row: any) =>
      h('span', row?.items_count)
  },
  last_updated_at: {
    align: 'center',
    label: t('inventory.table.columns.updated_at'),
    grow: true,
    renderRow: (row: any) =>
      h('span', row?.last_updated_at),
    searchable: true,
    sortable: true,
  },
  last_action_by: {
    align: 'center',
    label: t('inventory.table.columns.action_by'),
    grow: true,
    renderRow: (row: any) =>
      h('span', row?.last_action_by?.first_name + ' ' + row?.last_action_by?.last_name),
    searchable: true,
    sortable: true,
  },
  status: {
    align: 'center',
    label: t('inventory.table.columns.status'),
    renderRow: (row: any) =>
      h(
        VTag,
        {
          rounded: true,
          color:
            row.status === InventoryConsts.INACTIVE
              ? 'danger'
              : row.status === InventoryConsts.ACTIVE
                ? 'success'
                : undefined,
        },
        {
          default() {
            return InventoryConsts.showStatusName(row.status)
          },
        }
      ),
  },
  actions: {
    align: 'center',
    label: t('inventory.table.columns.actions'),

    renderRow: (row: any) =>
      h(ViewDropDown, {
        onView: () => {
          router.push({ path: `/inventory/${row?.id}` })
        },
      }),

  },

} as const
</script>

<template>
  <InventoryTableHeader :key="keyIncrement" :title="viewWrapper.pageTitle" @search="search" :pagination="paginationVar"
    :default_per_page="default_per_page" @resetFilter="resetFilter" />
  <VFlexTableWrapper :columns="columns" :data="inventoriesList" @update:sort="inventorySort">
    <VFlexTable separators clickable>
      <template #body>
        <div v-if="inventoryStore?.loading" class="flex-list-inner">
          <div v-for="key in paginationVar.per_page" :key="key" class="flex-table-item">
            <VFlexTableCell>
              <VPlaceload />
            </VFlexTableCell>
          </div>
        </div>
        <div v-else-if="inventoriesList.length === 0" class="flex-list-inner">
          <VPlaceholderSection :title="t('tables.placeholder.title')" :subtitle="t('tables.placeholder.subtitle')"
            class="my-6">
          </VPlaceholderSection>
        </div>
      </template>
    </VFlexTable>
    <VFlexPagination v-if="(inventoriesList.length != 0 && paginationVar.max_page != 1)"
      :current-page="paginationVar.page" class="mt-6" :item-per-page="paginationVar.per_page"
      :total-items="paginationVar.total" :max-links-displayed="3" no-router
      @update:current-page="getInventoriesPerPage" />
    <h6 v-if="inventoriesList.length != 0 && !inventoryStore?.loading">
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

    <VPlaceloadText v-if="inventoryStore?.loading" :lines="1" last-line-width="20%" class="mx-2" />
</VFlexTableWrapper>
</template>
