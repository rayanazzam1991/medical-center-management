<script lang="ts">
import { useI18n } from "vue-i18n"
import {  ItemConsts, Item, ItemSearchFilter } from "/@src/models/Warehouse/Item/item"
import { defaultInventoryItemHistorySearchFilter } from "../../../../models/Warehouse/ItemHistory/inventoryItemHistory"
import { getItemsList } from '/@src/services/Warehouse/Item/itemService'
import { BaseConsts } from "/@src/utils/consts/base"
import { Inventory, InventorySearchFilter } from "/@src/models/Warehouse/Inventory/inventory"
import { getInventoriesList } from "/@src/services/Warehouse/Inventory/inventoryService"


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
        }

    },
    emits: ['search_filter_popup', 'search', 'resetFilter'],
    setup(props, context) {
        const {t} = useI18n()
        const searchItem = ref()
        const searchFromInventory = ref()
        const searchToInventory = ref()
        const searchDateBetween = ref()
        const searchFrom = ref()
        const searchTo = ref()
        const searchFilter = ref(defaultInventoryItemHistorySearchFilter)
        const itemsList = ref<Item[]>([])
        const inventoriesList = ref<Inventory[]>([])


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
                date_between: 'created_at',
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
            searchFilter.value.item_id = undefined
            searchFilter.value.from_inventory = undefined
            searchFilter.value.to_inventory = undefined
            searchFilter.value.date_between = undefined
            searchFilter.value.from = undefined
            searchFilter.value.to = undefined
            context.emit('resetFilter', searchFilter.value)
        }
        onMounted(async () => {
            let itemSearchFilter = {} as ItemSearchFilter
            itemSearchFilter.status = BaseConsts.ACTIVE
            const { items } = await getItemsList(itemSearchFilter)
            itemsList.value = items

            let inventorySearchFilter = {} as InventorySearchFilter
            inventorySearchFilter.status= BaseConsts.ACTIVE
            const { inventories } = await getInventoriesList(inventorySearchFilter)
            inventoriesList.value = inventories
        })
        return {t , inventoriesList, itemsList,  ItemConsts, search, resetFilter, search_filter_popup, searchItem, searchFromInventory,  searchFrom, searchTo, searchToInventory}
    },
})


</script>

<template>
    <VModal :title="t('list_internal_movement.search_filter.title')" :open="search_filter_popup" actions="center" @close="search_filter_popup = false">
        <template #content>
            <form class="form-layout" @submit.prevent="search">
                <VField class="column filter">
                    <VControl>
                        <VSelect  v-model="searchFromInventory">
                            <VOption value="">{{t('list_internal_movement.search_filter.select_from_inventory')}}</VOption>
                            <VOption v-for="inventory in inventoriesList" :key="inventory.id" :value="inventory.id">
                                {{ inventory.name }}
                            </VOption>
                        </VSelect>
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl>
                        <VSelect  v-model="searchToInventory">
                            <VOption value="">{{t('list_internal_movement.search_filter.select_to_inventory')}}</VOption>
                            <VOption v-for="inventory in inventoriesList" :key="inventory.id" :value="inventory.id">
                                {{ inventory.name }}
                            </VOption>
                        </VSelect>
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl>
                        <VSelect  v-model="searchItem">
                            <VOption value="">{{t('list_internal_movement.search_filter.select_item')}}</VOption>
                            <VOption v-for="item in itemsList" :key="item.id" :value="item.id">
                                {{ item.name }}
                            </VOption>
                        </VSelect>
                    </VControl>
                </VField>
                <div class="column filter columns-is-multiliine">
                    <h1 class="column-is-12">{{t('list_internal_movement.search_filter.create_date')}}</h1>
                    <VField class="column-is-6 filter">
                        <VLabel>{{t('list_internal_movement.search_filter.from')}}</VLabel>
                        <VControl icon="feather:chevrons-right">
                            <VInput v-model="searchFrom" type="date" />
                        </VControl>
                    </VField>
                    <VField class="column-is-6 filter">
                        <VLabel>{{t('list_internal_movement.search_filter.to')}}</VLabel>

                        <VControl icon="feather:chevrons-right">
                            <VInput v-model="searchTo" type="date" />
                        </VControl>
                    </VField>
                </div>
                <VButton type="submit" @click="search" class="is-hidden" />
            </form>
        </template>
        <template #action="{ close }">
            <VButton icon="fas fa-filter" color="primary" raised @click="search">{{t('modal.buttons.filter')}}</VButton>
        </template>
    </VModal>
</template>


