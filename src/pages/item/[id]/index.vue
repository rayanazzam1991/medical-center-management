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
import { defaultChangeItemHistoryStatus, defaultItemHistory, defaultItemHistorySearchFilter, itemHistory, ItemHistorySearchFilter, ItemHsitoryConsts } from "/@src/models/Warehouse/ItemHistory/itemHistory"
import { changeItemHistoryStatus, getItemHistoriesList, getItemHistory } from "/@src/services/Warehouse/ItemHistory/itemHistoryService"
import { defaultPagination } from "/@src/utils/response"
import VTag from '/@src/components/base/tags/VTag.vue'
import { useitemHistory } from "/@src/stores/Warehouse/ItemHistory/itemHistoryStore"
import IconButton from "/@src/components/OurComponents/Warehouse/ItemHistory/IconButton.vue"
import { Notyf } from "notyf"



const route = useRoute()
const router = useRouter()
const viewWrapper = useViewWrapper()
const itemHistoryStore = useitemHistory()
const currentItem = ref<Item>(defaultItem)
const itemId = ref(0)
const changeStatusPopup = ref(false)
const changeHistoryStatusPopup = ref(false)
const itemChangeStatus = ref<Item>(defaultItem)
const currentChangeStatusItem = ref(defaultChangeItemStatus)
const currentChangeStatusItemHistory = ref(defaultChangeItemHistoryStatus)
const itemHistoryChangeStatus = ref<itemHistory>(defaultItemHistory)
const keyIncrement = ref(1)
const loading = ref(false)
const allItemHistoriesList = ref<itemHistory[]>([])
const ItemHistoriesList = ref<itemHistory[]>([])
const searchFilter = ref(defaultItemHistorySearchFilter)
const itemHistoryList = ref<Array<itemHistory>>([])
const paginationVar = ref(defaultPagination)
const default_per_page = ref(1)
const selectedStatus = ref(0)

const notif = useNotyf() as Notyf

itemId.value = route.params.id
viewWrapper.setPageTitle(`Item`)
useHead({
    title: 'Item',
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

    const { itemHistories, pagination } = await getItemHistory(itemId.value, searchFilter.value)
    searchFilter.value = {} as ItemHistorySearchFilter
    itemHistoryList.value = itemHistories
    paginationVar.value = pagination
    keyIncrement.value = keyIncrement.value + 1
    default_per_page.value = pagination.per_page
})

const search = async (searchFilter2: ItemHistorySearchFilter) => {
    paginationVar.value.per_page = searchFilter2.per_page ?? paginationVar.value.per_page
    const { itemHistories, pagination } = await getItemHistory(itemId.value, searchFilter2)
    itemHistoryList.value = itemHistories
    paginationVar.value = pagination
    searchFilter.value = searchFilter2
}

const resetFilter = async (searchFilter2: ItemHistorySearchFilter) => {
    searchFilter.value = searchFilter2
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
const getCurrentItem = async () => {
    const { item } = await getItem(itemId.value)
    currentItem.value = item

}
const changestatusItem = async () => {
    const itemData = currentItem.value
    var itemForm = currentChangeStatusItem.value
    itemForm.id = itemData.id
    itemForm.status = itemData.status
    const { message, success } = await changeItemStatus(itemForm)
    getCurrentItem()
    notif.dismissAll()
    await sleep(200);
    changeStatusPopup.value = false
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
        notif.success(`status was edited successfully`)
    } else {
        await sleep(200);
        notif.error(message)
    }
}

