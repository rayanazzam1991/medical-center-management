<script lang="ts">
import { useI18n } from "vue-i18n"
import { defaultItemSearchFilter, ItemSearchFilter, ItemConsts } from "/@src/models/Warehouse/Item/item"
import { defaultInventoryItemHistorySearchFilter, InventoryItemHistorySearchFilter } from "../../../../models/Warehouse/ItemHistory/inventoryItemHistory"
import { defaultPagination } from "/@src/utils/response"
import ListInventoryMovementSearchFilterModel from "./ListInventoryMovementSearchFilterModel.vue"
import { Permissions } from "/@src/utils/consts/rolesPermissions"


export default defineComponent({
    props: {
        title: {
            type: String,
            default: "",
        },
        pagination: {
            default: defaultPagination,
        },
        default_per_page: {
            type: Number,
            default: 1,
        },
        is_for_item: {
            type: Boolean,
            default: false,
        },
        suppliers_only: {
            type: Boolean,
            default: false,
        },
        to_main_inventory: {
            type: Boolean,
            default: true,
        },
        from_main_inventory: {
            type: Boolean,
            default: true,
        },

    },
    setup(props, context) {
        const { t } = useI18n();
        const onOpen = () => {
            searchFilterPop.value = !searchFilterPop.value;
            quickSearchField.value = "";
            context.emit("onOpen", searchFilterPop.value);
        };
        const popUpTrigger = (value: boolean) => {
            searchFilterPop.value = value;
        };
        const default_per_page = props.default_per_page;
        const pagination = props.pagination;
        const searchFilterPop = ref(false);
        const searchType = ref("");
        const perPage = ref(pagination.per_page);
        const searchFilter = ref(defaultInventoryItemHistorySearchFilter);
        const is_reseted = ref(false);
        const keyIncrement = ref(0);
        const quickSearchField = ref("");
        const search = () => {
            searchFilter.value.page = 1;
            searchFilter.value.per_page = perPage.value;
            context.emit("search", searchFilter.value);
        };
        const search_filter = (value: InventoryItemHistorySearchFilter) => {
            searchFilter.value = value;
            searchFilter.value.per_page = perPage.value;
            context.emit("search", searchFilter.value);
        };
        const resetFilter = () => {
            searchFilter.value.type = undefined;
            searchFilter.value.status = undefined;
            searchFilter.value.from_inventory = undefined;
            searchFilter.value.to_inventory = undefined;
            searchFilter.value.item_id = undefined;
            searchFilter.value.from = undefined;
            searchFilter.value.to = undefined;
            searchFilter.value.action = undefined
            searchFilter.value.action_by = undefined
            searchFilter.value.type = undefined
            searchFilter.value.supplier_name = undefined
            quickSearchField.value = "";
            is_reseted.value = true;
            keyIncrement.value++;
            context.emit("resetFilter", searchFilter.value);
        };
        const resetFilter_popup = (value: InventoryItemHistorySearchFilter) => {
            searchFilter.value.type = undefined;
            searchFilter.value.status = undefined;
            searchFilter.value.from_inventory = undefined;
            searchFilter.value.to_inventory = undefined;
            searchFilter.value.item_id = undefined;
            searchFilter.value.from = undefined;
            searchFilter.value.to = undefined;
            searchFilter.value.supplier_name = undefined
            context.emit("resetFilter", searchFilter.value);
        };
        return { t, Permissions, searchFilterPop, default_per_page, keyIncrement, search_filter, resetFilter_popup, onOpen, popUpTrigger, resetFilter, search, searchType, perPage, pagination, ItemConsts, quickSearchField };
    },
    components: { ListInventoryMovementSearchFilterModel }
})
</script>
<template>
    <form class="form-layout" v-on:submit.prevent="search">
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
                            <VControl v-if="!$props.is_for_item && $props.from_main_inventory" class="ml-2">
                                <VButton v-permission="Permissions.INVENTORY_ITEM_CREATE" class="" to="/from-main-inventory"
                                    color="primary">{{
                                        t('inventory.table.buttons_name.from_main_inventory') }}
                                </VButton>
                            </VControl>
                            <VControl>
                                <VButton v-if="!$props.is_for_item && $props.to_main_inventory"
                                    v-permission="Permissions.INVENTORY_ITEM_CREATE" class="" to="/to-main-inventory"
                                    color="primary">{{
                                        t('inventory.table.buttons_name.to_main_inventory') }}
                                </VButton>
                            </VControl>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <ListInventoryMovementSearchFilterModel :is_for_item="$props.is_for_item" :suppliers_only="$props.suppliers_only"
            :key="keyIncrement" :search_filter_popup="searchFilterPop" @search_filter_popup="popUpTrigger"
            @search="search_filter" @resetFilter="resetFilter_popup" />
    </form>
</template>

<style scoped  lang="scss">
@import '/@src/scss/styles/tableHeader.scss';
</style>
