<script lang="ts">
import { useI18n } from "vue-i18n"
import { defaultInventorySearchFilter, InventoryConsts, InventorySearchFilter } from "/@src/models/Warehouse/Inventory/inventory"
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
        const searchName = ref('')
        const searchPrice = ref()
        const perPage = ref(pagination.per_page)
        const searchStatus = ref()
        const searchFilter = ref(defaultInventorySearchFilter)
        const is_reseted = ref(false)
        const keyIncrement = ref(0)
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
            searchFilter.value.page = 1
            context.emit('search', searchFilter.value)
        }
        const search_filter = (value: InventorySearchFilter) => {
            searchFilter.value = value
            searchFilter.value.per_page = perPage.value

            context.emit('search', searchFilter.value)
        }
        const resetFilter = () => {
            searchFilter.value.name = undefined
            searchFilter.value.status = undefined
            searchFilter.value.action_by = undefined
            quickSearchField.value = ''
            is_reseted.value = true
            keyIncrement.value++
            context.emit('resetFilter', searchFilter.value)

        }
        const resetFilter_popup = (value: InventorySearchFilter) => {
            searchFilter.value.name = undefined
            searchFilter.value.action_by = undefined
            searchFilter.value.status = undefined
            context.emit('resetFilter', searchFilter.value)
        }

        return {  t , searchFilterPop, default_per_page, keyIncrement, search_filter, resetFilter_popup, onOpen, popUpTrigger, resetFilter, search, searchName, searchStatus, searchPrice, perPage, pagination, InventoryConsts, quickSearch, quickSearchField }
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
                                <VInput v-model="quickSearchField" type="text" :placeholder="t('inventory.search_filter.name')" />
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <InventorySearchFilterModel :key="keyIncrement" :search_filter_popup="searchFilterPop"
            @search_filter_popup="popUpTrigger" @search="search_filter" @resetFilter="resetFilter_popup" />
    </form>
</template>

<style scoped  lang="scss">
@import '/@src/scss/styles/tableHeader.scss';
</style>
