<script setup lang="ts">
import { useHead } from '@vueuse/head'
import VTag from '/@src/components/base/tags/VTag.vue'
import NoDeleteDropDownVue from '/@src/components/OurComponents/NoDeleteDropDown.vue'
import { changeItemStatus, getItemsList } from '/@src/services/Warehouse/Item/itemService'
import { useNotyf } from '/@src/composable/useNotyf'
import { defaultItemSearchFilter, ItemSearchFilter, ItemConsts, Item } from '/@src/models/Warehouse/Item/item'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { defaultPagination } from '/@src/utils/response'
import { useItem } from '/@src/stores/Warehouse/Item/itemStore'
import sleep from '/@src/utils/sleep'
import { defaultChangeItemStatus, defaultItem } from '/@src/models/Warehouse/Item/item'
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Item')
useHead({
    title: 'Item',
})
const notif = useNotyf()
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
onMounted(async () => {
    const { items, pagination } = await getItemsList(searchFilter.value)
    itemsList.value = items
    paginationVar.value = pagination
    keyIncrement.value = keyIncrement.value + 1
    default_per_page.value = pagination.per_page
});
const changestatusItem = async () => {
    currentChangeStatusItem.value.id = currentChangeStatusItem.value.id
    const { message, success } = await changeItemStatus(currentChangeStatusItem.value)
    if (success) {
        await search(searchFilter.value)
        // @ts-ignore
        notif.dismissAll()
        await sleep(200);
        // @ts-ignore
        notif.success(`${itemChangeStatus.value.name} status was edited successfully`)
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
    id: {
        searchable: true,
        sortable: true,
    },
    name: {
        sortable: true,
        align: 'center',
        grow: true,
        searchable: true,
    },
    Level1: {
        sortable: true,
        searchable: true,
        grow: true,
        align: 'center',
        label: 'Level 1',
        renderRow: (row: any) =>
            h('span', row?.category?.parent?.name)
    },
    Level2: {
        sortable: true,
        searchable: true,
        grow: true,
        align: 'center',
        label: 'Level 2',
        renderRow: (row: any) =>
            h('span', row?.category?.name)
    },
    quantity: {
        sortable: true,
        align: 'center',
        searchable: true,
        grow: true,

    },
    price: {
        sortable: true,
        align: 'center',
        searchable: true,
    },
    cost: {
        sortable: true,
        align: 'center',
        searchable: true,
    },
    created_by: {
        sortable: true,
        searchable: true,
        grow: true,
        align: 'center',
        label: 'Created_by',
        renderRow: (row: any) =>
            h('span', row?.created_by?.first_name)
    },
    status: {
        align: 'center',
        renderRow: (row: any) =>
            h(
                VTag,
                {
                    rounded: true,
                    color:
                        row.status === ItemConsts.INACTIVE
                            ? 'orange'
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
    created_at: {
        align: 'center',
        label: 'Create Date',
        grow: true,
        renderRow: (row: any) =>
            h('span', row?.created_at),
        searchable: true,
        sortable: true,
    },

    actions: {
        align: 'center',
        renderRow: (row: any) =>
            h(NoDeleteDropDownVue, {

                onChangeStatus: () => {
                    currentChangeStatusItem.value = row
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
    <ItemTableHeader :key="keyIncrement" :title="viewWrapper.pageTitle" :button_name="`Add ${viewWrapper.pageTitle}`"
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
                    <VPlaceholderSection title="No matches" subtitle="There is no data that match your search."
                        class="my-6">
                    </VPlaceholderSection>
                </div>
            </template>
        </VFlexTable>
        <VFlexPagination v-if="(itemsList.length != 0 && paginationVar.max_page != 1)"
            :current-page="paginationVar.page" class="mt-6" :item-per-page="paginationVar.per_page"
            :total-items="paginationVar.total" :max-links-displayed="3" no-router
            @update:current-page="getItemsPerPage" />
        <h6 v-if="itemsList.length != 0 && !itemStore?.loading">Showing {{ paginationVar.page !=
        paginationVar.max_page
        ?
        (1 + ((paginationVar.page - 1) * paginationVar.count)) : paginationVar.page == 1 ? 1 : paginationVar.total
}} to {{
        paginationVar.page !=
            paginationVar.max_page ?
            paginationVar.page *
            paginationVar.per_page : paginationVar.total
}} of {{ paginationVar.total }} entries</h6>

        <VPlaceloadText v-if="itemStore?.loading" :lines="1" last-line-width="20%" class="mx-2" />
    </VFlexTableWrapper>
    <VModal title="Change Item Status" :open="changeStatusPopup" actions="center" @close="changeStatusPopup = false">
        <template #content>
            <form class="form-layout" @submit.prevent="">
                <!--Fieldset-->
                <div class="form-fieldset">
                    <div class="columns is-multiline">
                        <div class="column is-12">
                            <VField id="status" v-slot="{ field }">
                                <VLabel class="required">{{ viewWrapper.pageTitle }} status</VLabel>
                                <VControl>
                                    <VRadio v-model="currentChangeStatusItem.status" :value="ItemConsts.INACTIVE"
                                        :label="ItemConsts.showStatusName(0)" name="status" color="warning" />
                                    <VRadio v-model="currentChangeStatusItem.status" :value="ItemConsts.ACTIVE"
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
</template>
