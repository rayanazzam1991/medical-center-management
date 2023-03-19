<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "permissions": [
            "item_list"
        ]
    }
}
</route>
    
<script setup lang="ts">
import { useHead } from '@vueuse/head'
import VTag from '/@src/components/base/tags/VTag.vue'
import NoDeleteDropDownVue from '/@src/components/OurComponents/NoDeleteDropDown.vue'
import { changeItemStatus, getItemsList } from '/@src/services/Warehouse/Item/itemService'
import { useNotyf } from '/@src/composable/useNotyf'
import { defaultItemSearchFilter, ItemSearchFilter, ItemConsts, Item, ChangeItemStatus } from '/@src/models/Warehouse/Item/item'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { defaultPagination } from '/@src/utils/response'
import { useItem } from '/@src/stores/Warehouse/Item/itemStore'
import sleep from '/@src/utils/sleep'
import { defaultChangeItemStatus, defaultItem } from '/@src/models/Warehouse/Item/item'
import { Notyf } from 'notyf'
import { useI18n } from 'vue-i18n'
import { Currency, defaultCurrency } from '/@src/models/Accounting/Currency/currency'
import { getCurrenciesFromStorage } from '/@src/services/Accounting/Currency/currencyService'
import { addParenthesisToString } from '/@src/composable/helpers/stringHelpers'
import { Permissions } from '/@src/utils/consts/rolesPermissions'
const viewWrapper = useViewWrapper()
const { t } = useI18n()
viewWrapper.setPageTitle(t('item.table.title'))
useHead({
    title: t('item.table.title'),
})
const notif = useNotyf() as Notyf
const searchFilter = ref(defaultItemSearchFilter)
const itemsList = ref<Array<Item>>([])
const changeStatusPopup = ref(false)
const itemChangeStatus = ref<Item>(defaultItem)
const currentChangeStatusItem = ref(defaultChangeItemStatus)
const paginationVar = ref(defaultPagination)
const router = useRouter()
const itemStore = useItem()
const keyIncrement = ref(0)
const default_per_page = ref(1)
const selectedStatus = ref(0)
const currencies = getCurrenciesFromStorage()
const mainCurrency: Currency = currencies.find((currency) => currency.is_main) ?? defaultCurrency

onMounted(async () => {
    const { items, pagination } = await getItemsList(searchFilter.value)
    searchFilter.value = defaultItemSearchFilter
    itemsList.value = items
    paginationVar.value = pagination
    keyIncrement.value = keyIncrement.value + 1
    default_per_page.value = pagination.per_page
});

const changestatusItem = async () => {
    const changeItemStatusData: ChangeItemStatus = {
        id: currentChangeStatusItem.value.id,
        status: selectedStatus.value
    }
    const { message, success } = await changeItemStatus(changeItemStatusData)
    if (success) {
        currentChangeStatusItem.value.status = selectedStatus.value
        notif.dismissAll()
        await sleep(200);
        notif.success(t('toast.success.edit'))
    } else {
        await sleep(200);
        notif.error(message)
    }
    changeStatusPopup.value = false
}
const search = async (searchFilter2: ItemSearchFilter) => {
    paginationVar.value.per_page = searchFilter2.per_page ?? paginationVar.value.per_page
    const { items, pagination } = await getItemsList(searchFilter2)
    itemsList.value = items
    paginationVar.value = pagination
    searchFilter.value = searchFilter2
}

const resetFilter = async (searchFilter2: ItemSearchFilter) => {
    searchFilter.value = searchFilter2
    await search(searchFilter.value)
}

