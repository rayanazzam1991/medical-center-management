<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "permissions": [
            "item_show"
        ]
    }
}
</route>
  
<script setup lang="ts">
import { useHead } from "@vueuse/head"
import { useNotyf } from "/@src/composable/useNotyf"
import { Item, defaultItem, defaultChangeItemStatus } from "/@src/models/Warehouse/Item/item"
import { changeItemStatus, getItem } from "/@src/services/Warehouse/Item/itemService"
import { useViewWrapper } from "/@src/stores/viewWrapper"
import { useItem } from "/@src/stores/Warehouse/Item/itemStore"
import sleep from "/@src/utils/sleep"
import { ErrorMessage } from "vee-validate"
import { ItemConsts } from '/@src/models/Warehouse/Item/item'
import { defaultChangeItemHistoryStatus, defaultInventoryItemHistory, defaultInventoryItemHistorySearchFilter, inventoryItemHistory, InventoryItemHistorySearchFilter, ItemHsitoryConsts } from "../../../models/Warehouse/ItemHistory/inventoryItemHistory"
import { changeItemHistoryStatus, getInventoryMovementsList, getItemHistory } from "../../../services/Warehouse/ItemHistory/inventoryItemHistoryService"
import { defaultPagination } from "/@src/utils/response"
import VTag from '/@src/components/base/tags/VTag.vue'
import { useinventoryItemHistory } from "/@src/stores/Warehouse/ItemHistory/inventoryItemHistoryStore"
import { Notyf } from "notyf"
import { useI18n } from "vue-i18n"
import IconButton from "/@src/components/OurComponents/Warehouse/InventoryItemHistory/IconButton.vue"
import { BaseConsts } from "/@src/utils/consts/base"
import { addParenthesisToString, stringTrim } from "/@src/composable/helpers/stringHelpers"
import { Currency, defaultCurrency } from "/@src/models/Accounting/Currency/currency"
import { getCurrenciesFromStorage } from "/@src/services/Accounting/Currency/currencyService"
import { Permissions } from "/@src/utils/consts/rolesPermissions"


const route = useRoute()
const router = useRouter()
const viewWrapper = useViewWrapper()
const itemHistoryStore = useinventoryItemHistory()
const currentItem = ref<Item>(defaultItem)
const currentItemModel = ref<Item>(defaultItem)

const itemId = ref(0)
const changeStatusPopup = ref(false)
const changeHistoryStatusPopup = ref(false)
const currentChangeStatusItem = ref(defaultChangeItemStatus)
const currentChangeStatusItemHistory = ref(defaultChangeItemHistoryStatus)
const keyIncrement = ref(1)
const loading = ref(false)
const itemHistoriesList = ref<inventoryItemHistory[]>([])
const searchFilter = ref(defaultInventoryItemHistorySearchFilter)
const inventoryItemHistoryList = ref<Array<inventoryItemHistory>>([])
const paginationVar = ref(defaultPagination)
const default_per_page = ref(1)
const selectedStatus = ref(0)
const currencies = getCurrenciesFromStorage()
const mainCurrency: Currency = currencies.find((currency) => currency.is_main) ?? defaultCurrency

const { t } = useI18n()
const notif = useNotyf() as Notyf
viewWrapper.setPageTitle(t('item.details.title'))
useHead({
    title: t('item.details.title'),
})
const itemStore = useItem()
const props = withDefaults(
    defineProps<{
        activeTab?: 'Details' | 'History'
    }>(),
    {
        activeTab: 'Details',
    }
)
const tab = ref(props.activeTab)
itemId.value = route.params?.id as number ?? 0

const onOpen = () => {
    changeStatusPopup.value = !changeStatusPopup.value
}

onMounted(async () => {
    loading.value = true
    await getCurrentItem()
    loading.value = false

    searchFilter.value = {} as InventoryItemHistorySearchFilter
    searchFilter.value.status = BaseConsts.ACTIVE
    searchFilter.value.item_id = itemId.value
    const { itemHistories, pagination } = await getInventoryMovementsList(searchFilter.value)
    itemHistoriesList.value = itemHistories
    paginationVar.value = pagination
    keyIncrement.value = keyIncrement.value + 1
    default_per_page.value = pagination.per_page

})

const search = async (searchFilter2: InventoryItemHistorySearchFilter) => {
    searchFilter2.status = BaseConsts.ACTIVE
    paginationVar.value.per_page = searchFilter2.per_page ?? paginationVar.value.per_page
    searchFilter2.item_id = itemId.value
    const { itemHistories, pagination } = await getInventoryMovementsList(searchFilter2)
    itemHistoriesList.value = itemHistories
    paginationVar.value = pagination
    searchFilter.value = searchFilter2
}

