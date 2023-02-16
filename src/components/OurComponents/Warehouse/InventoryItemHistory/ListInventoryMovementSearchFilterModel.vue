<script lang="ts">
import { useI18n } from "vue-i18n"
import { ItemConsts, Item, ItemSearchFilter } from "/@src/models/Warehouse/Item/item"
import { defaultInventoryItemHistorySearchFilter } from "../../../../models/Warehouse/ItemHistory/inventoryItemHistory"
import { getItemsList } from '/@src/services/Warehouse/Item/itemService'
import { BaseConsts } from "/@src/utils/consts/base"
import { Inventory, InventorySearchFilter } from "/@src/models/Warehouse/Inventory/inventory"
import { getInventoriesList } from "/@src/services/Warehouse/Inventory/inventoryService"
import { Employee, EmployeeSearchFilter } from "/@src/models/Employee/employee"
import { getEmployeesList } from "/@src/services/Employee/employeeService"


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
    has_item_filter: {
      type: Boolean,
      default: true
    }

  },
  emits: ['search_filter_popup', 'search', 'resetFilter'],
  setup(props, context) {
    const { t } = useI18n()
    const searchItem = ref()
    const searchAction = ref<'Add Quantity' | 'Withdraw Quantity' | 'Sell' | 'Return to main inventory' | 'Withdraw from main inventory' | undefined>()
    const searchActionBy = ref()
    const searchRequesterName = ref()
    const searchMovementType = ref<'Internal' | 'External' | undefined>()
    const searchFromInventory = ref()
    const searchToInventory = ref()
    const searchDateBetween = ref()
    const searchFrom = ref()
    const searchTo = ref()
    const searchFilter = ref(defaultInventoryItemHistorySearchFilter)
    const itemsList = ref<Item[]>([])
    const inventoriesList = ref<Inventory[]>([])
    const employeesList = ref<Employee[]>([])
    const hasItemFilter = props.has_item_filter

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
        movement_type: searchMovementType.value,
        requester_name: searchMovementType.value == "External" ? searchRequesterName.value : undefined,
        date_between: searchFrom.value && searchTo.value ? 'created_at' : undefined,
        from: searchFrom.value,
        to: searchTo.value,
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
      searchMovementType.value = undefined
      searchRequesterName.value = undefined
      searchFilter.value.item_id = undefined
      searchFilter.value.from_inventory = undefined
      searchFilter.value.to_inventory = undefined
      searchFilter.value.date_between = undefined
      searchFilter.value.from = undefined
      searchFilter.value.to = undefined
      searchFilter.value.action = undefined
      searchFilter.value.action_by = undefined
      searchFilter.value.requester_name = undefined
      searchFilter.value.movement_type = undefined
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
    return { t, inventoriesList, employeesList, hasItemFilter, itemsList, ItemConsts, search, resetFilter, search_filter_popup, searchItem, searchFromInventory, searchFrom, searchTo, searchToInventory, searchAction, searchActionBy, searchMovementType, searchRequesterName }
  },
})


</script>

<template>
  <VModal :title="t('list_inventory_movement.search_filter.title')" :open="search_filter_popup" actions="center"
    @close="search_filter_popup = false">
    <template #content>
      <form class="form-layout" @submit.prevent="search">
        <VField class="column filter">
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
        <VField class="column filter">
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
        <VField class="column filter">
          <VControl>
            <VSelect v-model="searchMovementType">
              <VOption value="">{{ t('list_inventory_movement.search_filter.select_movement_type') }}
              </VOption>
              <VOption value="Internal">
                {{ t('list_inventory_movement.table.movement_types.internal') }}
              </VOption>
              <VOption value="External">
                {{ t('list_inventory_movement.table.movement_types.external') }}
              </VOption>
            </VSelect>
          </VControl>
        </VField>
        <VField v-if="searchMovementType == 'External'" class="column filter">
          <VControl>
            <VSelect v-model="searchAction">
              <VOption value="">{{ t('list_inventory_movement.search_filter.select_action') }}
              </VOption>
              <VOption value="Add Quantity">
                {{ t('list_inventory_movement.table.action_types.add_quantity') }}
              </VOption>
              <VOption value="Withdraw Quantity">
                {{ t('list_inventory_movement.table.action_types.withdraw_quantity') }}
              </VOption>
              <!-- <VOption  value="Sell">
                                {{ t('list_inventory_movement.table.action_types.sell') }}
                            </VOption> -->
            </VSelect>
          </VControl>
        </VField>
        <VField v-if="searchMovementType == 'Internal'" class="column filter">
          <VControl>
            <VSelect v-model="searchAction">
              <VOption value="">{{ t('list_inventory_movement.search_filter.select_action') }}
              </VOption>
              <VOption value="Return to main inventory">
                {{ t('list_inventory_movement.table.action_types.return_to_main_inventory') }}
              </VOption>
              <VOption value="Withdraw from main inventory">
                {{ t('list_inventory_movement.table.action_types.withdraw_from_main_inventory') }}
              </VOption>
            </VSelect>
          </VControl>
        </VField>
        <VField v-if="searchMovementType == 'External'" class="column filter">
          <VControl>
            <VSelect v-model="searchRequesterName">
              <VOption value="">{{ t('list_inventory_movement.search_filter.select_requester_name') }}
              </VOption>
              <VOption v-for="employee in employeesList" :key="employee.id"
                :value="employee.user.first_name + ' ' + employee.user.last_name">
                {{ employee.user.first_name + ' ' + employee.user.last_name }}
              </VOption>
            </VSelect>
          </VControl>
        </VField>
        <VField v-if="hasItemFilter" class="column filter">
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


