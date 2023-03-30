<script lang="ts">
import { useI18n } from "vue-i18n"
import { ItemConsts, Item, ItemSearchFilter } from "/@src/models/Warehouse/Item/item"
import { defaultInventoryItemHistorySearchFilter, InventoryItemHistoryConsts } from "../../../../models/Warehouse/ItemHistory/inventoryItemHistory"
import { getItemsList } from '/@src/services/Warehouse/Item/itemService'
import { BaseConsts } from "/@src/utils/consts/base"
import { Inventory, InventorySearchFilter } from "/@src/models/Warehouse/Inventory/inventory"
import { getInventoriesList } from "/@src/services/Warehouse/Inventory/inventoryService"
import { Employee, EmployeeSearchFilter } from "/@src/models/Employee/employee"
import { getEmployeesList } from "/@src/services/Employee/employeeService"
import { Supplier, SupplierSearchFilter } from "/@src/models/Others/Supplier/supplier"
import { getSuppliersList } from "/@src/services/Others/Supplier/supplierService"


export default defineComponent({
  props: {
    title: {
      type: String,
      default: '',
    },
    button_name: {
      type: String,
      default: '',
    },
    search_filter_popup: {
      default: false,
    },
    is_reseted: {
      type: Boolean,
      default: false,
    },
    is_for_item: {
      type: Boolean,
      default: false,
    },
    suppliers_only: {
      type: Boolean,
      default: false,
    },

  },
  emits: ['search_filter_popup', 'search', 'resetFilter'],
  setup(props, context) {
    const { t } = useI18n()
    const searchItem = ref()
    const searchAction = ref()
    const searchActionBy = ref()
    const searchType = ref()
    const searchFromInventory = ref()
    const searchToInventory = ref()
    const searchDateBetween = ref()
    const searchSupplierName = ref()
    const searchFrom = ref()
    const searchTo = ref()
    const searchFilter = ref(defaultInventoryItemHistorySearchFilter)
    const itemsList = ref<Item[]>([])
    const inventoriesList = ref<Inventory[]>([])
    const employeesList = ref<Employee[]>([])

    let search_filter_popup = computed({
      get: () => props.search_filter_popup as boolean,
      set(value) {
        value = false
        context.emit('search_filter_popup', value)
      },
    })
    const search = () => {
      searchFilter.value = {
        item_id: searchItem.value,
        from_inventory: searchFromInventory.value,
        to_inventory: searchToInventory.value,
        action: searchAction.value,
        action_by: searchActionBy.value,
        type: searchType.value,
        date_between: searchFrom.value && searchTo.value ? 'created_at' : undefined,
        from: searchFrom.value,
        to: searchTo.value,
        supplier_name: searchSupplierName.value
      }
      context.emit('search', searchFilter.value)
      search_filter_popup.value = false
    }
    const resetFilter = () => {
      searchItem.value = ''
      searchFromInventory.value = undefined
      searchToInventory.value = undefined
      searchDateBetween.value = undefined
      searchFrom.value = undefined
      searchTo.value = undefined
      searchAction.value = undefined
      searchActionBy.value = undefined
      searchType.value = undefined
      searchFilter.value.item_id = undefined
      searchFilter.value.from_inventory = undefined
      searchFilter.value.to_inventory = undefined
      searchFilter.value.date_between = undefined
      searchFilter.value.from = undefined
      searchFilter.value.to = undefined
      searchFilter.value.action = undefined
      searchFilter.value.action_by = undefined
      searchFilter.value.type = undefined
      searchFilter.value.supplier_name = undefined
      context.emit('resetFilter', searchFilter.value)
    }
    onMounted(async () => {
      let itemSearchFilter = {} as ItemSearchFilter
      itemSearchFilter.per_page = 500
      const { items } = await getItemsList(itemSearchFilter)
      itemsList.value = items

      let inventorySearchFilter = {} as InventorySearchFilter
      inventorySearchFilter.per_page = 500
      const { inventories } = await getInventoriesList(inventorySearchFilter)
      inventoriesList.value = inventories


      let employeeSearchFilter = {} as EmployeeSearchFilter
      employeeSearchFilter.per_page = 500
      const { employees } = await getEmployeesList(employeeSearchFilter)
      employeesList.value = employees

    })
    return { t, inventoriesList, employeesList, itemsList, InventoryItemHistoryConsts, ItemConsts, search, resetFilter,searchSupplierName, search_filter_popup, searchItem, searchFromInventory, searchFrom, searchTo, searchToInventory, searchAction, searchActionBy, searchType }
  },
})