const resetFilter = async (searchFilter2: InventoryItemHistorySearchFilter) => {
    searchFilter.value = searchFilter2
    searchFilter.value.status = BaseConsts.ACTIVE

    await search(searchFilter.value)
}

const getItemHistoriesPerPage = async (pageNum: number) => {
    searchFilter.value.page = pageNum
    await search(searchFilter.value)
}
const itemSort = async (value: string) => {
    if (value != undefined) {
        const [sortField, sortOrder] = value.split(':') as [string, 'desc' | 'asc']
        searchFilter.value.order_by = sortField
        searchFilter.value.order = sortOrder
    }
    else {
        searchFilter.value.order = undefined
        searchFilter.value.order_by = undefined
    }
    await search(searchFilter.value)
}
const columns = {
    from_inventory: {
        sortable: true,
        align: 'center',
        searchable: true,
        grow: true,
        label: t('list_inventory_movement.table.columns.from'),
        renderRow: (row: any) =>
            h('span', row?.from_inventory ? row?.from_inventory : '-'),
    },
    to_inventory: {
        sortable: true,
        align: 'center',
        searchable: true,
        label: t('list_inventory_movement.table.columns.to'),
        grow: true,
        renderRow: (row: any) =>
            h('span', row?.to_inventory ? row?.to_inventory : !row?.to_inventory && row?.from_inventory ? row?.requester_name : '-'),
    },
    action: {
        align: 'center',
        searchable: true,
        label: t('list_inventory_movement.table.columns.action'),
        grow: true,
        renderRow: (row: any) =>
            h('span', row?.to_inventory && !row?.from_inventory ? t('list_inventory_movement.table.action_types.add_quantity')
                : !row?.to_inventory && row?.from_inventory ? t('list_inventory_movement.table.action_types.withdraw_quantity')
                    : '-'
            ),

    },
    movement_type: {
        align: 'center',
        searchable: true,
        label: t('list_inventory_movement.table.columns.movement_type'),
        grow: true,
        renderRow: (row: any) =>
            h('span', row?.to_inventory && row?.from_inventory ? t('list_inventory_movement.table.movement_types.internal')
                : t('list_inventory_movement.table.movement_types.external')
            ),

    },
    item: {
        searchable: true,
        grow: true,
        align: 'center',
        label: t('list_inventory_movement.table.columns.item'),
        renderRow: (row: any) =>
            h('span', row?.item)
    },
    item_quantity: {
        align: 'center',
        searchable: true,
        grow: true,
        label: t('list_inventory_movement.table.columns.quantity'),
    },
    note: {
        align: 'center',
        searchable: true,
        grow: true,
        label: t('list_inventory_movement.table.columns.note'),

        renderRow: (row: any) =>
            h('span', {
                innerHTML: row?.note ?
                    `<div class="tooltip">${stringTrim(row?.note, 10)}<div class="tooltiptext"><p class="text-white">${row?.note}</p></div></div>` : '-',

            }),

    },
    created_at: {
        align: 'center',
        label: t('list_inventory_movement.table.columns.created_at'),
        grow: true,
        renderRow: (row: any) =>
            h('span', row?.created_at),
        searchable: true,
        sortable: true,
    },
    action_by: {
        searchable: true,
        grow: true,
        align: 'center',
        label: t('list_inventory_movement.table.columns.action_by'),
        renderRow: (row: any) =>
            h('span', row?.action_by?.first_name + ' ' + row?.action_by?.last_name)
    },
} as const

const getCurrentItem = async () => {
    const { item } = await getItem(itemId.value)
    currentItem.value = item

}
const changestatusItem = async () => {
    const itemData = currentItemModel.value
    var itemForm = currentChangeStatusItem.value
    itemForm.id = currentItem.value.id
    itemForm.status = itemData.status
    const { message, success } = await changeItemStatus(itemForm)
    if (success) {
        getCurrentItem()
        notif.dismissAll()
        await sleep(200);
        changeStatusPopup.value = false

    } else {
        notif.error(message)
    }
}
const onClickEditMainInfo = () => {
    router.push({
        path: `/item/${itemId.value}/edit`
    })
}

const onOpenHistory = () => {
    changeHistoryStatusPopup.value = !changeHistoryStatusPopup.value
}

const changestatusItemHistory = async () => {
    currentChangeStatusItemHistory.value.id = currentChangeStatusItemHistory.value.id
    currentChangeStatusItemHistory.value.status = selectedStatus.value
    changeHistoryStatusPopup.value = false
    const { message, success } = await changeItemHistoryStatus(currentChangeStatusItemHistory.value)
    if (success) {
        await search(searchFilter.value)
        notif.dismissAll()
        await sleep(200);
        notif.success(t('toast.success.edit'))
    } else {
        await sleep(200);
        notif.error(message)
    }
}


