<script lang="ts">
import { useI18n } from 'vue-i18n'
import { InventoryConsts } from '/@src/models/Warehouse/Inventory/inventory'
import { defaultItemsInInventorySearchFilter, ItemsInInventorySearchFilter } from '/@src/models/Warehouse/Item/item'
import { useItem } from '/@src/stores/Warehouse/Item/itemStore'
import { defaultPagination } from '/@src/utils/response'


export default defineComponent({
    props: {
        title: {
            type: String,
            default: '',
        },
        status: {
            type: Number,
            default: 1
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
        const onOpen = () => {
            searchFilterPop.value = !searchFilterPop.value
            itemNameSearchField.value = ''
            context.emit('onOpen', searchFilterPop.value)
        }
        const popUpTrigger = (value: boolean) => {
            searchFilterPop.value = value
        }
        const itemStore = useItem()
        const inventoryStatus = ref(InventoryConsts.ACTIVE)
        const inventoryName = ref('')
        inventoryStatus.value = props.status
        inventoryName.value = props.title
        const default_per_page = props.default_per_page
        const pagination = props.pagination
        const searchFilterPop = ref(false)
        const itemNameSearchField = ref('')
        const perPage = ref(pagination.per_page)
        const searchFilter = ref(defaultItemsInInventorySearchFilter)
        const is_reseted = ref(false)
        const keyIncrement = ref(0)

        const search = () => {
            searchFilter.value.per_page = perPage.value
            searchFilter.value.page = 1
            searchFilter.value.item_name = itemNameSearchField.value
            context.emit('search', searchFilter.value)
        }
        const search_filter = (value: ItemsInInventorySearchFilter) => {

            searchFilter.value = value
            searchFilter.value.per_page = perPage.value

            context.emit('search', searchFilter.value)
        }

        const resetFilter = () => {
            searchFilter.value.item_name = undefined
            searchFilter.value.category_id = undefined
            searchFilter.value.parent_category_id = undefined
            itemNameSearchField.value = ''
            is_reseted.value = true
            keyIncrement.value++

            context.emit('resetFilter', searchFilter.value)

        }
        const resetFilter_popup = () => {
            searchFilter.value.item_name = undefined
            searchFilter.value.category_id = undefined
            searchFilter.value.parent_category_id = undefined
            context.emit('resetFilter', searchFilter.value)

        }
        return { t, keyIncrement, itemStore, itemNameSearchField, is_reseted, default_per_page, onOpen, resetFilter_popup, search_filter, popUpTrigger, resetFilter, search, searchFilterPop, InventoryConsts, perPage, pagination, inventoryStatus, inventoryName }
    },
})
</script>

<template>
    <form class="form-layout" v-on:submit.prevent="search">
        <div class="form-outer">
            <div class="form-header stuck-header">
                <h1 class="title">
                    {{ inventoryName }} | <span
                        :class="inventoryStatus == InventoryConsts.ACTIVE ? 'has-text-success' : 'has-text-danger'">{{
                            InventoryConsts.showStatusName(inventoryStatus) }}</span>
                </h1>
                <div class="form-header-inner">
                    <div class="left my-4 mx-2 ">
                        <div class="columns is-flex is-align-items-center">
                            <VControl class="mr-2" icon="feather:search">
                                <VInput v-model="itemNameSearchField" type="text"
                                    :placeholder="t('inventory.details.search_filter.item')" />
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
        <ItemsInInentorySearchFilterModal :key="keyIncrement" :search_filter_popup="searchFilterPop"
            @search_filter_popup="popUpTrigger" @search="search_filter" @resetFilter="resetFilter_popup" />
</form>
</template>

<style scoped  lang="scss">
@import '/@src/scss/styles/tableHeader.scss';

.title {
    font-family: var(--font-alt);
    font-size: 1.25rem;
    margin-top: 1rem;

}
</style>
