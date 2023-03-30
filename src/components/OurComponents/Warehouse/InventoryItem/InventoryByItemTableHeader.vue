<script lang="ts">
import { useI18n } from 'vue-i18n'
import { InventoryByItemSearchFilter } from '/@src/models/Warehouse/InventoryItem/inventoryItem'
import { resetInventoryByItemSearchFilter } from '/@src/services/Warehouse/InventoryItem/inventoryItemService'
import { defaultPagination } from '/@src/utils/response'





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
        },
    },


    setup(props, context) {
        const { t } = useI18n()
        const searchInventoryName = ref()
        const searchQuantity = ref()
        const default_per_page = props.default_per_page
        const pagination = props.pagination
        const perPage = ref(pagination.per_page)
        const searchFilter = ref(resetInventoryByItemSearchFilter())
        const is_reseted = ref(false)
        const keyIncrement = ref(0)

        const search = () => {
            searchFilter.value.per_page = perPage.value
            searchFilter.value.inventory_name = searchInventoryName.value
            searchFilter.value.quantity = searchQuantity.value
            searchFilter.value.page = 1
            context.emit('search', searchFilter.value)
        }
        const search_filter = (value: InventoryByItemSearchFilter) => {
            searchFilter.value = value
            searchFilter.value.per_page = perPage.value
            searchFilter.value.inventory_name = searchInventoryName.value
            searchFilter.value.quantity = searchQuantity.value
            context.emit('search', searchFilter.value)
        }

        const resetFilter = () => {
            searchFilter.value.inventory_name = undefined
            searchFilter.value.quantity = undefined
            searchInventoryName.value = undefined
            searchQuantity.value = undefined
            is_reseted.value = true
            keyIncrement.value++
            context.emit('resetFilter', searchFilter.value)

        }
        const resetFilter_popup = () => {
            searchFilter.value.inventory_name = undefined
            searchFilter.value.quantity = undefined
            searchQuantity.value = undefined
            searchInventoryName.value = undefined
            context.emit('resetFilter', searchFilter.value)

        }
        return { t, keyIncrement, is_reseted, default_per_page, searchQuantity, searchInventoryName, resetFilter_popup, search_filter, resetFilter, search, perPage, pagination }
    },
})
</script>

<template>
    <form class="form-layout" v-on:submit.prevent="search">
        <div class="form-outer">
            <div class="form-header stuck-header">
                <div class="form-header-inner">
                    <div class="left my-4 mx-2 ">
                        <div class="columns is-flex is-align-items-center">
                            <VControl class="mr-2" icon="feather:search">
                                <VInput v-model="searchInventoryName" type="text"
                                    :placeholder="t('inventories_by_item.search_filter.inventory_name')" />
                            </VControl>
                            <VControl class="mr-2" icon="feather:search">
                                <VInput v-model="searchQuantity" type="number"
                                    :placeholder="t('inventories_by_item.search_filter.quantity')" />
                            </VControl>
                            <VButton class="is-hidden" type="submit" />

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
    </form>
</template>

<style scoped  lang="scss">
@import '/@src/scss/styles/tableHeader.scss';
</style>