</script>
<template>
    <div class="profile-wrapper">
        <VLoader size="large" :active="loading">
            <div class="profile-header has-text-centered">
                <h3 class="title is-4 is-narrow is-thin">{{ currentItem.name }}</h3>
                <div class="profile-stats">
                    <div class="profile-stat">
                        <i aria-hidden="true" class="lnil lnil-checkmark-circle"></i>
                        <span>{{ t('item.details.status') }} :
                            <span
                                :class="currentItem.status === ItemConsts.INACTIVE ? 'has-text-danger' : 'has-text-success'">
                                {{ ItemConsts.showStatusName(currentItem.status) }} </span>
                        </span>
                    </div>&nbsp;|
                    <div class="profile-stat">
                        <i aria-hidden="true" class="lnil "></i>
                        <span>{{ t('item.table.columns.for_sale') }} :
                            <span
                                :class="currentItem.is_for_sale === ItemConsts.IS_FORE_SALE ? 'has-text-success' : 'has-text-warning'">
                                {{ ItemConsts.showForSale(currentItem.is_for_sale) }} </span>
                        </span>
                    </div>
                </div>
            </div>
        </VLoader>
        <div class="project-details">
            <div class="tabs-wrapper is-slider">
                <div :hidden="loading" class="tabs-inner">
                    <div class="tabs tabs-width">
                        <ul>
                            <li :class="[tab === 'Details' && 'is-active']">
                                <a tabindex="0" @keydown.space.prevent="tab = 'Details'" @click="tab = 'Details'"><span>{{
                                    t('item.details.tabs.details') }}</span></a>
                            </li>
                            <li :class="[tab === 'History' && 'is-active']">
                                <a tabindex="0" @keydown.space.prevent="tab = 'History'" @click="tab = 'History'">
                                    <span>{{ t('item.details.tabs.item_history') }}</span></a>
                            </li>
                            <li class="tab-naver"></li>
                        </ul>
                    </div>
                </div>
                <div v-if="tab === 'Details'" class="tab-content is-active">
                    <div class="columns project-details-inner">
                        <div class="column is-12">
                            <div class="project-details-card">
                                <div class="card-head">
                                    <div class="title-wrap">
                                        <h3>{{ t('item.details.main_details') }}</h3>
                                    </div>
                                    <div class="buttons">
                                        <VButton v-permission="Permissions.ITEM_EDIT" @click.prevent="onOpen" color="dark">
                                            {{ t('item.table.modal_title.item') }}
                                        </VButton>
                                        <VIconButton v-permission="Permissions.ITEM_EDIT" size="small" icon="feather:edit-3"
                                            tabindex="0" @click="onClickEditMainInfo" />
                                    </div>
                                </div>

                                <div class="project-files">
                                    <div class="columns is-multiline">
                                        <div class="column is-6">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>{{ t('item.details.leve_1') }}</span>
                                                    <span>
                                                        {{ currentItem.category.parent?.name }}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="column is-6">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>{{ t('item.details.leve_2') }}</span>
                                                    <span>
                                                        {{ currentItem.category.name }}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="column is-6">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>{{ t('item.details.price') }} {{
                                                        addParenthesisToString(mainCurrency.name) }}</span>
                                                    <span>
                                                        {{ currentItem.price }}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="column is-6">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>{{ t('item.details.cost') }}{{
                                                        addParenthesisToString(mainCurrency.name) }}</span>
                                                    <span>
                                                        {{ currentItem.cost }}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="column is-12">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>{{ t('item.details.description') }}</span>
                                                    <span>
                                                        {{ currentItem.description ?? t('place_holder.none') }}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div v-if="tab === 'History'" class="tab-content is-active mb-8">
                    <div class="columns project-details-inner">
                        <div class="column is-12">
                            <div class="project-details-card">
                                <ListInventoryMovementTableHeader :key="keyIncrement" :title="viewWrapper.pageTitle"
                                    class="mb-2" :has_item_filter="false" @search="search" :pagination="paginationVar"
                                    :default_per_page="default_per_page" @resetFilter="resetFilter" />
                                <VFlexTableWrapper :columns="columns" :data="itemHistoriesList" @update:sort="itemSort">
                                    <VFlexTable separators clickable>
                                        <template #body>
                                            <div v-if="itemHistoryStore?.loading" class="flex-list-inner">
                                                <div v-for="key in paginationVar.per_page" :key="key"
                                                    class="flex-table-item">
                                                    <VFlexTableCell>
                                                        <VPlaceload />
                                                    </VFlexTableCell>
                                                </div>
                                            </div>
                                            <div v-else-if="itemHistoriesList.length === 0" class="flex-list-inner">
                                                <VPlaceholderSection :title="t('tables.placeholder.title')"
                                                    :subtitle="t('tables.placeholder.subtitle')" class="my-6">
                                                </VPlaceholderSection>
                                            </div>
                                        </template>
                                    </VFlexTable>
                                    <VFlexPagination v-if="(itemHistoriesList.length != 0 && paginationVar.max_page != 1)"
                                        :current-page="paginationVar.page" class="mt-6"
                                        :item-per-page="paginationVar.per_page" :total-items="paginationVar.total"
                                        :max-links-displayed="3" no-router @update:current-page="getItemHistoriesPerPage" />
                                    <h6 class="pt-2 is-size-7"
                                        v-if="itemHistoriesList.length != 0 && !itemHistoryStore?.loading">
                                        {{
                                            t('tables.pagination_footer', {
                                                from_number: paginationVar.page !=
                                                    paginationVar.max_page
                                                    ?
                                                    (1 + ((paginationVar.page - 1) * paginationVar.count)) : paginationVar.page ==
                                                        paginationVar.max_page ? (1 +
                                                            ((paginationVar.page - 1) * paginationVar.per_page)) : paginationVar.page == 1 ?
                                                        1 : paginationVar.total
                                                , to_number: paginationVar.page !=
                                                    paginationVar.max_page ?
                                                    paginationVar.page *
                                                    paginationVar.per_page : paginationVar.total, all_number: paginationVar.total
                                            }) }}</h6>
                                    <VPlaceloadText v-if="itemHistoryStore?.loading" :lines="1" last-line-width="20%"
                                        class="mx-2" />
                                </VFlexTableWrapper>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    </div>
    <VModal :title="t('item.table.modal_title.item')" :open="changeStatusPopup" actions="center"
        @close="changeStatusPopup = false">
        <template #content>
            <form class="form-layout" @submit.prevent="">
                <!--Fieldset-->
                <div class="form-fieldset">
                    <div class="columns is-multiline">
                        <div class="column is-12">
                            <VField class="column " id="status">
                                <VLabel class="required">{{ t('item.details.status') }}</VLabel>
                                <VControl>
                                    <VRadio v-model="currentItemModel.status" :value="ItemConsts.INACTIVE"
                                        :label="ItemConsts.showStatusName(0)" name="status" color="danger" />
                                    <VRadio v-model="currentItemModel.status" :value="ItemConsts.ACTIVE"
                                        :label="ItemConsts.showStatusName(1)" name="status" color="success" />
                                    <ErrorMessage class="help is-danger" name="status" />
                                </VControl>
                            </VField>
                        </div>
                    </div>
                </div>
            </form>
        </template>
        <template #action="{ close }">
            <VButton color="primary" raised @click="changestatusItem()">{{ t('modal.buttons.confirm') }}</VButton>
        </template>
    </VModal>
    <VModal :key="keyIncrement" :title="t('item.table.modal_title.item_history')" :open="changeHistoryStatusPopup"
        actions="center" @close="changeHistoryStatusPopup = false">
        <template #content>
            <form class="form-layout" @submit.prevent="">
                <!--Fieldset-->
                <div class="form-fieldset">
                    <div class="columns is-multiline">
                        <div class="column is-12">
                            <VField class="column " id="status">

                                <VLabel class="required">{{ t('item.details.history_status') }}</VLabel>
                                <VControl>
                                    <VRadio v-model="selectedStatus" :value="ItemHsitoryConsts.INACTIVE"
                                        :label="ItemConsts.showStatusName(0)" name="status" color="danger" />
                                    <VRadio v-model="selectedStatus" :value="ItemHsitoryConsts.ACTIVE"
                                        :label="ItemConsts.showStatusName(1)" name="status" color="success" />
                                    <ErrorMessage class="help is-danger" name="status" />
                                </VControl>
                            </VField>
                        </div>
                    </div>
                </div>
            </form>
        </template>
        <template #action="{ close }">
            <VButton color="primary" raised @click="changestatusItemHistory()">{{ t('modal.buttons.confirm') }}
            </VButton>
        </template>
    </VModal>
</template>

<style scoped lang="scss">
@import '/@src/scss/styles/multiTapedDetailsPage.scss';

.tabs-width {
    min-width: 250px;
    min-height: 40px;

    .is-active {
        min-height: 40px;
    }
}

.tabs-wrapper.is-slider .tabs li a,
.tabs-wrapper-alt.is-slider .tabs li a {
    height: 40px;
}

.tabs li {
    min-height: 40px !important;
}

.full-width {
    width: 100%;
    margin-right: 12px;
}
</style>
