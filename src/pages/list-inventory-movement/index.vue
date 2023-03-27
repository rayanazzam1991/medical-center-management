<route lang="json">
{
  "meta": {
    "requiresAuth": true,
    "permissions": [
      "inventory_item_history_list"
    ]
  }
}
</route>
  
<script lang="ts" setup>
import { useHead } from '@vueuse/head';
import { Notyf } from 'notyf';
import { useI18n } from 'vue-i18n';
import { useNotyf } from '/@src/composable/useNotyf';
import {
  defaultChangeItemHistoryStatus,
  defaultInventoryItemHistory,
  defaultInventoryItemHistorySearchFilter,
  inventoryItemHistory,
  InventoryItemHistorySearchFilter
} from '/@src/models/Warehouse/ItemHistory/inventoryItemHistory';
import { getInventoryMovementsList } from '/@src/services/Warehouse/ItemHistory/inventoryItemHistoryService';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { useinventoryItemHistory } from '/@src/stores/Warehouse/ItemHistory/inventoryItemHistoryStore';
import { BaseConsts } from '/@src/utils/consts/base';
import { defaultPagination } from '/@src/utils/response';
import { stringTrim } from "/@src/composable/helpers/stringHelpers";
import PrintDropDown from '/@src/components/OurComponents/PrintComponents/PrintDropDown.vue';
import { Permissions } from '/@src/utils/consts/rolesPermissions';
import usePrint from '/@src/composable/usePrint';
import sleep from '/@src/utils/sleep';

const viewWrapper = useViewWrapper()
const { t } = useI18n()
viewWrapper.setPageTitle(t('list_inventory_movement.table.title'))
useHead({
  title: t('list_inventory_movement.table.title'),
})
const notif = useNotyf() as Notyf
const searchFilter = ref(defaultInventoryItemHistorySearchFilter)
const itemHistoriesList = ref<Array<inventoryItemHistory>>([])
const changeStatusPopup = ref(false)
const itemChangeStatus = ref<inventoryItemHistory>(defaultInventoryItemHistory)
const currentChangeStatusItemHistory = ref(defaultChangeItemHistoryStatus)
const paginationVar = ref(defaultPagination)
const router = useRouter()
const itemHistoryStore = useinventoryItemHistory()
const keyIncrement = ref(0)
const default_per_page = ref(1)
const selectedMovementForPrint = ref(defaultInventoryItemHistory)
const { printDiv } = usePrint('');
const print = async () => {
  await sleep(500)
  printDiv('printerable', t('list_inventory_movement.table.title'))
}

onMounted(async () => {
  searchFilter.value = {} as InventoryItemHistorySearchFilter
  searchFilter.value.status = BaseConsts.ACTIVE
  const { itemHistories, pagination } = await getInventoryMovementsList(searchFilter.value)
  itemHistoriesList.value = itemHistories
  paginationVar.value = pagination
  keyIncrement.value = keyIncrement.value + 1
  default_per_page.value = pagination.per_page
});

const search = async (searchFilter2: InventoryItemHistorySearchFilter) => {
  searchFilter2.status = BaseConsts.ACTIVE
  paginationVar.value.per_page = searchFilter2.per_page ?? paginationVar.value.per_page
  const { itemHistories, pagination } = await getInventoryMovementsList(searchFilter2)
  itemHistoriesList.value = itemHistories
  paginationVar.value = pagination
  searchFilter.value = searchFilter2
}

