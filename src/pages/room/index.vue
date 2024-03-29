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
import sleep from '/@src/utils/sleep'
import { Notyf } from 'notyf'
import { useI18n } from 'vue-i18n'
const viewWrapper = useViewWrapper()
const {t} = useI18n()
viewWrapper.setPageTitle(t('room.table.title'))
useHead({
  title: t('room.table.title'),
})
const notif = useNotyf() as Notyf
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
    await sleep(200);

    notif.success(t('toast.success.remove'))
  }
  else {
    await sleep(200);
    notif.error(message)

  }

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
    align: 'center',
    label : t('room.table.columns.id')
    
  },
  number: {
    sortable: true,
    align: 'center',
    searchable: true,
    label : t('room.table.columns.number')


  },
  floor: {
    sortable: true,
    align: 'center',
    searchable: true,
    label : t('room.table.columns.floor')

  },
  department: {
    sortable: true,
    searchable: true,
    align: 'center',
    label : t('room.table.columns.department'),
    renderRow: (row: any) =>
      h('span', row?.department?.name)
  },
  status: {
    align: 'center',
    label : t('room.table.columns.status'),

    renderRow: (row: any) =>
      h(
        VTag,
        {
          rounded: true,
          color:
            row.status === RoomConsts.INACTIVE
              ? 'danger'
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
    label : t('room.table.columns.actions'),

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
  <RoomTableHeader :key="keyIncrement" :title="viewWrapper.pageTitle" :button_name="t('room.header_button')"
    @search="search" :pagination="paginationVar" :default_per_page="default_per_page" @resetFilter="resetFilter" />
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
          <VPlaceholderSection :title="t('tables.placeholder.title')" 
          :subtitle="t('tables.placeholder.subtitle')" class="my-6">
          </VPlaceholderSection>
        </div>
      </template>
    </VFlexTable>
    <VFlexPagination v-if="(roomsList.length != 0 && paginationVar.max_page != 1)" :current-page="paginationVar.page"
      class="mt-6" :item-per-page="paginationVar.per_page" :total-items="paginationVar.total" :max-links-displayed="3"
      no-router @update:current-page="getRoomsPerPage" />
    <h6 v-if="roomsList.length != 0 && !roomStore?.loading">
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

    <VPlaceloadText v-if="roomStore?.loading" :lines="1" last-line-width="20%" class="mx-2" />
  </VFlexTableWrapper>
  <VModal :title="t('room.table.modal_title')" :open="deleteRoomPopup" actions="center" @close="deleteRoomPopup = false">
    <template #content>
      <VPlaceholderSection :title="t('modal.delete_modal.title')"
        :subtitle="t('modal.delete_modal.subtitle',{title : viewWrapper.pageTitle})" />
    </template>
    <template #action="{ close }">
      <VButton color="primary" raised @click="removeRoom(deleteRoomId)">{{t('modal.buttons.confirm')}}</VButton>
    </template>
  </VModal>

</template>
