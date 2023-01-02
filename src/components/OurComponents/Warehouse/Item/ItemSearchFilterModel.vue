<script lang="ts">
import { defaultMainCategorySearchFilter, Category, defaultCategorySearchFilter, defaultSubCategorySearchFilter } from "/@src/models/Warehouse/Category/category"
import { defaultItemSearchFilter, ItemConsts, Item } from "/@src/models/Warehouse/Item/item"
import { getCategoriesList } from "/@src/services/Warehouse/Category/CategoryService"
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
        const searchName = ref('')
        const searchParent = ref()
        const searchSubCategory = ref()
        const searchStatus = ref()
        const searchFilter = ref(defaultItemSearchFilter)
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
                category_id: searchParent.value,
                sub_category_id: searchSubCategory.value,
                status: searchStatus.value,
            }
            context.emit('search', searchFilter.value)
            search_filter_popup.value = false
        }
        const resetFilter = () => {
            searchName.value = ''
            searchParent.value = undefined
            searchStatus.value = undefined
            searchFilter.value.name = undefined
            searchFilter.value.category_id = undefined
            searchFilter.value.sub_category_id = undefined
            searchFilter.value.status = undefined
            context.emit('resetFilter', searchFilter.value)
        }
        const getMainCategory = () => {
            const MainCaegory = CategoriesList.value.filter((parent) => parent.parent === null)
            return MainCaegory
        }
        const getSubCategory = () => {
            const SubCaegory = CategoriesList.value.filter((parent) => parent.parent != null)
            return SubCaegory
        }
        const CategoriesList = ref<Category[]>([])
        const mainCategoriesList = ref<Category[]>([])
        const subCategoriesList = ref<Category[]>([])
        onMounted(async () => {
            const allcategories = await getCategoriesList(defaultCategorySearchFilter)
            CategoriesList.value = allcategories.categories
            mainCategoriesList.value = getMainCategory()
            subCategoriesList.value = getSubCategory()
        })
        return { subCategoriesList, mainCategoriesList, ItemConsts, search, resetFilter, search_filter_popup, searchName, searchParent, searchStatus, searchSubCategory }
    },
})




</script>

<template>
    <VModal title="Search Item" :open="search_filter_popup" actions="center" @close="search_filter_popup = false">
        <template #content>
            <form class="form-layout" @submit.prevent="search">
                <VField class="column filter">
                    <VControl icon="feather:search">
                        <input v-model="searchName" type="text" class="input " placeholder="Name..." />
                    </VControl>
                </VField>

                <VField class="column filter">
                    <VControl>
                        <VSelect v-model="searchParent" class="">
                            <VOption value="">Category</VOption>
                            <VOption v-for="parent in mainCategoriesList" :key="parent.id" :value="parent.id">{{
        parent.name
}}
                            </VOption>
                        </VSelect>
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl>
                        <VSelect v-model="searchSubCategory" class="">
                            <VOption value="">Sub_Category</VOption>
                            <VOption v-for="sub_category in subCategoriesList" :key="sub_category.id"
                                :value="sub_category.id">{{
        sub_category.name
}}
                            </VOption>
                        </VSelect>
                    </VControl>
                </VField>
                <VField class="column filter ">
                    <VControl>
                        <VSelect v-model="searchStatus" class="">
                            <VOption value="">Status</VOption>
                            <VOption value="0">{{ ItemConsts.showStatusName(0) }}</VOption>
                            <VOption value="1">{{ ItemConsts.showStatusName(1) }}</VOption>
                        </VSelect>
                    </VControl>
                </VField>
                <VButton type="submit" @click="search" class="is-hidden" />

            </form>
        </template>
        <template #action="{ close }">
            <VButton icon="fas fa-filter" color="primary" raised @click="search">Filter</VButton>
        </template>
    </VModal>
</template>


