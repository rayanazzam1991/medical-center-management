<script lang="ts">
import { useI18n } from 'vue-i18n'
import { defaultCategorySearchFilter, CategorySearchFilter, Category } from '/@src/models/Warehouse/Category/category'
import { defaultItemsInInventorySearchFilter } from '/@src/models/Warehouse/Item/item'
import { getFilterCategoriesList } from '/@src/services/Warehouse/Category/CategoryService'

export default defineComponent({
    props: {
        search_filter_popup: {
            default: false,
        },

    },
    emits: ['search_filter_popup', 'search', 'resetFilter'],
    setup(props, context) {
        const { t } = useI18n()
        const searchItemName = ref()
        const searchCategoryId = ref<number | undefined>()
        const searchParentCategoryId = ref<number | undefined>()
        const searchFilter = ref(defaultItemsInInventorySearchFilter)
        const allCategoriesList = ref<Category[]>([])
        const mainCategoriesList = ref<Category[]>([])
        const subCategoriesList = ref<Category[]>([])

        let search_filter_popup = computed({
            get: () => props.search_filter_popup as boolean,
            set(value) {
                value = false
                context.emit('search_filter_popup', value)

            },
        })
        const search = () => {
            let categoryCheck = allCategoriesList.value.find((category) => category.id === searchCategoryId.value && category.parent?.id === searchParentCategoryId.value)
            if (!categoryCheck)
                searchCategoryId.value = undefined

            searchFilter.value = {
                item_name: searchItemName.value,
                category_id: searchCategoryId.value,
                parent_category_id: searchParentCategoryId.value,
            }
            context.emit('search', searchFilter.value)
            search_filter_popup.value = false
        }
        const resetFilter = () => {
            searchItemName.value = undefined
            searchCategoryId.value = undefined
            searchParentCategoryId.value = undefined
            searchFilter.value.parent_category_id = undefined
            searchFilter.value.category_id = undefined
            searchFilter.value.item_name = undefined
            context.emit('resetFilter', searchFilter.value)
        }
        onMounted(async () => {
            let categoriesFilter = {} as CategorySearchFilter
            categoriesFilter.per_page = 500
            const allcategories = await getFilterCategoriesList(categoriesFilter)
            allCategoriesList.value = allcategories.categories
            mainCategoriesList.value = allCategoriesList.value.filter((category) => category.parent === null)
        })
        const getSubCategory = () => {
            let categoriesFilter = {} as CategorySearchFilter
            categoriesFilter.parent_id = searchParentCategoryId.value
            if (allCategoriesList.value) {
                const SubCategory = allCategoriesList.value.filter((category) => category.parent?.id == categoriesFilter.parent_id)
                subCategoriesList.value = SubCategory
                searchCategoryId.value = undefined

                if (subCategoriesList.value.length <= 0 || searchParentCategoryId.value == undefined) {
                    searchCategoryId.value = undefined
                }
            }
        }

        return { t, search, resetFilter, search_filter_popup, mainCategoriesList, getSubCategory, subCategoriesList, searchItemName, searchCategoryId, searchParentCategoryId }
    },
})
</script>

<template>
    <VModal :title="t('inventory.details.search_filter.title')" :open="search_filter_popup" actions="center"
        @close="search_filter_popup = false">
        <template #content>
            <form class="form-layout" @submit.prevent="search">
                <VField class="column filter">
                    <VControl icon="feather:search">
                        <input v-model="searchItemName" type="text" class="input "
                            :placeholder="t('inventory.details.search_filter.item')" />
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl>
                        <div class="select">
                            <select @change="getSubCategory" v-model="searchParentCategoryId">
                                <VOption :value="undefined">{{ t('inventory.details.search_filter.level_1') }}</VOption>
                                <VOption v-for="parent in mainCategoriesList" :key="parent.id" :value="parent.id">
                                    {{ parent.name }}
                                </VOption>
                            </select>

                        </div>
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl>
                        <VSelect :disabled="subCategoriesList.length <= 0 || searchParentCategoryId == undefined"
                            v-model="searchCategoryId" class="">
                            <VOption value="">{{ t('inventory.details.search_filter.level_2') }}</VOption>
                            <VOption v-for="sub_category in subCategoriesList" :key="sub_category.id"
                                :value="sub_category.id">{{
                                    sub_category.name
                                }}
                            </VOption>
                        </VSelect>
                    </VControl>
                </VField>
            </form>
        </template>
        <template #action="{ close }">
            <VButton icon="fas fa-filter" color="primary" raised @click="search">{{ t('modal.buttons.filter') }}</VButton>
        </template>
</VModal>
</template>

