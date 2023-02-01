<script lang="ts">
import { defaultItemHistorySearchFilter, ItemHistorySearchFilter, ItemHsitoryConsts } from "../../../../models/Warehouse/ItemHistory/inventoryItemHistory"
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
            context.emit('onOpen', searchFilterPop.value)
        }
        const popUpTrigger = (value: boolean) => {
            searchFilterPop.value = value
        }
        const default_per_page = props.default_per_page
        const pagination = props.pagination
        const searchFilterPop = ref(false)
        const searchName = ref('')
        const perPage = ref(pagination.per_page)
        const searchFilter = ref(defaultItemHistorySearchFilter)
        const is_reseted = ref(false)
        const keyIncrement = ref(0)
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
            searchFilter.value.from = undefined
            searchFilter.value.to = undefined
            is_reseted.value = true
            keyIncrement.value++
            context.emit('resetFilter', searchFilter.value)
        }
        const resetFilter_popup = (value: ItemHistorySearchFilter) => {
            searchFilter.value.type = undefined
            searchFilter.value.from = undefined
            searchFilter.value.to = undefined
            context.emit('resetFilter', searchFilter.value)
        }

        return {
            searchFilterPop, default_per_page, keyIncrement, search_filter,
            resetFilter_popup, onOpen, popUpTrigger, resetFilter, search, searchName,
            perPage, pagination
        }
    },


})
</script>
<template>
    <form class="form-layout">
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <ItemHistorySearchFilterModel :key="keyIncrement" :search_filter_popup="searchFilterPop"
            @search_filter_popup="popUpTrigger" @search="search_filter" @resetFilter="resetFilter_popup" />
    </form>
</template>

<style scoped  lang="scss">
@import '/@src/scss/styles/tableHeader.scss';
</style>
