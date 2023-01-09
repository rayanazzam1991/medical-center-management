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
        const searchItem = ref()
        const searchParent = ref()
        const searchSubCategory = ref()
        const searchStatus = ref()
        const searchType = ref()
        const searchDateBetween = ref()
        const searchFrom = ref()
        const searchTo = ref()
        const searchFilter = ref(defaultItemHistorySearchFilter)
        const allCategoriesList = ref<Category[]>([])
        const mainCategoriesList = ref<Category[]>([])
        const subCategoriesList = ref<Category[]>([])
        const allItemsList = ref<Item[]>([])
        const itemsList = ref<Item[]>([])
        const selectedSubCategoryId = ref()


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
                category_id: searchParent.value,
                sub_category_id: searchSubCategory.value,
                status: searchStatus.value,
                type: searchType.value,
                date_between: 'created_at',
                from: searchFrom.value,
                to: searchTo.value,
            }
            context.emit('search', searchFilter.value)
            search_filter_popup.value = false
        }
        const resetFilter = () => {
            searchItem.value = ''
            searchParent.value = undefined
            searchSubCategory.value = undefined
            searchStatus.value = undefined
            searchType.value = undefined
            searchDateBetween.value = undefined
            searchFrom.value = undefined
            searchTo.value = undefined
            searchFilter.value.item_id = undefined
            searchFilter.value.sub_category_id = undefined
            searchFilter.value.category_id = undefined
            searchFilter.value.status = undefined
            searchFilter.value.date_between = undefined
            searchFilter.value.from = undefined
            searchFilter.value.to = undefined
            context.emit('resetFilter', searchFilter.value)
        }
        onMounted(async () => {
            const allcategories = await getFilterCategoriesList(defaultCategorySearchFilter)
            allCategoriesList.value = allcategories.categories
            mainCategoriesList.value = allCategoriesList.value.filter((category) => category.parent === null)
        })
        const getSubCategory = () => {
            let categoriesFilter = {} as CategorySearchFilter
            categoriesFilter.parent_id = searchParent.value
            const SubCategory = allCategoriesList.value.filter((category) => category.parent?.id == categoriesFilter.parent_id)
            subCategoriesList.value = SubCategory
        }
        const getItemBySubCategroy = async () => {
            const { items } = await getItemsList(defaultItemSearchFilter)
            allItemsList.value = items
            let ItemFilter = {} as ItemSearchFilter
            ItemFilter.category_id = selectedSubCategoryId.value
            const Item = allItemsList.value.filter((item) => item.category.id == ItemFilter.category_id)
            itemsList.value = Item
        }
        return { selectedSubCategoryId, getItemBySubCategroy, itemsList, subCategoriesList, getSubCategory, mainCategoriesList, ItemConsts, search, resetFilter, search_filter_popup, searchItem, searchParent, searchStatus, searchFrom, searchTo, searchSubCategory, searchType }
    },
})


</script>

<template>
    <VModal title="Search Item" :open="search_filter_popup" actions="center" @close="search_filter_popup = false">
        <template #content>
            <form class="form-layout" @submit.prevent="search">
                <VField class="column filter">
                    <VControl>
                        <div class="select">
                            <select @change="getSubCategory" v-model="searchParent">
                                <VOption>Level 1</VOption>
                                <VOption v-for="parent in mainCategoriesList" :key="parent.id" :value="parent.id">
                                    {{ parent.name }}
                                </VOption>
                            </select>

                        </div>
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl>
                        <VSelect :disabled="subCategoriesList.length <= 0 && searchParent == undefined"
                            @change="getItemBySubCategroy" v-model="selectedSubCategoryId">
                            <VOption>Select Level 2</VOption>
                            <VOption v-for="subCategory in subCategoriesList" :key="subCategory.id"
                                :value="subCategory.id">
                                {{ subCategory.name }}
                            </VOption>
                        </VSelect>
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl>
                        <VSelect :disabled="itemsList.length <= 0" @change="getItemBySubCategroy" v-model="searchItem">
                            <VOption>Select Item</VOption>
                            <VOption v-for="item in itemsList" :key="item.id" :value="item.id">
                                {{ item.name }}
                            </VOption>
                        </VSelect>
                    </VControl>
                </VField>
                <VField class="column filter ">
                    <VControl>
                        <VSelect v-model="searchType" class="">
                            <VOption value="">Select Type</VOption>
                            <VOption value="in">In</VOption>
                            <VOption value="out">Out</VOption>
                        </VSelect>
                    </VControl>
                </VField>
                <VField class="column filter ">
                    <VControl>
                        <VSelect v-model="searchStatus" class="">
                            <VOption value="">Select Status</VOption>
                            <VOption value="0">{{ ItemConsts.showStatusName(0) }}</VOption>
                            <VOption value="1">{{ ItemConsts.showStatusName(1) }}</VOption>
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


