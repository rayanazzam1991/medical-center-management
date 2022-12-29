<script lang="ts">
import { defaultCategorySearchFilter, CategorySearchFilter, CategoryConsts } from "/@src/models/Warehouse/Category/category"
import { defaultPagination } from "/@src/utils/response"



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
        pagination: {
            default: defaultPagination,
        },
        default_per_page: {
            type: Number,
            default: 1,
        }

    },

    setup(props, context) {
        const onOpen = () => {
            searchFilterPop.value = !searchFilterPop.value
            quickSearchField.value = ''
            context.emit('onOpen', searchFilterPop.value)
        }
        const popUpTrigger = (value: boolean) => {
            searchFilterPop.value = value
        }
        const default_per_page = props.default_per_page
        const pagination = props.pagination
        const searchFilterPop = ref(false)
        const searchName = ref('')
        const searchPrice = ref()
        const searchDuration = ref()
        const perPage = ref(pagination.per_page)
        const searchStatus = ref()
        const searchFilter = ref(defaultCategorySearchFilter)
        const is_reseted = ref(false)
        const keyTest = ref(0)
        const quickSearchField = ref('')
        const quickSearch = () => {
            if (quickSearchField.value != '') {

                searchFilter.value.name = quickSearchField.value
            } else {
                searchFilter.value.name = undefined
            }
            searchFilter.value.per_page = perPage.value

            search()
        }
        function isNumber(str: string): boolean {
            if (typeof str !== 'string') {
                return false;
            }

            if (str.trim() === '') {
                return false;
            }

            return !Number.isNaN(Number(str));
        }

        const search = () => {
            searchFilter.value.per_page = perPage.value
            searchFilter.value.is_main_category = undefined
            context.emit('search', searchFilter.value)
        }
        const search_filter = (value: CategorySearchFilter) => {
            searchFilter.value = value
            searchFilter.value.per_page = perPage.value
            searchFilter.value.is_main_category = undefined

            context.emit('search', searchFilter.value)
        }
        const resetFilter = () => {
            searchFilter.value.name = undefined
            searchFilter.value.status = undefined
            searchFilter.value.parent_id = undefined
            searchFilter.value.is_main_category = undefined

            quickSearchField.value = ''
            is_reseted.value = true
            keyTest.value++
            context.emit('resetFilter', searchFilter.value)

        }
        const resetFilter_popup = (value: CategorySearchFilter) => {
            searchFilter.value.name = undefined
            searchFilter.value.parent_id = undefined
            searchFilter.value.status = undefined
            searchFilter.value.is_main_category = undefined
            context.emit('resetFilter', searchFilter.value)
        }

        return { searchFilterPop, default_per_page, keyTest, search_filter, resetFilter_popup, onOpen, popUpTrigger, resetFilter, search, searchName, searchStatus, searchDuration, searchPrice, perPage, pagination, CategoryConsts, quickSearch, quickSearchField }
    },


})




</script>

<template>
    <form class="form-layout" v-on:submit.prevent="quickSearch">
        <div class="form-outer">
            <div class="form-header stuck-header">
                <div class="form-header-inner">
                    <div class="left my-4 mx-2 ">
                        <div class="columns is-flex is-align-items-center">
                            <VControl class="mr-2" icon="feather:search">
                                <VInput v-model="quickSearchField" type="text" placeholder="Name..." />
                            </VControl>
                            <VIconButton class="mr-2" @click.prevent="onOpen" icon="fas fa-filter" />
                            <VIconButton class="mr-2" v-on:click="resetFilter" icon="feather:rotate-ccw" :raised="false"
                                color="danger" />
                        </div>
                    </div>
                    <div class="left my-4 mx-2">
                        <div class="columns is-flex is-align-items-center">
                            <VControl class="mr-2 ">
                                <div class="select">

                                    <select v-model="perPage" @change="search">
                                        <VOption :value="default_per_page * 0.1">{{ default_per_page * 0.1 }}
                                        </VOption>
                                        <VOption :value="default_per_page * 0.5">{{ default_per_page * 0.5 }}
                                        </VOption>
                                        <VOption :value="default_per_page">{{ default_per_page }}
                                        </VOption>
                                        <VOption :value="default_per_page * 2">{{ default_per_page * 2 }}
                                        </VOption>
                                        <VOption :value="default_per_page * 10">{{ default_per_page * 10 }}
                                        </VOption>
                                    </select>
                                </div>
                            </VControl>
                            <VControl>
                                <VButton class="" to="/category/add" color="primary">{{ button_name }}
                                </VButton>
                            </VControl>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <CategorySearchFilterModel :search_filter_popup="searchFilterPop" @search_filter_popup="popUpTrigger"
            @search="search_filter" @resetFilter="resetFilter_popup" />
    </form>
</template>

<style scoped  lang="scss">
@import '/@src/scss/styles/tableHeader.scss';
</style>
