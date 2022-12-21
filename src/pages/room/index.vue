<script setup lang="ts">
import { useHead } from '@vueuse/head'
import VTag from '/@src/components/base/tags/VTag.vue'
import MyDropDown from '/@src/components/OurComponents/MyDropDown.vue'
import { deleteRoom, getRoomsList } from '/@src/services/Others/Room/roomSevice'
import { useNotyf } from '/@src/composable/useNotyf'
import { defaultRoomSearchFilter, RoomSearchFilter, RoomConsts, Room } from '/@src/models/Others/Room/room'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { defaultPagination } from '/@src/utils/response'
import { useRoom } from '/@src/stores/Others/Room/roomStore'
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Room')
useHead({
  title: 'Room',
})
const notif = useNotyf()
const searchFilter = ref(defaultRoomSearchFilter)
const roomsList = ref<Array<Room>>([])
const deleteRoomPopup = ref(false)
const deleteRoomId = ref()
const paginationVar = ref(defaultPagination)
const router = useRouter()
const roomStore = useRoom()
const keyIncrement = ref(0)
const default_per_page = ref(1)
onMounted(async () => {
  const { rooms, pagination } = await getRoomsList(searchFilter.value)
  roomsList.value = rooms
  paginationVar.value = pagination
  keyIncrement.value = keyIncrement.value + 1
  default_per_page.value = pagination.per_page

});

const removeRoom = async (roomId: number) => {

  const { message, success } = await deleteRoom(roomId)
  await search(searchFilter.value)
  deleteRoomPopup.value = false
  if (success) {

    // @ts-ignore
    notif.success(`${viewWrapper.pageTitle} was deleted successfully`)
  }
  else notif.error(message)

}
const search = async (searchFilter2: RoomSearchFilter) => {
  paginationVar.value.per_page = searchFilter2.per_page ?? paginationVar.value.per_page

  const { rooms, pagination } = await getRoomsList(searchFilter2)

  roomsList.value = rooms
  paginationVar.value = pagination
  searchFilter.value = searchFilter2
}

const resetFilter = async (searchFilter2: RoomSearchFilter) => {
  searchFilter.value = searchFilter2
  await search(searchFilter.value)
}

const getRoomsPerPage = async (pageNum: number) => {
  searchFilter.value.page = pageNum
  await search(searchFilter.value)
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
    label: 'Department',
    renderRow: (row: any) =>
      h('span', row?.department?.name)
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
  <RoomTableHeader :key="keyIncrement" :title="viewWrapper.pageTitle" :button_name="`Add ${viewWrapper.pageTitle}`"
    @search="search" :pagination="paginationVar"  :default_per_page="default_per_page" @resetFilter="resetFilter" />
  <VFlexTableWrapper :columns="columns" :data="roomsList" @update:sort="roomSort">
    <VFlexTable separators clickable>
      <template #body>
        <div v-if="roomStore?.loading" class="flex-list-inner">
          <div v-for="key in paginationVar.per_page" :key="key" class="flex-table-item">
            <VFlexTableCell>
              <VPlaceload />
            </VFlexTableCell>
          </div>
        </div>
        <div v-else-if="roomsList.length === 0" class="flex-list-inner">
          <VPlaceholderSection title="No matches" subtitle="There is no data that match your search." class="my-6">
          </VPlaceholderSection>
        </div>
      </template>
    </VFlexTable>
    <VFlexPagination v-if="(roomsList.length != 0 && paginationVar.max_page != 1)" :current-page="paginationVar.page"
      class="mt-6" :item-per-page="paginationVar.per_page" :total-items="paginationVar.total" :max-links-displayed="3"
      no-router @update:current-page="getRoomsPerPage" />
    <h6 v-if="roomsList.length != 0 && !roomStore?.loading">Showing {{ paginationVar.page !=
        paginationVar.max_page
        ?
        (1 + ((paginationVar.page - 1) * paginationVar.count)) : paginationVar.page == 1 ? 1 : paginationVar.total
    }} to {{
    paginationVar.page !=
      paginationVar.max_page ?
      paginationVar.page *
      paginationVar.per_page : paginationVar.total
}} of {{ paginationVar.total }} entries</h6>

    <VPlaceloadText v-if="roomStore?.loading" :lines="1" last-line-width="20%" class="mx-2" />
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
