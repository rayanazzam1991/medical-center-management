<script setup lang="ts">
import { useHead } from '@vueuse/head'
import VTag from '/@src/components/base/tags/VTag.vue'
import MyDropDown from '/@src/components/OurComponents/MyDropDown.vue'
import { deleteUser, getUsersList } from '/@src/services/Others/User/userService'
import { useNotyf } from '/@src/composable/useNotyf'
import { defaultUserSearchFilter, UserSearchFilter } from '/@src/models/Others/User/user'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { defaultPagination } from '/@src/utils/response'
import sleep from '/@src/utils/sleep'
import { Notyf } from 'notyf'
import { useI18n } from 'vue-i18n'
const viewWrapper = useViewWrapper()
const {t} = useI18n()
viewWrapper.setPageTitle(t('user.table.title'))
useHead({
    title: t('user.table.title'),
})
const notif = useNotyf() as Notyf
const searchFilter = ref(defaultUserSearchFilter)
const usersList = ref()
const deleteUserPopup = ref(false)
const deleteUserId = ref()
const paginationVar = ref(defaultPagination)
const { users, pagination } = await getUsersList(searchFilter.value)
usersList.value = users
paginationVar.value = pagination
const router = useRouter()

const removeUser = async (userId: number) => {
    const { message, success } = await deleteUser(userId)
    await search(searchFilter.value)

    deleteUserPopup.value = false
    if (success) {
        await sleep(200);

        // @ts-ignore
        notif.success(t('toast.success.remove'))

    } else {
        await sleep(200);

        notif.error(message)
    }


}
const search = async (searchFilter2: UserSearchFilter) => {

    const { users, pagination } = await getUsersList(searchFilter2)

    usersList.value = users
    paginationVar.value = pagination
    searchFilter.value = searchFilter2
}

const resetFilter = async (searchFilter2: UserSearchFilter) => {
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
        label : t('user.table.columns.id')
    },
    first_name: {
        sortable: true,
        searchable: true,
        label : t('user.table.columns.first_name')

    },
    last_name: {
        sortable: true,
        searchable: true,
        label : t('user.table.columns.last_name')

    },
    gender: {
        sortable: true,
        searchable: true,
        label : t('user.table.columns.gender')

    },
    phone_number: {
        sortable: true,
        searchable: true,
        label : t('user.table.columns.phone')


    },
    room: {
        sortable: true,
        searchable: true,
        label : t('user.table.columns.room'),
        renderRow: (row: any) =>
            h('span', row?.room?.number)
    },

    city: {
        sortable: true,
        searchable: true,
        label : t('user.table.columns.city'),
        renderRow: (row: any) =>
            h('span', row?.city?.name)
    },
    status: {
        sortable: true,
        searchable: true,
        label : t('user.table.columns.status'),
        renderRow: (row: any) =>
            h('span', row?.status?.name)
    },

    actions: {
        align: 'center',
        label : t('user.table.columns.actions'),

        renderRow: (row: any) =>
            h(MyDropDown, {

                onRemove: () => {
                    deleteUserPopup.value = true
                    deleteUserId.value = row.id
                },
                onEdit: () => {
                    router.push({ path: `/user/${row.id}/edit` })
                },
                onView: () => {
                    router.push({ path: `/user/${row.id}` })
                },

            }),

    },
} as const
</script>

<template>
    <UserTableHeader :title="viewWrapper.pageTitle" :button_name="t('user.header_button')" @search="search"
        :pagination="paginationVar" @resetFilter="resetFilter" />
    <VFlexTableWrapper :columns="columns" :data="usersList" @update:sort="userSort">

        <VFlexTable v-if="usersList.length != 0" :clickable="true" :separators="true"></VFlexTable>
        <VFlexPagination v-if="(usersList.length != 0 && paginationVar.max_page != 1)"
            :current-page="paginationVar.page" class="mt-6" :item-per-page="paginationVar.per_page"
            :total-items="paginationVar.total" :max-links-displayed="3" no-router
            @update:current-page="getUsersPerPage" />
        <h6 v-if="usersList.length != 0">
            {{
        t('tables.pagination_footer', { from_number: paginationVar.page !=
          paginationVar.max_page
          ?
          (1 + ((paginationVar.page - 1) * paginationVar.count)) : paginationVar.page == paginationVar.max_page ? (1 +
            ((paginationVar.page - 1) * paginationVar.per_page)) : paginationVar.page == 1 ? 1 : paginationVar.total
        , to_number: paginationVar.page !=
          paginationVar.max_page ?
          paginationVar.page *
          paginationVar.per_page : paginationVar.total, all_number: paginationVar.total
      })}}</h6>

        <h1 v-if="usersList.length == 0">{{ t('user.table.placeholder') }}</h1>
    </VFlexTableWrapper>
    <VModal :title="t('user.table.modal_title.remove')" :open="deleteUserPopup" actions="center" @close="deleteUserPopup = false">
        <template #content>
            <VPlaceholderSection :title="t('modal.delete_modal.title')"
                :subtitle="t('modal.delete_modal.subtitle', {title: viewWrapper.pageTitle})" />
        </template>
        <template #action="{ close }">
            <VButton color="primary" raised @click="removeUser(deleteUserId)">{{t('modal.buttons.confirm')}}</VButton>
        </template>
    </VModal>

</template>
