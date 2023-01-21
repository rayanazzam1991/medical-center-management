<script lang="ts">
import { useI18n } from "vue-i18n"
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
        const {t} = useI18n()
        const searchItem = ref()
        const searchParent = ref()
        const searchSubCategory = ref()
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
            let categorySearchFilter = {} as CategorySearchFilter
            categorySearchFilter.per_page = 500
            const allcategories = await getFilterCategoriesList(categorySearchFilter)
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
            let itemSearchFilter = {} as ItemSearchFilter
            itemSearchFilter.per_page = 500

            const { items } = await getItemsList(itemSearchFilter)
            allItemsList.value = items
            let ItemFilter = {} as ItemSearchFilter
            ItemFilter.category_id = selectedSubCategoryId.value
            const Item = allItemsList.value.filter((item) => item.category.id == ItemFilter.category_id)
            itemsList.value = Item
        }
        return {t , selectedSubCategoryId, getItemBySubCategroy, itemsList, subCategoriesList, getSubCategory, mainCategoriesList, ItemConsts, search, resetFilter, search_filter_popup, searchItem, searchParent,  searchFrom, searchTo, searchSubCategory, searchType }
    },
})


</script>

<template>
    <VModal :title="t('list_stock_movement.search_filter.title')" :open="search_filter_popup" actions="center" @close="search_filter_popup = false">
        <template #content>
            <form class="form-layout" @submit.prevent="search">
                <VField class="column filter">
                    <VControl>
                        <div class="select">
                            <select @change="getSubCategory" v-model="searchParent">
                                <VOption>{{t('list_stock_movement.search_filter.select_level_1')}}</VOption>
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
                            <VOption value="">{{t('list_stock_movement.search_filter.select_level_2')}}</VOption>
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
                            <VOption value="">{{t('list_stock_movement.search_filter.select_item')}}</VOption>
                            <VOption v-for="item in itemsList" :key="item.id" :value="item.id">
                                {{ item.name }}
                            </VOption>
                        </VSelect>
                    </VControl>
                </VField>
                <VField class="column filter ">
                    <VControl>
                        <VSelect v-model="searchType" class="">
                            <VOption value="">{{t('list_stock_movement.search_filter.select_type')}}</VOption>
                            <VOption value="in">{{t('list_stock_movement.search_filter.in')}}</VOption>
                            <VOption value="out">{{t('list_stock_movement.search_filter.out')}}</VOption>
                        </VSelect>
                    </VControl>
                </VField>
                <div class="column filter columns-is-multiliine">
                    <h1 class="column-is-12">{{t('list_stock_movement.search_filter.create_date')}}</h1>
                    <VField class="column-is-6 filter">
                        <VLabel>{{t('list_stock_movement.search_filter.from')}}</VLabel>
                        <VControl icon="feather:chevrons-right">
                            <VInput v-model="searchFrom" type="date" />
                        </VControl>
                    </VField>
                    <VField class="column-is-6 filter">
                        <VLabel>{{t('list_stock_movement.search_filter.to')}}</VLabel>

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


