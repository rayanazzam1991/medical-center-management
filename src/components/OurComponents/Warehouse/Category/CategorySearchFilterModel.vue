<script lang="ts">
import { PropType } from "vue"
import { useI18n } from "vue-i18n"
import { defaultCategorySearchFilter, CategoryConsts, Category, defaultMainCategorySearchFilter, CategorySearchFilter } from "/@src/models/Warehouse/Category/category"
import { getCategoriesList } from '/@src/services/Warehouse/Category/CategoryService'


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
        data:{
            type: Array as PropType<Category[]>
        }
    },
    emits: ['search_filter_popup', 'search', 'resetFilter'],
    setup(props, context) {
        const {t} = useI18n()
        const searchName = ref('')
        const searchParent = ref()
        const searchStatus = ref()
        const searchFilter = ref(defaultCategorySearchFilter)
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
                parent_id: searchParent.value,
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
            searchFilter.value.parent_id = undefined
            searchFilter.value.status = undefined
            context.emit('resetFilter', searchFilter.value)
        }
            const mainCategoriesList = ref<Category[]>([])
            const allCategoriesList = ref<Category[]>([])

            allCategoriesList.value = props.data!
            mainCategoriesList.value = allCategoriesList.value.filter((category) => category.parent === null)
        // onMounted(async () => {
        //     let mainCategorySearchFilter = {} as CategorySearchFilter
        //     mainCategorySearchFilter.is_main_category = true
        //     mainCategorySearchFilter.per_page = 500
        //     const { categories } = await getCategoriesList(mainCategorySearchFilter)
        //     mainCategoriesList.value = categories
        // })
        return {t , mainCategoriesList, CategoryConsts, search, resetFilter, search_filter_popup, searchName, searchParent, searchStatus }
    },
})


</script>

<template>
    <VModal :title="t('category.search_filter.title')" :open="search_filter_popup" actions="center" @close="search_filter_popup = false">
        <template #content>
            <form class="form-layout" @submit.prevent="search">
                <VField class="column filter">
                    <VControl icon="feather:search">
                        <input v-model="searchName" type="text" class="input " :placeholder="t('category.search_filter.name')" />
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl>
                        <VSelect v-model="searchParent" class="">
                            <VOption value="">{{t('category.search_filter.parent')}}</VOption>
                            <VOption v-for="parent in mainCategoriesList" :key="parent.id" :value="parent.id">{{
        parent.name
}}
                            </VOption>
                        </VSelect>
                    </VControl>
                </VField>
                <VField class="column filter ">
                    <VControl>
                        <VSelect v-model="searchStatus" class="">
                            <VOption value="">{{t('category.search_filter.status')}}</VOption>
                            <VOption value="0">{{ CategoryConsts.showStatusName(0) }}</VOption>
                            <VOption value="1">{{ CategoryConsts.showStatusName(1) }}</VOption>
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


