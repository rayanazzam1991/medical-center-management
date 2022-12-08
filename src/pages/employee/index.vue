<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { defaultEmployeeSearchFilter } from '/@src/stores/Others/Employee/userStore'

import { getEmployeesList } from '/@src/composable/Employee/getEmployeesList'
import { EmployeeSearchFilter } from '/@src/utils/api/Employee'
import { defaultPagination } from '/@src/utils/response'
import { useNotyf } from '/@src/composable/useNotyf'
import { getDepartmentsList } from '/@src/composable/Others/Department/getDepartmentsList'
import { Department } from '/@src/utils/api/Others/Department'
import { defaultDepartmentSearchFilter } from '/@src/stores/Others/Department/departmentStore'
import VTag from '/@src/components/base/tags/VTag.vue'
import MyDropDown from '/@src/components/OurComponents/MyDropDown.vue'
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

const getUsersPerPage = async (pageNum: number) => {
    searchFilter.value.page = pageNum
    search(searchFilter.value)
}
const userSort = async (value: string) => {
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
    first_name: {
        sortable: true,
        searchable: true,

    },
    last_name: {
        sortable: true,
        searchable: true,

    },
    gender: {
        sortable: true,
        searchable: true,

    },
    phone_number: {
        sortable: true,
        searchable: true,

    },
    room: {
        sortable: true,
        searchable: true,
        label: 'Room',
        renderRow: (row: any) =>
            h('span', row?.room?.number)
    },

    city: {
        sortable: true,
        searchable: true,
        label: 'City',
        renderRow: (row: any) =>
            h('span', row?.city?.name)
    },
    status: {
        sortable: true,
        searchable: true,
        label: 'UserStatus',
        renderRow: (row: any) =>
            h('span', row?.status?.name)
    },

    actions: {
        align: 'center',

        renderRow: (row: any) =>
            h(MyDropDown, {
                onEdit: () => {
                    router.push({ path: `/employee/${row.id}/edit` })
                },
                onView: () => {
                    router.push({ path: `/employee/${row.id}` })
                },

            }),

    },
} as const
</script>

<template>
    <UserTableHeader :title="viewWrapper.pageTitle" :button_name="`Add ${viewWrapper.pageTitle}`" @search="search"
        :pagination="paginationVar" @resetFilter="resetFilter" />
    <VFlexTableWrapper :columns="columns" :data="employeesList" @update:sort="userSort">

        <VFlexTable v-if="employeesList.length != 0" :clickable="true" :separators="true"></VFlexTable>
        <VFlexPagination v-if="employeesList.length != 0" :current-page="paginationVar.page" class="mt-6"
            :item-per-page="paginationVar.per_page" :total-items="paginationVar.total" :max-links-displayed="3"
            no-router @update:current-page="getUsersPerPage" />
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
