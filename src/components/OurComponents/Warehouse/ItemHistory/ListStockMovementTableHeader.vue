<script lang="ts">
import { useI18n } from "vue-i18n"
import { defaultItemSearchFilter, ItemSearchFilter, ItemConsts } from "/@src/models/Warehouse/Item/item"
import { defaultItemHistorySearchFilter, ItemHistorySearchFilter } from "/@src/models/Warehouse/ItemHistory/itemHistory"
import { defaultPagination } from "/@src/utils/response"



export default defineComponent({
    props: {
        title: {
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
        const {t} = useI18n()
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
        const searchType = ref('')
        const perPage = ref(pagination.per_page)
        const searchFilter = ref(defaultItemHistorySearchFilter)
        const is_reseted = ref(false)
        const keyIncrement = ref(0)
        const quickSearchField = ref('')
        const quickSearch = () => {
            if (quickSearchField.value != '') {

                searchFilter.value.type = quickSearchField.value
            } else {
                searchFilter.value.type = undefined
            }
            searchFilter.value.per_page = perPage.value

            search()
        }
        const search = () => {
            searchFilter.value.per_page = perPage.value
            context.emit('search', searchFilter.value)
        }
        const search_filter = (value: ItemHistorySearchFilter) => {
            searchFilter.value = value
            searchFilter.value.per_page = perPage.value

            context.emit('search', searchFilter.value)
        }
        const resetFilter = () => {
            searchFilter.value.type = undefined
            searchFilter.value.status = undefined
            searchFilter.value.category_id = undefined
            searchFilter.value.sub_category_id = undefined
            searchFilter.value.item_id = undefined
            searchFilter.value.from = undefined
            searchFilter.value.to = undefined
            quickSearchField.value = ''
            is_reseted.value = true
            keyIncrement.value++
            context.emit('resetFilter', searchFilter.value)
        }
        const resetFilter_popup = (value: ItemHistorySearchFilter) => {
            searchFilter.value.type = undefined
            searchFilter.value.status = undefined
            searchFilter.value.category_id = undefined
            searchFilter.value.sub_category_id = undefined
            searchFilter.value.item_id = undefined
            searchFilter.value.from = undefined
            searchFilter.value.to = undefined
            context.emit('resetFilter', searchFilter.value)
        }

        return {t , searchFilterPop, default_per_page, keyIncrement, search_filter, resetFilter_popup, onOpen, popUpTrigger, resetFilter, search, searchType, perPage, pagination, ItemConsts, quickSearch, quickSearchField }
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
                            <VControl class="mr-4">
                                <VButton class="" to="/add-quantity" color="primary">{{t('list_stock_movement.add_quantity_button')}}
                                </VButton>
                            </VControl>
                            <VControl>
                                <VButton class="" to="/withdraw-quantity" color="primary">{{t('list_stock_movement.withdraw_quantity_button')}}
                                </VButton>
                            </VControl>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <ListStockeMovementSearchFilterModel :key="keyIncrement" :search_filter_popup="searchFilterPop"
            @search_filter_popup="popUpTrigger" @search="search_filter" @resetFilter="resetFilter_popup" />
    </form>
</template>

<style scoped  lang="scss">
@import '/@src/scss/styles/tableHeader.scss';
</style>
