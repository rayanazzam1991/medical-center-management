<script lang="ts">
import { useI18n } from "vue-i18n"
import { defaultMainCategorySearchFilter, Category, defaultCategorySearchFilter, defaultSubCategorySearchFilter, CategorySearchFilter } from "/@src/models/Warehouse/Category/category"
import { defaultItemSearchFilter, ItemConsts, Item } from "/@src/models/Warehouse/Item/item"
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
        const searchName = ref('')
        const searchParent = ref()
        const searchSubCategory = ref()
        const searchStatus = ref()
        const searchFilter = ref(defaultItemSearchFilter)
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
            searchSubCategory.value = undefined
            searchStatus.value = undefined
            searchFilter.value.name = undefined
            searchFilter.value.sub_category_id = undefined
            searchFilter.value.category_id = undefined
            searchFilter.value.status = undefined
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
        return {t , subCategoriesList, getSubCategory, mainCategoriesList, ItemConsts, search, resetFilter, search_filter_popup, searchName, searchParent, searchStatus, searchSubCategory }
    },
})


</script>

<template>
    <VModal :title="t('item.search_filter.title')" :open="search_filter_popup" actions="center" @close="search_filter_popup = false">
        <template #content>
            <form class="form-layout" @submit.prevent="search">
                <VField class="column filter">
                    <VControl icon="feather:search">
                        <input v-model="searchName" type="text" class="input " :placeholder="t('item.search_filter.name')" />
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl>
                        <div class="select">
                            <select @change="getSubCategory" v-model="searchParent">
                                <VOption >{{t('item.search_filter.level_1')}}</VOption>
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
                            v-model="searchSubCategory" class="">
                            <VOption value="">{{t('item.search_filter.level_2')}}</VOption>
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
                            <VOption value="">{{t('item.search_filter.status')}}</VOption>
                            <VOption value="0">{{ ItemConsts.showStatusName(0) }}</VOption>
                            <VOption value="1">{{ ItemConsts.showStatusName(1) }}</VOption>
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


