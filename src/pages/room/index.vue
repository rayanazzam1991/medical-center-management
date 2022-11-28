<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import VTag from '/@src/components/base/tags/VTag.vue'
import { RoomConsts } from '/@src/utils/consts/room'
import { defaultRoomSearchFilter } from '/@src/stores/Others/Room/roomStore'

import { getRoomsList } from '/@src/composable/Others/Room/getRoomsList'
import { deleteRoom } from '/@src/composable/Others/Room/deleteRoom'
import MyDropDown from '/@src/components/OurComponents/MyDropDown.vue'
import { RoomSearchFilter } from '/@src/utils/api/Others/Room'
import { defaultPagination } from '/@src/utils/response'
import { useNotyf } from '/@src/composable/useNotyf'
import { getDepartmentsList } from '/@src/composable/Others/Department/getDepartmentsList'
import { Department } from '/@src/utils/api/Others/Department'
import { defaultDepartmentSearchFilter } from '/@src/stores/Others/Department/departmentStore'
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Room')
useHead({
  title: 'Room',
})
const notif = useNotyf()
const searchFilter = ref(defaultRoomSearchFilter)
const roomsList = ref()
const deleteRoomPopup = ref(false)
const deleteRoomId = ref()
const paginationVar = ref(defaultPagination)
const { rooms, pagination } = await getRoomsList(searchFilter.value)
roomsList.value = rooms
paginationVar.value = pagination
const router = useRouter()

const removeRoom = async (roomId: number) => {

  await deleteRoom(roomId)
  deleteRoomPopup.value = false
  // @ts-ignore
  notif.success(`${viewWrapper.pageTitle} was deleted successfully`)

}
const search = async (searchFilter2: RoomSearchFilter) => {

  const { rooms, pagination } = await getRoomsList(searchFilter2)

  roomsList.value = rooms
  paginationVar.value = pagination
  searchFilter.value = searchFilter2
}

const resetFilter = async (searchFilter2: RoomSearchFilter) => {
  searchFilter.value = searchFilter2
  search(searchFilter.value)
}

const getRoomsPerPage = async (pageNum: number) => {
  searchFilter.value.page = pageNum
  search(searchFilter.value)
}
const roomSort = async (value: string) => {
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
  number: {
    sortable: true,
    searchable: true,

  },
  floor: {
    sortable: true,
    searchable: true,

  },
  department: {
    sortable: true,
    searchable: true,
    label: 'Deoartment',
    renderRow: (row: any) =>
      h('span', row.department.name)
  },
  status: {
    align: 'center',

    renderRow: (row: any) =>
      h(
        VTag,
        {
          rounded: true,
          color:
            row.status === RoomConsts.INACTIVE
              ? 'orange'
              : row.status === RoomConsts.ACTIVE
                ? 'success'
                : undefined,
        },
        {
          default() {
            return RoomConsts.showStatusName(row.status)
          },
        }
      ),

  },

  actions: {
    align: 'center',

    renderRow: (row: any) =>
      h(MyDropDown, {

        onRemove: () => {
          deleteRoomPopup.value = true
          deleteRoomId.value = row.id
        },
        onEdit: () => {
          router.push({ path: `/room/${row.id}/edit` })
        },
        onView: () => {
          router.push({ path: `/room/${row.id}` })
        },

      }),

  },
} as const
</script>

<template>
  <RoomTableHeader :title="viewWrapper.pageTitle" :button_name="`Add ${viewWrapper.pageTitle}`" @search="search"
    :pagination="paginationVar" @resetFilter="resetFilter" />
  <VFlexTableWrapper :columns="columns" :data="roomsList" @update:sort="roomSort">

    <VFlexTable v-if="roomsList.length != 0" :clickable="true" :separators="true"></VFlexTable>
    <VFlexPagination v-if="roomsList.length != 0" :current-page="paginationVar.page" class="mt-6"
      :item-per-page="paginationVar.per_page" :total-items="paginationVar.total" :max-links-displayed="3" no-router
      @update:current-page="getRoomsPerPage" />
    <h6 v-if="roomsList.length != 0">Showing {{ paginationVar.page != paginationVar.max_page
        ?
        (1 + ((paginationVar.page - 1) * paginationVar.count)) : paginationVar.page == 1 ? 1 : paginationVar.total
    }} to {{
    paginationVar.page !=
      paginationVar.max_page ?
      paginationVar.page *
      paginationVar.per_page : paginationVar.total
}} of {{ paginationVar.total }} entries</h6>

    <h1 v-if="roomsList.length == 0">No Data Returned...</h1>
  </VFlexTableWrapper>
  <VModal title="Remove Room" :open="deleteRoomPopup" actions="center" @close="deleteRoomPopup = false">
    <template #content>
      <VPlaceholderSection title="Are you sure?"
        :subtitle="`you are about to delete this ${viewWrapper.pageTitle} permenantly`" />
    </template>
    <template #action="{ close }">
      <VButton color="primary" raised @click="removeRoom(deleteRoomId)">Confirm</VButton>
    </template>
  </VModal>

</template>