const columns = {
    type: {
        sortable: true,
        align: 'center',
        searchable: true,
        grow: true,
        renderRow: (row: any) =>
            h(
                VTag,
                {
                    rounded: true,
                    color:
                        row.type === 'in'
                            ? 'success'
                            : row.type === 'out'
                                ? 'danger'
                                : undefined,
                },
                {
                    default() {
                        return row.type
                    },
                }
            ),
    },
    item_quantity: {
        align: 'center',
        searchable: true,
        grow: true,
        label: 'quantity',

    },
    add_item_cost: {
        align: 'center',
        searchable: true,
        label: 'cost',
        grow: true,
        renderRow: (row: any) =>
            h('span', row?.add_item_cost ? row?.add_item_cost : '-')

    },
    withdraw_item_price: {
        align: 'center',
        searchable: true,
        label: 'Price',
        grow: true,
        renderRow: (row: any) =>
            h('span', row?.withdraw_item_price ? row?.withdraw_item_price : '-')

    },
    requester_name: {
        searchable: true,
        grow: true,
        align: 'center',
        label: 'requester',
        renderRow: (row: any) =>
            h('span', row?.requester_name ? row?.requester_name : '-'),

    },
    created_at: {
        align: 'center',
        label: 'Created at',
        grow: true,
        renderRow: (row: any) =>
            h('span', row?.created_at),
        searchable: true,
        sortable: true,
    },
    invoice_number: {
        align: 'center',
        searchable: true,
        label: 'invoice number',
        grow: true,
        renderRow: (row: any) =>
            h('span', row?.invoice_number ? row?.invoice_number : '-')

    },
    Image: {
        align: 'center',
        grow: true,
        label: 'Invoice',
        renderRow: (row: any) => {
            if (row?.file?.length > 0) {
                return h(IconButton, {
                    icon: 'fas fa-eye',
                    image_path: import.meta.env.VITE_MEDIA_BASE_URL + row?.file[0]?.relative_path,
                });
            } else {
                return h('span', '-');

            }
        },
    },
    status: {
        align: 'center',
        grow: true,

        renderRow: (row: any) =>
            h(
                VTag,
                {
                    rounded: true,
                    color:
                        row?.status === ItemHsitoryConsts.INACTIVE
                            ? 'danger'
                            : row?.status === ItemHsitoryConsts.ACTIVE
                                ? 'success'
                                : undefined,
                },
                {
                    default() {
                        return ItemHsitoryConsts.showStatusName(row?.status)
                    },
                }
            ),

    },
    action: {
        align: 'center',
        grow: true,
        label: 'edit status',
        renderRow: (row: any) =>
            h(IconButton, {
                icon: 'fas fa-edit',
                onClick: () => {
                    keyIncrement.value++
                    currentChangeStatusItemHistory.value = row
                    changeHistoryStatusPopup.value = true
                    selectedStatus.value = row?.status

                },
            }),

    },
} as const