</script>

<template>
  <VModal :title="t('list_inventory_movement.search_filter.title')" :open="search_filter_popup" actions="center"
    @close="search_filter_popup = false">
    <template #content>
      <form class="form-layout" @submit.prevent="search">
        <VField v-if="$props.suppliers_only" class="column filter">

          <VControl>
            <VInput v-model="searchSupplierName" type="text"
              :placeholder="t('list_inventory_movement.search_filter.supplier_name')" />
          </VControl>
        </VField>

        <VField v-if="!$props.suppliers_only" class="column filter">
          <VControl>
            <VSelect v-model="searchFromInventory">
              <VOption value="">{{ t('list_inventory_movement.search_filter.select_from_inventory') }}
              </VOption>
              <VOption v-for="inventory in inventoriesList" :key="inventory.id" :value="inventory.id">
                {{ inventory.name }}
              </VOption>
            </VSelect>
          </VControl>
        </VField>
        <VField v-if="!$props.suppliers_only" class="column filter">
          <VControl>
            <VSelect v-model="searchToInventory">
              <VOption value="">{{ t('list_inventory_movement.search_filter.select_to_inventory') }}
              </VOption>
              <VOption v-for="inventory in inventoriesList" :key="inventory.id" :value="inventory.id">
                {{ inventory.name }}
              </VOption>
            </VSelect>
          </VControl>
        </VField>
        <VField v-if="!$props.suppliers_only" class="column filter">
          <VControl>
            <VSelect v-model="searchType">
              <VOption value="">{{ t('list_inventory_movement.search_filter.select_movement_type') }}
              </VOption>
              <VOption v-for="(type, index) in InventoryItemHistoryConsts.TYPES" :key="type" :value="type">
                {{ InventoryItemHistoryConsts.getTypeName(type) }}
              </VOption>
            </VSelect>
          </VControl>
        </VField>
        <VField v-if="!$props.suppliers_only" class="column filter">
          <VControl>
            <VSelect v-model="searchAction">
              <VOption value="">{{ t('list_inventory_movement.search_filter.select_action') }}
              </VOption>
              <VOption v-for="(action, index) in InventoryItemHistoryConsts.ACTIONS" :key="action" :value="action">
                {{ InventoryItemHistoryConsts.getActionName(action) }}
              </VOption>
            </VSelect>
          </VControl>
        </VField>
        <VField v-if="!$props.is_for_item" class="column filter">
          <VControl>
            <VSelect v-model="searchItem">
              <VOption value="">{{ t('list_inventory_movement.search_filter.select_item') }}</VOption>
              <VOption v-for="item in itemsList" :key="item.id" :value="item.id">
                {{ item.name }}
              </VOption>
            </VSelect>
          </VControl>
        </VField>
        <VField class="column filter">
          <VControl>
            <VSelect v-model="searchActionBy">
              <VOption value="">{{ t('list_inventory_movement.search_filter.select_action_by') }}</VOption>
              <VOption v-for="employee in employeesList" :key="employee.id" :value="employee.user.id">
                {{ employee.user.first_name + ' ' + employee.user.last_name }}
              </VOption>
            </VSelect>
          </VControl>
        </VField>
        <div class="column filter columns-is-multiliine">
          <h1 class="column-is-12">{{ t('list_inventory_movement.search_filter.create_date') }}</h1>
          <VField class="column-is-6 filter">
            <VLabel>{{ t('list_inventory_movement.search_filter.from') }}</VLabel>
            <VControl icon="feather:chevrons-right">
              <VInput v-model="searchFrom" type="date" />
            </VControl>
          </VField>
          <VField class="column-is-6 filter">
            <VLabel>{{ t('list_inventory_movement.search_filter.to') }}</VLabel>

            <VControl icon="feather:chevrons-right">
              <VInput v-model="searchTo" type="date" />
            </VControl>
          </VField>
        </div>
        <VButton type="submit" @click="search" class="is-hidden" />
      </form>
    </template>
    <template #action="{ close }">
      <VButton icon="fas fa-filter" color="primary" raised @click="search">{{ t('modal.buttons.filter') }}</VButton>
    </template>
  </VModal>
</template>


