<script setup lang="ts">
import { useHead } from "@vueuse/head"
import MyDropDown from "/@src/components/OurComponents/MyDropDown.vue"
import { deleteUserStatus, getUserStatusesList } from "/@src/services/Others/UserStatus/userstatusService"
import { useNotyf } from "/@src/composable/useNotyf"
import { defaultUserStatusSearchFilter, UserStatusSearchFilter } from "/@src/models/Others/UserStatus/userStatus"
import { useViewWrapper } from "/@src/stores/viewWrapper"
import { defaultPagination } from "/@src/utils/response"

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('UserStatus')
useHead({
    title: 'UserStatus',
})
const notif = useNotyf()
const searchFilter = ref(defaultUserStatusSearchFilter)
const userstatusesList = ref()
const deleteUserStatusPopup = ref(false)
const deleteUserStatusId = ref()
const paginationVar = ref(defaultPagination)
const { userstatuses, pagination } = await getUserStatusesList(searchFilter.value)
userstatusesList.value = userstatuses
paginationVar.value = pagination
const router = useRouter()

const removeUserStatus = async (userstatusId: number) => {

    await deleteUserStatus(userstatusId)
    deleteUserStatusPopup.value = false
    // @ts-ignore
    notif.success(`${viewWrapper.pageTitle} was deleted successfully`)

}

const search = async (searchFilter2: UserStatusSearchFilter) => {

    const { userstatuses, pagination } = await getUserStatusesList(searchFilter2)

    userstatusesList.value = userstatuses
    paginationVar.value = pagination
    searchFilter.value = searchFilter2

}

const resetFilter = async (searchFilter2: UserStatusSearchFilter) => {
    searchFilter.value = searchFilter2
    search(searchFilter.value)
}

const getUserStatusPerPage = async (pageNum: number) => {
    searchFilter.value.page = pageNum
    search(searchFilter.value)
}
const userstatusSort = async (value: string) => {
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
        sortable: true,

    },
    name: {
        align: 'center',
        sortable: true,


    },
    actions: {
        align: 'center',

        renderRow: (row: any) =>
            h(MyDropDown, {

                onRemove: () => {
                    deleteUserStatusPopup.value = true
                    deleteUserStatusId.value = row.id
                },
                onEdit: () => {
                    router.push({ path: `/userstatus/${row.id}/edit` })
                },
                onView: () => {
                    router.push({ path: `/userstatus/${row.id}` })
                },

            }),

    },
} as const
</script>

<template>
    <UserStatusTableHeader :title="viewWrapper.pageTitle" :button_name="`Add ${viewWrapper.pageTitle}`" @search="search"
        :pagination="paginationVar" @resetFilter="resetFilter" />
    <VFlexTableWrapper :columns="columns" :data="userstatusesList" @update:sort="userstatusSort">

        <VFlexTable v-if="userstatusesList.length != 0" :clickable="true" :separators="true"></VFlexTable>
        <VFlexPagination v-if="(userstatusesList.length != 0 && paginationVar.max_page != 1)"
            :current-page="paginationVar.page" class="mt-6" :item-per-page="paginationVar.per_page"
            :total-items="paginationVar.total" :max-links-displayed="3" no-router
            @update:current-page="getUserStatusPerPage" />
        <h6 v-if="userstatusesList.length != 0">Showing {{ paginationVar.page != paginationVar.max_page
                ?
                (1 + ((paginationVar.page - 1) * paginationVar.count)) : paginationVar.page == 1 ? 1 : paginationVar.total
        }} to {{
        paginationVar.page !=
            paginationVar.max_page ?
            paginationVar.page *
            paginationVar.per_page : paginationVar.total
}} of {{ paginationVar.total }} entries</h6>

        <h1 v-if="userstatusesList.length == 0">No Data Returned...</h1>
    </VFlexTableWrapper>
    <VModal title="Remove UserStatus" :open="deleteUserStatusPopup" actions="center"
        @close="deleteUserStatusPopup = false">
        <template #content>
            <VPlaceholderSection title="Are you sure?"
                :subtitle="`you are about to delete this ${viewWrapper.pageTitle} permenantly`" />
        </template>
        <template #action="{ close }">
            <VButton color="primary" raised @click="removeUserStatus(deleteUserStatusId)">Confirm</VButton>
        </template>
    </VModal>
</template>

