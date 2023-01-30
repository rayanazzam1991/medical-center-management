<script lang="ts">
import { useI18n } from "vue-i18n"
import { defaultInventorySearchFilter, Inventory, InventoryConsts, InventorySearchFilter } from "/@src/models/Warehouse/Inventory/inventory"
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
        const searchName = ref('')
        const searchActionBy = ref()
        const searchStatus = ref()
        const searchFilter = ref(defaultInventorySearchFilter)
        const test = ref()
        let search_filter_popup = computed({
            get: () => props.search_filter_popup as boolean,
            set(value) {
                value = false
                context.emit('search_filter_popup', value)
            },
        })
        const search = () => {
            searchFilter.value = {
                name: searchName.value,
                action_by: searchActionBy.value,
                status: searchStatus.value,
            }
            context.emit('search', searchFilter.value)
            search_filter_popup.value = false
        }
        const resetFilter = () => {
            searchName.value = ''
            searchActionBy.value = undefined
            searchStatus.value = undefined
            searchFilter.value.name = undefined
            searchFilter.value.action_by = undefined
            searchFilter.value.status = undefined
            context.emit('resetFilter', searchFilter.value)
        }
        const inventoriesList = ref<Inventory[]>([])
        onMounted(async () => {
            let inventorySearchFilter = {} as InventorySearchFilter
            const { inventories } = await getInventoriesList(inventorySearchFilter)
            inventoriesList.value = inventories
        })
        return {t , inventoriesList, InventoryConsts, search, resetFilter, search_filter_popup, searchName, searchActionBy, searchStatus }
    },
})


</script>

<template>
    <VModal :title="t('inventory.search_filter.title')" :open="search_filter_popup" actions="center" @close="search_filter_popup = false">
        <template #content>
            <form class="form-layout" @submit.prevent="search">
                <VField class="column filter">
                    <VControl icon="feather:search">
                        <input v-model="searchName" type="text" class="input " :placeholder="t('inventory.search_filter.name')" />
                    </VControl>
                </VField>
                <!-- <VField class="column filter">
                    <VControl icon="feather:search">
                        <input v-model="searchActionBy" type="text" class="input " :placeholder="t('inventory.search_filter.action_by')" />
                    </VControl>
                </VField> -->
                <VField class="column filter ">
                    <VControl>
                        <VSelect v-model="searchStatus" class="">
                            <VOption value="">{{t('inventory.search_filter.status')}}</VOption>
                            <VOption value="0">{{ InventoryConsts.showStatusName(0) }}</VOption>
                            <VOption value="1">{{ InventoryConsts.showStatusName(1) }}</VOption>
                        </VSelect>
                    </VControl>
                </VField>
                <VButton type="submit" @click="search" class="is-hidden" />

            </form>
        </template>
        <template #action="{ close }">
            <VButton icon="fas fa-filter" color="primary" raised @click="search">{{t('modal.buttons.filter')}}</VButton>
        </template>
    </VModal>
</template>


