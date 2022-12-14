<script setup lang="ts">
import { useHead } from '@vueuse/head'
import VTag from '/@src/components/base/tags/VTag.vue'
import MyDropDown from '/@src/components/OurComponents/MyDropDown.vue'
import NoDeleteDropDown from '/@src/components/OurComponents/NoDeleteDropDown.vue'
import { getEmployeesList } from '/@src/composable/Employee/getEmployeesList'
import { useNotyf } from '/@src/composable/useNotyf'
import { defaultEmployeeSearchFilter, EmployeeSearchFilter } from '/@src/models/Employee/employee'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { defaultPagination } from '/@src/utils/response'
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Employee')
useHead({
    title: 'Employee',
})
const notif = useNotyf()
const searchFilter = ref(defaultEmployeeSearchFilter)
const employeesList = ref()
const paginationVar = ref(defaultPagination)
const { employees, pagination } = await getEmployeesList(searchFilter.value)
employeesList.value = employees
paginationVar.value = pagination
const router = useRouter()

const search = async (searchFilter2: EmployeeSearchFilter) => {

    const { employees, pagination } = await getEmployeesList(searchFilter2)

    employeesList.value = employees
    paginationVar.value = pagination
    searchFilter.value = searchFilter2
}

const resetFilter = async (searchFilter2: EmployeeSearchFilter) => {
    searchFilter.value = searchFilter2
    search(searchFilter.value)
}

const getEmployeesPerPage = async (pageNum: number) => {
    searchFilter.value.page = pageNum
    search(searchFilter.value)
}
const employeeSort = async (value: string) => {
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
        sortable: true

    },
    "users.phone_number": {
        align: 'center',
        grow: true,
        label: 'Phone',
        renderRow: (row: any) =>
            h('span', row?.user?.phone_number),

        sortable: true,
        searchable: true,


    },
    "users.starting_date": {
        align: 'center',

        label: 'Starting date',
        renderRow: (row: any) =>
            h('span', row?.starting_date),

        searchable: true,


    },
    nationality: {
        align: 'center',

        label: 'Nationality',
        renderRow: (row: any) =>
            h('span', row?.nationality?.name),

        searchable: true,


    },
    department: {
        align: 'center',
        grow: true,
        label: 'Department',
        renderRow: (row: any) =>
            h('span', row?.user?.room?.department?.name),

        searchable: true,


    },
    room: {
        align: 'center',
        label: 'Room',
        renderRow: (row: any) =>
            h('span', row?.user?.room?.number),

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
            h(NoDeleteDropDown, {
                onEdit: () => {
                    router.push({ path: `/employee-edit/${row?.id}/` })
                },
                onView: () => {
                    router.push({ path: `/employee/${row?.id}` })
                },

            }),

    },
} as const
</script>

<template>
    <EmployeeTableHeader :title="viewWrapper.pageTitle" :button_name="`Add ${viewWrapper.pageTitle}`" @search="search"
        :pagination="paginationVar" @resetFilter="resetFilter" />
    <VFlexTableWrapper :columns="columns" :data="employeesList" :limit="searchFilter.per_page"
        @update:sort="employeeSort">

        <VFlexTable v-if="employeesList.length != 0" :clickable="true" :separators="true"></VFlexTable>
        <VFlexPagination v-if="(employeesList.length != 0 && paginationVar.max_page != 1)"
            :current-page="paginationVar.page" class="mt-6" :item-per-page="paginationVar.per_page"
            :total-items="paginationVar.total" :max-links-displayed="3" no-router
            @update:current-page="getEmployeesPerPage" />
        <h6 v-if="employeesList.length != 0">Showing {{ paginationVar.page != paginationVar.max_page
                ?
                (1 + ((paginationVar.page - 1) * paginationVar.count)) : paginationVar.page == 1 ? 1 : paginationVar.total
        }} to {{
        paginationVar.page !=
            paginationVar.max_page ?
            paginationVar.page *
            paginationVar.per_page : paginationVar.total
}} of {{ paginationVar.total }} entries</h6>

        <h1 v-if="employeesList.length == 0">No Data Returned...</h1>
    </VFlexTableWrapper>

</template>