const resetFilter = async (searchFilter2: InventoryItemHistorySearchFilter) => {
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
  } else {
    searchFilter.value.order = undefined
    searchFilter.value.order_by = undefined
  }
  await search(searchFilter.value)
}
const columns = {
  from_inventory: {
    sortable: true,
    align: 'center',
    searchable: true,
    grow: true,
    label: t('list_inventory_movement.table.columns.from'),
    renderRow: (row: any) =>
      h('span', row?.from_inventory ? row?.from_inventory : '-'),
  },
  to_inventory: {
    sortable: true,
    align: 'center',
    searchable: true,
    label: t('list_inventory_movement.table.columns.to'),
    grow: true,
    renderRow: (row: any) =>
      h('span', row?.to_inventory ? row?.to_inventory : !row?.to_inventory && row?.from_inventory ? row?.requester_name : '-'),
  },
  action: {
    align: 'center',
    searchable: true,
    label: t('list_inventory_movement.table.columns.action'),
    grow: true,
    renderRow: (row: any) =>
      h('span', row?.action_type ? t(`list_inventory_movement.table.action_types.${row?.action_type.replaceAll(' ', '_').toLowerCase()}`)
        : '-'
      ),

  },
  movement_type: {
    align: 'center',
    searchable: true,
    label: t('list_inventory_movement.table.columns.movement_type'),
    grow: true,
    renderRow: (row: any) =>
      h('span', row?.movement_type ? t(`list_inventory_movement.table.movement_types.${row?.movement_type.replaceAll(' ', '_').toLowerCase()}`)
        : '-'
      ),

  },
  item: {
    searchable: true,
    grow: true,
    align: 'center',
    label: t('list_inventory_movement.table.columns.item'),
    renderRow: (row: any) =>
      h('span', row?.item)
  },
  item_quantity: {
    align: 'center',
    searchable: true,
    grow: true,
    label: t('list_inventory_movement.table.columns.quantity'),
  },
  note: {
    align: 'center',
    searchable: true,
    grow: true,
    label: t('list_inventory_movement.table.columns.note'),

    renderRow: (row: any) =>
      h('span', {
        innerHTML: row?.note ?
          `<div class="tooltip">${stringTrim(row?.note, 10)}<div class="tooltiptext"><p class="text-white">${row?.note}</p></div></div>` : '-',

      }),

  },
  created_at: {
    align: 'center',
    label: t('list_inventory_movement.table.columns.created_at'),
    grow: true,
    renderRow: (row: any) =>
      h('span', row?.created_at),
    searchable: true,
    sortable: true,
  },
  action_by: {
    searchable: true,
    grow: true,
    align: 'center',
    label: t('list_inventory_movement.table.columns.action_by'),
    renderRow: (row: any) =>
      h('span', row?.action_by?.first_name + ' ' + row?.action_by?.last_name)
  },
  actions: {
    align: 'center',
    label: t('list_inventory_movement.table.columns.actions'),
    renderRow: (row: inventoryItemHistory) =>
      h(PrintDropDown, {
        printPermission: Permissions.INVENTORY_ITEM_HISTORY_SHOW,
        onPrint: async () => {
          selectedMovementForPrint.value = row
          keyIncrement.value++
          await print()
        },
      }),
  },

} as const
</script>

<template>
  <ListInventoryMovementTableHeader :key="keyIncrement" :default_per_page="default_per_page" :pagination="paginationVar"
    :title="viewWrapper.pageTitle" @resetFilter="resetFilter" @search="search" />
  <VFlexTableWrapper :columns="columns" :data="itemHistoriesList" @update:sort="itemSort">
    <VFlexTable clickable separators>
      <template #body>
        <div v-if="itemHistoryStore?.loading" class="flex-list-inner">
          <div v-for="key in paginationVar.per_page" :key="key" class="flex-table-item">
            <VFlexTableCell>
              <VPlaceload />
            </VFlexTableCell>
          </div>
        </div>
        <div v-else-if="itemHistoriesList.length === 0" class="flex-list-inner">
          <VPlaceholderSection :subtitle="t('tables.placeholder.subtitle')" :title="t('tables.placeholder.title')"
            class="my-6">
          </VPlaceholderSection>
        </div>
      </template>
    </VFlexTable>
    <VFlexPagination v-if="(itemHistoriesList.length != 0 && paginationVar.max_page != 1)"
      :current-page="paginationVar.page" :item-per-page="paginationVar.per_page" :max-links-displayed="3"
      :total-items="paginationVar.total" class="mt-6" no-router @update:current-page="getItemHistoriesPerPage" />
    <h6 v-if="itemHistoriesList.length != 0 && !itemHistoryStore?.loading" class="pt-2 is-size-7">
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
        })
      }}</h6>
    <VPlaceloadText v-if="itemHistoryStore?.loading" :lines="1" class="mx-2" last-line-width="20%" />
  </VFlexTableWrapper>
  <InventoryMovementPrint :key="keyIncrement" :inventory-item-movement="selectedMovementForPrint" />
-
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
