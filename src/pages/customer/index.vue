<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import VTag from '/@src/components/base/tags/VTag.vue'
import MyDropDown from '/@src/components/OurComponents/MyDropDown.vue'
import NoDeleteDropDown from '/@src/components/OurComponents/NoDeleteDropDown.vue'
import { useNotyf } from '/@src/composable/useNotyf'
import { defaultCustomerSearchFilter, CustomerSearchFilter, CustomerConsts, Customer } from '/@src/models/CRM/Customer/customer'
import { getCustomersList } from '/@src/services/CRM/Customer/customerService'
import { defaultPagination } from '/@src/utils/response'
import { useCustomer } from '/@src/stores/CRM/Customer/customerStore'
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Customer')
useHead({
    title: 'Customer',
})
const notif = useNotyf()
const searchFilter = ref(defaultCustomerSearchFilter)
const customersList = ref<Array<Customer>>([])
const paginationVar = ref(defaultPagination)
const customerStore = useCustomer()
const keyIncrement = ref(0)

const router = useRouter()

onMounted(async () => {
    const { customers, pagination } = await getCustomersList(searchFilter.value)
    customersList.value = customers
    paginationVar.value = pagination
    keyIncrement.value = keyIncrement.value + 1
});

const search = async (searchFilter2: CustomerSearchFilter) => {
    paginationVar.value.per_page = searchFilter2.per_page ?? paginationVar.value.per_page

    const { customers, pagination } = await getCustomersList(searchFilter2)

    customersList.value = customers
    paginationVar.value = pagination
    searchFilter.value = searchFilter2
}

const resetFilter = async (searchFilter2: CustomerSearchFilter) => {
    searchFilter.value = searchFilter2
    await search(searchFilter.value)
}

const getCustomersPerPage = async (pageNum: number) => {
    searchFilter.value.page = pageNum
    await search(searchFilter.value)
}
const customerSort = async (value: string) => {
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
        align: 'center',

        searchable: true,
        sortable: true,
    },
    "users.name": {
        align: 'center',

        label: 'Name',
        grow: 'lg',
        renderRow: (row: any) =>
            h('span', row?.user?.first_name + ' ' + row?.user?.last_name),

        sortable: true,
        searchable: true,

    },
    "users.gender": {
        align: 'center',
        sortable: true,
        label: 'Gender',
        renderRow: (row: any) =>
            h(
                VTag,
                {
                    rounded: true,
                    color:
                        row?.user?.gender === 'Male'
                            ? 'primary'
                            : row?.user?.gender === 'Female'
                                ? 'orange'
                                : undefined,
                },
                {
                    default() {
                        return row?.user?.gender
                    },
                }
            ),


        searchable: true,

    },
    'users.phone_number': {
        align: 'center',
        grow: true,
        label: 'Phone',
        renderRow: (row: any) =>
            h('span', row?.user?.phone_number),

        sortable: true,
        searchable: true,


    },
    "users.birth_date": {
        align: 'center',

        label: 'Birth date',
        renderRow: (row: any) =>
            h('span', row?.user?.birth_date),

        searchable: true,
        sortable: true,


    },
    city: {
        align: 'center',

        label: 'City',
        renderRow: (row: any) =>
            h('span', row?.user?.city?.name),

        searchable: true,


    },
    status: {
        align: 'center',

        label: 'status',
        renderRow: (row: any) =>
            h(
                VTag,
                {
                    rounded: true,
                    color:
                        row?.user?.status?.name === 'Pending'
                            ? 'orange'
                            : row?.user?.status?.name === 'Waiting'
                                ? 'blue'
                                : row?.user?.status?.name === 'Approved'
                                    ? 'green'
                                    : row?.user?.status?.name === 'Deleted'
                                        ? 'warning'
                                        : row?.user?.status?.name === 'Busy'
                                            ? 'danger'
                                            : undefined,
                },
                {
                    default() {
                        return row?.user?.status?.name
                    },
                }
            ),
        searchable: true,


    },

    customer_group: {
        align: 'center',

        label: 'Group',
        renderRow: (row: any) =>
            h(
                VTag,
                {
                    rounded: true,
                    color:
                        row?.customer_group?.name === 'normal'
                            ? 'primary'
                            : row?.customer_group?.name === 'vip'
                                ? 'blue'
                                : undefined,
                },
                {
                    default() {
                        return row?.customer_group?.name
                    },
                }
            ),
        searchable: true,


    },
    is_completed: {
        align: 'center',

        label: 'completed',
        renderRow: (row: any) =>
            h(
                VTag,
                {
                    rounded: true,
                    color:
                        row?.is_completed === CustomerConsts.TRUE
                            ? 'primary'
                            : row?.is_completed === CustomerConsts.FALSE
                                ? 'warning'
                                : undefined,
                },
                {
                    default() {
                        return CustomerConsts.showBoolean(row?.is_completed)
                    },
                }
            ),
        searchable: true,
        sortable: true


    },
    created_at: {
        align: 'center',

        label: 'Create Date',
        renderRow: (row: any) =>
            h('span', row?.created_at),
        searchable: true,
        sortable: true
    },
    actions: {
        align: 'center',

        renderRow: (row: any) =>
            h(NoDeleteDropDown, {

                onEdit: () => {
                    router.push({ path: `/customer-edit/${row?.id}/` })
                },
                onView: () => {
                    router.push({ path: `/customer/${row?.id}` })
                },

            }),

    },
} as const
</script>

<template>
    <CustomerTableHeader :key="keyIncrement" :title="viewWrapper.pageTitle"
        :button_name="`Add ${viewWrapper.pageTitle}`" @search="search" :pagination="paginationVar"
        @resetFilter="resetFilter" />
    <VFlexTableWrapper :columns="columns" :data="customersList" :limit="searchFilter.per_page"
        @update:sort="customerSort">

        <VFlexTable separators clickable>
            <template #body>
                <div v-if="customerStore?.loading" class="flex-list-inner">
                    <div v-for="key in paginationVar.per_page" :key="key" class="flex-table-item">
                        <VFlexTableCell>
                            <VPlaceload />
                        </VFlexTableCell>

                    </div>
                </div>
                <div v-else-if="customersList.length === 0" class="flex-list-inner">
                    <VPlaceholderSection title="No matches" subtitle="There is no data that match your search."
                        class="my-6">
                    </VPlaceholderSection>
                </div>

            </template>
        </VFlexTable>
        <VFlexPagination v-if="(customersList.length != 0 && paginationVar.max_page != 1)"
            :current-page="paginationVar.page" class="mt-6" :item-per-page="paginationVar.per_page"
            :total-items="paginationVar.total" :max-links-displayed="3" no-router
            @update:current-page="getCustomersPerPage" />
        <h6 v-if="customersList.length != 0 && !customerStore?.loading">Showing {{ paginationVar.page !=
                paginationVar.max_page
                ?
                (1 + ((paginationVar.page - 1) * paginationVar.count)) : paginationVar.page == 1 ? 1 : paginationVar.total
        }} to {{
        paginationVar.page !=
            paginationVar.max_page ?
            paginationVar.page *
            paginationVar.per_page : paginationVar.total
}} of {{ paginationVar.total }} entries</h6>
        <VPlaceloadText v-if="customerStore?.loading" :lines="1" last-line-width="20%" class="mx-2" />

    </VFlexTableWrapper>

</template>
