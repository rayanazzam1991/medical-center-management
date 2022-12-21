<script setup lang="ts">
import { useHead } from "@vueuse/head"
import MyDropDown from "/@src/components/OurComponents/MyDropDown.vue"
import { deleteUserStatus, getUserStatusesList } from "/@src/services/Others/UserStatus/userstatusService"
import { useNotyf } from "/@src/composable/useNotyf"
import { defaultUserStatusSearchFilter, UserStatus, UserStatusSearchFilter } from "/@src/models/Others/UserStatus/userStatus"
import { useViewWrapper } from "/@src/stores/viewWrapper"
import { defaultPagination } from "/@src/utils/response"
import { useUserStatus } from "/@src/stores/Others/UserStatus/userStatusStore"

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('UserStatus')
useHead({
    title: 'UserStatus',
})
const notif = useNotyf()
const searchFilter = ref(defaultUserStatusSearchFilter)
const userstatusesList = ref<Array<UserStatus>>([])
const deleteUserStatusPopup = ref(false)
const deleteUserStatusId = ref()
const paginationVar = ref(defaultPagination)
const router = useRouter()
const userStatusStore = useUserStatus()
const keyIncrement = ref(0)
const default_per_page = ref(1)
onMounted(async () => {
    const { userstatuses, pagination } = await getUserStatusesList(searchFilter.value)
    userstatusesList.value = userstatuses
    paginationVar.value = pagination
    keyIncrement.value = keyIncrement.value + 1
    default_per_page.value = pagination.per_page

});


const removeUserStatus = async (userstatusId: number) => {
    const { message, success } = await deleteUserStatus(userstatusId)
    await search(searchFilter.value)

    deleteUserStatusPopup.value = false
    if (success) {

        // @ts-ignore
        notif.success(`${viewWrapper.pageTitle} was deleted successfully`)

    } else notif.error(message)

}

const search = async (searchFilter2: UserStatusSearchFilter) => {
    paginationVar.value.per_page = searchFilter2.per_page ?? paginationVar.value.per_page

    const { userstatuses, pagination } = await getUserStatusesList(searchFilter2)

    userstatusesList.value = userstatuses
    paginationVar.value = pagination
    searchFilter.value = searchFilter2

}

const resetFilter = async (searchFilter2: UserStatusSearchFilter) => {
    searchFilter.value = searchFilter2
    await search(searchFilter.value)
}

const getUserStatusPerPage = async (pageNum: number) => {
    searchFilter.value.page = pageNum
    await search(searchFilter.value)
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
        :pagination="paginationVar" :default_per_page="default_per_page" @resetFilter="resetFilter" />
    <VFlexTableWrapper :columns="columns" :data="userstatusesList" @update:sort="userstatusSort">
        <VFlexTable separators clickable>
            <template #body>
                <div v-if="userStatusStore?.loading" class="flex-list-inner">
                    <div v-for="key in paginationVar.per_page" :key="key" class="flex-table-item">
                        <VFlexTableCell>
                            <VPlaceload />
                        </VFlexTableCell>
                    </div>
                </div>
                <div v-else-if="userstatusesList.length === 0" class="flex-list-inner">
                    <VPlaceholderSection title="No matches" subtitle="There is no data that match your search."
                        class="my-6">
                    </VPlaceholderSection>
                </div>
            </template>
        </VFlexTable>

        <VFlexPagination v-if="(userstatusesList.length != 0 && paginationVar.max_page != 1)"
            :current-page="paginationVar.page" class="mt-6" :item-per-page="paginationVar.per_page"
            :total-items="paginationVar.total" :max-links-displayed="3" no-router
            @update:current-page="getUserStatusPerPage" />
        <h6 v-if="userstatusesList.length != 0 && !userStatusStore?.loading">Showing {{ paginationVar.page !=
                paginationVar.max_page
                ?
                (1 + ((paginationVar.page - 1) * paginationVar.count)) : paginationVar.page == 1 ? 1 : paginationVar.total
        }} to {{
        paginationVar.page !=
            paginationVar.max_page ?
            paginationVar.page *
            paginationVar.per_page : paginationVar.total
}} of {{ paginationVar.total }} entries</h6>

        <VPlaceloadText v-if="userStatusStore?.loading" :lines="1" last-line-width="20%" class="mx-2" />
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