</script>
<template>
    <div class="profile-wrapper">
        <VLoader size="large" :active="loading">
            <div class="profile-header has-text-centered">
                <h3 class="title is-4 is-narrow is-thin">{{ currentItem.name }}</h3>
                <div class="profile-stats">
                    <div class="profile-stat">
                        <i aria-hidden="true" class="lnil lnil-checkmark-circle"></i>
                        <span>Status: <span>
                                <VTag :color="currentItem.status === ItemConsts.INACTIVE ? 'danger' : 'success'">
                                    {{ ItemConsts.showStatusName(currentItem.status) }}</VTag>
                            </span></span>
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
                                <a tabindex="0" @keydown.space.prevent="tab = 'Details'"
                                    @click="tab = 'Details'"><span>Details</span></a>
                            </li>
                            <li :class="[tab === 'History' && 'is-active']">
                                <a tabindex="0" @keydown.space.prevent="tab = 'History'" @click="tab = 'History'">
                                    <span>Item History </span></a>
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
                                        <h3>Main Details</h3>
                                    </div>
                                    <div class="buttons">
                                        <VButton @click.prevent="onOpen" color="dark"> Change Item Status
                                        </VButton>
                                        <VIconButton size="small" icon="feather:edit-3" tabindex="0"
                                            @click="onClickEditMainInfo" />
                                    </div>
                                </div>

                                <div class="project-files">
                                    <div class="columns is-multiline">
                                        <div class="column is-6">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>Item Level 1</span>
                                                    <span>
                                                        {{ currentItem.category.parent?.name }}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="column is-6">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>Item Level 2</span>
                                                    <span>
                                                        {{ currentItem.category.name }}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="column is-6">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>Item
                                                        Quantity</span>
                                                    <span
                                                        :class="currentItem.min_quantity >= currentItem.quantity ? 'has-text-danger' : ''">
                                                        {{ currentItem.quantity }} Items left
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="column is-6">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>Item Min Quantity</span>
                                                    <span>
                                                        {{ currentItem.min_quantity }}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="column is-6">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>Price</span>
                                                    <span>
                                                        {{ currentItem.price }}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="column is-6">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>Cost</span>
                                                    <span>
                                                        {{ currentItem.cost }}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>
                                        <div class="column is-12">
                                            <div class="file-box">
                                                <div class="meta">
                                                    <span>Description</span>
                                                    <span>
                                                        {{ currentItem.description }}
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
                                <ItemHistoryTableHeader :key="keyIncrement" :title="viewWrapper.pageTitle"
                                    :button_name="`Add ${viewWrapper.pageTitle}`" @search="search"
                                    :pagination="paginationVar" :default_per_page="default_per_page"
                                    @resetFilter="resetFilter" />
                                <VFlexTableWrapper :columns="columns" :data="itemHistoryList" @update:sort="itemSort">
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
                                            <div v-else-if="itemHistoryList.length === 0" class="flex-list-inner">
                                                <VPlaceholderSection title="No matches"
                                                    subtitle="There is no data that match your search." class="my-6">
                                                </VPlaceholderSection>
                                            </div>
                                        </template>
                                    </VFlexTable>
                                    <VFlexPagination v-if="(itemHistoryList.length != 0 && paginationVar.max_page != 1)"
                                        :current-page="paginationVar.page" class="mt-6"
                                        :item-per-page="paginationVar.per_page" :total-items="paginationVar.total"
                                        :max-links-displayed="3" no-router
                                        @update:current-page="getItemHistoriesPerPage" />
                                    <h6 v-if="itemHistoryList.length != 0 && !itemHistoryStore?.loading">Showing {{
                                        paginationVar.page !=
                                            paginationVar.max_page
                                            ?
                                            (1 + ((paginationVar.page - 1) * paginationVar.count)) : paginationVar.page == 1
                                                ? 1 : paginationVar.total
                                    }} to {{
    paginationVar.page !=
        paginationVar.max_page ?
        paginationVar.page *
        paginationVar.per_page : paginationVar.total
}} of {{ paginationVar.total }} entries</h6>

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
    <VModal title="Change User Status" :open="changeStatusPopup" actions="center" @close="changeStatusPopup = false">
        <template #content>
            <form class="form-layout" @submit.prevent="">
                <!--Fieldset-->
                <div class="form-fieldset">
                    <div class="columns is-multiline">
                        <div class="column is-12">
                            <VField class="column " id="status">
                                <VLabel class="required">{{ viewWrapper.pageTitle }} status</VLabel>
                                <VControl>
                                    <VRadio v-model="currentItem.status" :value="ItemConsts.INACTIVE"
                                        :label="ItemConsts.showStatusName(0)" name="status" color="danger" />
                                    <VRadio v-model="currentItem.status" :value="ItemConsts.ACTIVE"
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
            <VButton color="primary" raised @click="changestatusItem()">Confirm</VButton>
        </template>
    </VModal>
    <VModal :key="keyIncrement" title="Change User Status" :open="changeHistoryStatusPopup" actions="center"
        @close="changeHistoryStatusPopup = false">
        <template #content>
            <form class="form-layout" @submit.prevent="">
                <!--Fieldset-->
                <div class="form-fieldset">
                    <div class="columns is-multiline">
                        <div class="column is-12">
                            <VField class="column " id="status">

                                <VLabel class="required">{{ viewWrapper.pageTitle }} status</VLabel>
                                <VControl>
                                    <VRadio v-model="selectedStatus"
                                        :value="ItemHsitoryConsts.INACTIVE" :label="ItemConsts.showStatusName(0)"
                                        name="status" color="danger" />
                                    <VRadio v-model="selectedStatus"
                                        :value="ItemHsitoryConsts.ACTIVE" :label="ItemConsts.showStatusName(1)"
                                        name="status" color="success" />
                                    <ErrorMessage class="help is-danger" name="status" />
                                </VControl>
                            </VField>
                        </div>
                    </div>
                </div>
            </form>
        </template>
        <template #action="{ close }">
            <VButton color="primary" raised @click="changestatusItemHistory()">Confirm</VButton>
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