const getItemsPerPage = async (pageNum: number) => {
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
    name: {
        sortable: true,
        align: 'center',
        searchable: true,
        label: t('item.table.columns.name')
    },
    Level1: {
        sortable: true,
        searchable: true,
        align: 'center',
        label: t('item.table.columns.level_1'),
        renderRow: (row: any) =>
            h('span', row?.category?.parent?.name)
    },
    Level2: {
        sortable: true,
        searchable: true,
        align: 'center',
        label: t('item.table.columns.level_2'),
        renderRow: (row: any) =>
            h('span', row?.category?.name)
    },
    price: {
        sortable: true,
        align: 'center',
        searchable: true,
        grow: true,
        label: t('item.table.columns.price') + addParenthesisToString(mainCurrency.name)

    },
    cost: {
        sortable: true,
        align: 'center',
        searchable: true,
        label: t('item.table.columns.cost')

    },
    created_by: {
        sortable: true,
        searchable: true,
        align: 'center',
        label: t('item.table.columns.created_by'),
        renderRow: (row: any) =>
            h('span', row?.created_by?.first_name)
    },
    created_at: {
        align: 'center',
        label: t('item.table.columns.created_at'),
        renderRow: (row: any) =>
            h('span', row?.created_at),
        searchable: true,
        sortable: true,
    },
    is_for_sale: {
        align: 'center',
        searchable: true,
        label: t('item.table.columns.for_sale'),
        renderRow: (row: any) =>
            h(
                VTag,
                {
                    rounded: true,
                    color:
                        row?.is_for_sale === ItemConsts.IS_NOT_FORE_SALE
                            ? 'warning'
                            : row?.is_for_sale === ItemConsts.IS_FORE_SALE
                                ? 'success'
                                : undefined,
                },
                {
                    default() {
                        return ItemConsts.showForSale(row?.is_for_sale)
                    },
                }
            ),
    },
    status: {
        align: 'center',
        label: t('item.table.columns.status'),
        renderRow: (row: any) =>
            h(
                VTag,
                {
                    rounded: true,
                    color:
                        row.status === ItemConsts.INACTIVE
                            ? 'danger'
                            : row.status === ItemConsts.ACTIVE
                                ? 'success'
                                : undefined,
                },
                {
                    default() {
                        return ItemConsts.showStatusName(row.status)
                    },
                }
            ),
    },

    actions: {
        align: 'center',
        label: t('item.table.columns.actions'),
        renderRow: (row: any) =>
            h(NoDeleteDropDownVue, {
                changeStatusPermission: Permissions.ITEM_EDIT,
                editPermission: Permissions.ITEM_EDIT,
                viewPermission: Permissions.ITEM_SHOW,
                onChangeStatus: () => {
                    currentChangeStatusItem.value = row
                    selectedStatus.value = row?.status
                    changeStatusPopup.value = true
                },
                onEdit: () => {
                    router.push({ path: `/item/${row.id}/edit` })
                },
                onView: () => {
                    router.push({ path: `/item/${row.id}` })
                },
            }),
    },
} as const
</script>

<template>
    <ItemTableHeader :key="keyIncrement" :title="viewWrapper.pageTitle" :button_name="t('item.header_button')"
        @search="search" :pagination="paginationVar" :default_per_page="default_per_page" @resetFilter="resetFilter" />
    <VFlexTableWrapper :columns="columns" :data="itemsList" @update:sort="itemSort">
        <VFlexTable separators clickable>
            <template #body>
                <div v-if="itemStore?.loading" class="flex-list-inner">
                    <div v-for="key in paginationVar.per_page" :key="key" class="flex-table-item">
                        <VFlexTableCell>
                            <VPlaceload />
                        </VFlexTableCell>
                    </div>
                </div>
                <div v-else-if="itemsList.length === 0" class="flex-list-inner">
                    <VPlaceholderSection :title="t('tables.placeholder.title')" :subtitle="t('tables.placeholder.subtitle')"
                        class="my-6">
                    </VPlaceholderSection>
                </div>
            </template>
        </VFlexTable>
        <VFlexPagination v-if="(itemsList.length != 0 && paginationVar.max_page != 1)" :current-page="paginationVar.page"
            class="mt-6" :item-per-page="paginationVar.per_page" :total-items="paginationVar.total" :max-links-displayed="3"
            no-router @update:current-page="getItemsPerPage" />
        <h6 class="pt-2 is-size-7" v-if="itemsList.length != 0 && !itemStore?.loading">
            {{
                t('tables.pagination_footer', {
                    from_number: paginationVar.page !=
                        paginationVar.max_page
                        ?
                        (1 + ((paginationVar.page - 1) * paginationVar.count)) : paginationVar.page == paginationVar.max_page ? (1 +
                            ((paginationVar.page - 1) * paginationVar.per_page)) : paginationVar.page == 1 ? 1 : paginationVar.total
                    , to_number: paginationVar.page !=
                        paginationVar.max_page ?
                        paginationVar.page *
                        paginationVar.per_page : paginationVar.total, all_number: paginationVar.total
                }) }}</h6>

        <VPlaceloadText v-if="itemStore?.loading" :lines="1" last-line-width="20%" class="mx-2" />
    </VFlexTableWrapper>
    <VModal :title="t('item.table.modal_title.item')" :open="changeStatusPopup" actions="center"
        @close="changeStatusPopup = false">
        <template #content>
            <form class="form-layout" @submit.prevent="">
                <!--Fieldset-->
                <div class="form-fieldset">
                    <div class="columns is-multiline">
                        <div class="column is-12">
                            <VField id="status" v-slot="{ field }">
                                <VLabel class="required">{{ t('item.table.columns.status') }}</VLabel>
                                <VControl>
                                    <VRadio v-model="selectedStatus" :value="ItemConsts.INACTIVE"
                                        :label="ItemConsts.showStatusName(0)" name="status" color="danger" />
                                    <VRadio v-model="selectedStatus" :value="ItemConsts.ACTIVE"
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
</template>
