<script setup lang="ts">
import NoViewDropDownVue from '/@src/components/OurComponents/NoViewDropDown.vue';
import VTag from '/@src/components/base/tags/VTag.vue'
import VButton from '/@src/components/base/button/VButton.vue'
import { useHead } from '@vueuse/head'
import { getCategoriesList, changeCategoryStatus } from '/@src/services/Warehouse/Category/CategoryService'
import { useNotyf } from '/@src/composable/useNotyf'
import { defaultCategorySearchFilter, CategorySearchFilter, CategoryConsts, defaultCategory, Category, defaultChangeCategoryStatus } from '/@src/models/Warehouse/Category/category'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { defaultPagination } from '/@src/utils/response'
import { useCategory } from '/@src/stores/Warehouse/Category/CategoryStore'
import sleep from "/@src/utils/sleep"
import VButtonVue from '/@src/components/base/button/VButton.vue'
import VIconButtonVue from '/@src/components/base/button/VIconButton.vue'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Category')
useHead({
    title: 'Category',
})
const notif = useNotyf()
const searchFilter = ref(defaultCategorySearchFilter)
const categoriesList = ref<Array<Category>>([])
const changeStatusPopup = ref(false)
const categoryChangeStatus = ref<Category>(defaultCategory)
const currentChangeStatusCategory = ref(defaultChangeCategoryStatus)
const paginationVar = ref(defaultPagination)
const router = useRouter()
const categoryStore = useCategory()
const keyIncrement = ref(0)
const default_per_page = ref(1)

const { categories, pagination } = await getCategoriesList(searchFilter.value)
categoriesList.value = categories
paginationVar.value = pagination
keyIncrement.value = keyIncrement.value + 1
default_per_page.value = pagination.per_page

const search = async (searchFilter2: CategorySearchFilter) => {
    paginationVar.value.per_page = searchFilter2.per_page ?? paginationVar.value.per_page
    const { categories, pagination } = await getCategoriesList(searchFilter2)
    categoriesList.value = categories
    paginationVar.value = pagination
    searchFilter.value = searchFilter2
}

const resetFilter = async (searchFilter2: CategorySearchFilter) => {
    searchFilter.value = searchFilter2
    await search(searchFilter.value)
}

const getCategoriesPerPage = async (pageNum: number) => {
    searchFilter.value.page = pageNum
    await search(searchFilter.value)
}
const categorySort = async (value: string) => {
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
const changestatusCategory = async () => {
    currentChangeStatusCategory.value.id = currentChangeStatusCategory.value.id
    const { message, success } = await changeCategoryStatus(currentChangeStatusCategory.value)
    if (success) {
        await search(searchFilter.value)
        // @ts-ignore
        notif.dismissAll()
        await sleep(200);
        // @ts-ignore
        notif.success(`${categoryChangeStatus.value.name} status was edited successfully`)
    } else {
        await sleep(200);
        notif.error(message)
    }
    changeStatusPopup.value = false
}

const columns = {
    id: {
        align: 'center',
        sortable: true,

    },
    name: {
        align: 'center',
        sortable: true,
        grow: true,

    },
    parent_id: {
        sortable: true,
        searchable: true,
        grow: true,
        align: 'center',
        label: 'Parent',
        renderRow: (row: any) =>
            h('span', row?.parent?.name)
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
                        row.status === CategoryConsts.INACTIVE
                            ? 'orange'
                            : row.status === CategoryConsts.ACTIVE
                                ? 'success'
                                : undefined,
                },
                {
                    default() {
                        return CategoryConsts.showStatusName(row.status)
                    },
                }
            ),

    },
    created_at: {
        align: 'center',
        label: 'Create Date',
        renderRow: (row: any) =>
            h('span', row?.created_at),
        searchable: true,
        sortable: true,

    },
    actions: {
        align: 'center',
        renderRow: (row: any) =>
            h(NoViewDropDownVue, {
                onEdit: () => {
                    router.push({ path: `/category/${row.id}/edit` })
                },
                onChangeStatus: () => {
                    currentChangeStatusCategory.value = row
                    changeStatusPopup.value = true
                }
            }),
    },
} as const
</script>

<template>
    <CategoryTableHeader :title="viewWrapper.pageTitle" :button_name="`Add ${viewWrapper.pageTitle}`" @search="search"
        :pagination="paginationVar" :default_per_page="default_per_page" @resetFilter="resetFilter" />
    <VFlexTableWrapper :columns="columns" :data="categoriesList" @update:sort="categorySort">
        <VFlexTable separators clickable>
            <template #body>
                <div v-if="categoryStore?.loading" class="flex-list-inner">
                    <div v-for="key in paginationVar.per_page" :key="key" class="flex-table-item">
                        <VFlexTableCell>
                            <VPlaceload />
                        </VFlexTableCell>
                    </div>
                </div>
                <div v-else-if="categoriesList.length === 0" class="flex-list-inner">
                    <VPlaceholderSection title="No matches" subtitle="There is no data that match your search."
                        class="my-6">
                    </VPlaceholderSection>
                </div>
            </template>
        </VFlexTable>
        <VFlexPagination v-if="(categoriesList.length != 0 && paginationVar.max_page != 1)"
            :current-page="paginationVar.page" class="mt-6" :item-per-page="paginationVar.per_page"
            :total-items="paginationVar.total" :max-links-displayed="3" no-router
            @update:current-page="getCategoriesPerPage" />
        <h6 v-if="categoriesList.length != 0 && !categoryStore?.loading">Showing {{ paginationVar.page !=
        paginationVar.max_page
        ?
        (1 + ((paginationVar.page - 1) * paginationVar.count)) : paginationVar.page == 1 ? 1 : paginationVar.total
}} to {{
        paginationVar.page !=
            paginationVar.max_page ?
            paginationVar.page *
            paginationVar.per_page : paginationVar.total
}} of {{ paginationVar.total }} entries</h6>
        <VPlaceloadText v-if="categoryStore?.loading" :lines="1" last-line-width="20%" class="mx-2" />
    </VFlexTableWrapper>
    <VModal title="Change Category Status" :open="changeStatusPopup" actions="center"
        @close="changeStatusPopup = false">
        <template #content>
            <form class="form-layout" @submit.prevent="">
                <!--Fieldset-->
                <div class="form-fieldset">
                    <div class="columns is-multiline">
                        <div class="column is-12">
                            <VField id="status" v-slot="{ field }">
                                <VLabel class="required">{{ viewWrapper.pageTitle }} status</VLabel>
                                <VControl>
                                    <VRadio v-model="currentChangeStatusCategory.status"
                                        :value="CategoryConsts.INACTIVE" :label="CategoryConsts.showStatusName(0)"
                                        name="status" color="warning" />
                                    <VRadio v-model="currentChangeStatusCategory.status" :value="CategoryConsts.ACTIVE"
                                        :label="CategoryConsts.showStatusName(1)" name="status" color="success" />
                                    <ErrorMessage class="help is-danger" name="status" />
                                </VControl>
                            </VField>
                        </div>
                    </div>
                </div>
            </form>
        </template>
        <template #action="{ close }">
            <VButton color="primary" raised @click="changestatusCategory()">Confirm</VButton>
        </template>
    </VModal>
</template>

