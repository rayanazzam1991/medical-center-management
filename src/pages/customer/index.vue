<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { defaultUserSearchFilter } from '/@src/stores/Others/User/userStore'

import { getUsersList } from '/@src/composable/Others/User/getUsersList'
import { deleteUser } from '/@src/composable/Others/User/deleteUser'

import { UserSearchFilter } from '/@src/utils/api/Others/User'
import { defaultPagination } from '/@src/utils/response'
import { useNotyf } from '/@src/composable/useNotyf'
import { getDepartmentsList } from '/@src/composable/Others/Department/getDepartmentsList'
import { Department } from '/@src/utils/api/Others/Department'
import { defaultDepartmentSearchFilter } from '/@src/stores/Others/Department/departmentStore'
import { CustomerSearchFilter } from '/@src/utils/api/CRM/Customer'
import { getCustomersList } from '/@src/composable/CRM/Customer/getCustomersList'
import { defaultCustomerSearchFilter } from '/@src/stores/CRM/Customer/customerStore'
import { CustomerConsts } from '/@src/utils/consts/customer'
import VTag from '/@src/components/base/tags/VTag.vue'
import MyDropDown from '/@src/components/OurComponents/MyDropDown.vue'
import NoDeleteDropDown from '/@src/components/OurComponents/NoDeleteDropDown.vue'
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Customer')
useHead({
    title: 'Customer',
})
const notif = useNotyf()
const searchFilter = ref(defaultCustomerSearchFilter)
const customersList = ref()
const deleteUserPopup = ref(false)
const deleteUserId = ref()
const paginationVar = ref(defaultPagination)
const { customers, pagination } = await getCustomersList(searchFilter.value)
customersList.value = customers
paginationVar.value = pagination
const router = useRouter()


const search = async (searchFilter2: CustomerSearchFilter) => {

    const { customers, pagination } = await getCustomersList(searchFilter2)

    customersList.value = customers
    paginationVar.value = pagination
    searchFilter.value = searchFilter2
}

const resetFilter = async (searchFilter2: CustomerSearchFilter) => {
    searchFilter.value = searchFilter2
    search(searchFilter.value)
}

const getCustomersPerPage = async (pageNum: number) => {
    searchFilter.value.page = pageNum
    search(searchFilter.value)
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
                        row?.user.gender === 'Male'
                            ? 'primary'
                            : row?.user.gender === 'Female'
                                ? 'orange'
                                : undefined,
                },
                {
                    default() {
                        return row?.user.gender
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
                        row?.customer_group.name === 'normal'
                            ? 'primary'
                            : row?.customer_group.name === 'vip'
                                ? 'blue'
                                : undefined,
                },
                {
                    default() {
                        return row?.customer_group.name
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
                    router.push({ path: `/customer-edit/${row.id}/` })
                },
                onView: () => {
                    router.push({ path: `/customer/${row.id}` })
                },

            }),

    },
} as const
</script>

<template>
    <CustomerTableHeader :title="viewWrapper.pageTitle" :button_name="`Add ${viewWrapper.pageTitle}`" @search="search"
        :pagination="paginationVar" @resetFilter="resetFilter" />
    <VFlexTableWrapper :columns="columns" :data="customersList" :limit="searchFilter.per_page"
        @update:sort="customerSort">

        <VFlexTable v-if="(customersList.length != 0)" :clickable="true" :separators="true"></VFlexTable>
        <VFlexPagination v-if="(customersList.length != 0 && paginationVar.max_page != 1)"
            :current-page="paginationVar.page" class="mt-6" :item-per-page="paginationVar.per_page"
            :total-items="paginationVar.total" :max-links-displayed="3" no-router
            @update:current-page="getCustomersPerPage" />
        <h6 v-if="customersList.length != 0">Showing {{ paginationVar.page != paginationVar.max_page
                ?
                (1 + ((paginationVar.page - 1) * paginationVar.count)) : paginationVar.page == 1 ? 1 : paginationVar.total
        }} to {{
        paginationVar.page !=
            paginationVar.max_page ?
            paginationVar.page *
            paginationVar.per_page : paginationVar.total
}} of {{ paginationVar.total }} entries</h6>

        <h1 v-if="customersList.length == 0">No Data Returned...</h1>
    </VFlexTableWrapper>

</template>
