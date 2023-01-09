<script lang="ts">
import { defaultMainCategorySearchFilter, Category, defaultCategorySearchFilter, defaultSubCategorySearchFilter, CategorySearchFilter } from "/@src/models/Warehouse/Category/category"
import { defaultItemSearchFilter, ItemConsts, Item, ItemSearchFilter } from "/@src/models/Warehouse/Item/item"
import { defaultItemHistorySearchFilter } from "/@src/models/Warehouse/ItemHistory/itemHistory"
import { getFilterCategoriesList } from "/@src/services/Warehouse/Category/CategoryService"
import { getItemsList } from '/@src/services/Warehouse/Item/itemService'


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
        const searchType = ref()
        const searchDateBetween = ref()
        const searchFrom = ref()
        const searchTo = ref()
        const searchFilter = ref(defaultItemHistorySearchFilter)


        let search_filter_popup = computed({
            get: () => props.search_filter_popup as boolean,
            set(value) {
                value = false
                context.emit('search_filter_popup', value)
            },
        })
        const search = () => {
            searchFilter.value = {
                type: searchType.value,
                date_between: 'created_at',
                from: searchFrom.value,
                to: searchTo.value,
            }
            context.emit('search', searchFilter.value)
            search_filter_popup.value = false
        }
        const resetFilter = () => {
            searchType.value = undefined
            searchDateBetween.value = undefined
            searchFrom.value = undefined
            searchTo.value = undefined
            searchFilter.value.date_between = undefined
            searchFilter.value.from = undefined
            searchFilter.value.to = undefined
            searchFilter.value.type = undefined
            context.emit('resetFilter', searchFilter.value)
        }
        return { ItemConsts, search, resetFilter, search_filter_popup, searchFrom, searchTo, searchType }
    },
})


</script>

<template>
    <VModal title="Search Item" :open="search_filter_popup" actions="center" @close="search_filter_popup = false">
        <template #content>
            <form class="form-layout" @submit.prevent="search">
                <VField class="column filter ">
                    <VControl>
                        <VSelect v-model="searchType" class="">
                            <VOption value="">Select Type</VOption>
                            <VOption value="in">In</VOption>
                            <VOption value="out">Out</VOption>
                        </VSelect>
                    </VControl>
                </VField>
                <div class="column filter columns-is-multiliine">
                    <h1 class="column-is-12">Create Date:</h1>
                    <VField class="column-is-6 filter">
                        <VLabel>From : </VLabel>
                        <VControl icon="feather:chevrons-right">
                            <VInput v-model="searchFrom" type="date" />
                        </VControl>
                    </VField>
                    <VField class="column-is-6 filter">
                        <VLabel>To : </VLabel>

                        <VControl icon="feather:chevrons-right">
                            <VInput v-model="searchTo" type="date" />
                        </VControl>
                    </VField>
                </div>
                <VButton type="submit" @click="search" class="is-hidden" />
            </form>
        </template>
        <template #action="{ close }">
            <VButton icon="fas fa-filter" color="primary" raised @click="search">Filter</VButton>
        </template>
    </VModal>
</template>


