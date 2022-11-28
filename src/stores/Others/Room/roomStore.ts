import { ref } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'
import {
  RoomSearchFilter,
  Room,
  getRoomsApi,
  deleteRoomApi,
  addRoomApi,
  editRoomApi,
  getRoomApi,
} from '/@src/utils/api/Others/Room'
import { useApi } from '/@src/composable/useApi'
import { Pagination, defaultPagination } from '/@src/utils/response'
import { defaultDepartment } from '../Department/departmentStore'

export const defaultRoom: Room = {
  id: 0,
  number: 0,
  floor: 0,
  department: defaultDepartment,
  status: 0,
}

export const defaultRoomSearchFilter: RoomSearchFilter = {
  number: undefined,
  floor: undefined,
  department: undefined,
  status: undefined,
  page: undefined,
  order: undefined,
  order_by: undefined,
  per_page: undefined,
}

export const useRoom = defineStore('room', () => {
  const api = useApi()
  const rooms = ref<Room[]>([])
  const pagination = ref<Pagination>(defaultPagination)
  const loading = ref(false)

  async function deleteRoomStore(roomId: number) {
    if (loading.value) return

    loading.value = true

    try {
      const response = await deleteRoomApi(api, roomId)
      rooms.value.splice(
        rooms.value.findIndex((room: Room) => room.id === roomId),
        1
      )
    } finally {
      loading.value = false
    }
  }
  async function getRoomStore(roomId: number) {
    if (loading.value) return

    loading.value = true

    try {
      const response = await getRoomApi(api, roomId)
      var returnedRoom: Room
      returnedRoom = response.response.data
      return returnedRoom
    } finally {
      loading.value = false
    }
  }
  async function addRoomStore(room: Room) {
    if (loading.value) return

    loading.value = true

    try {
      const response = await addRoomApi(api, room)
      var returnedRoom: Room
      returnedRoom = response.response.data
      rooms.value.push(returnedRoom)
      return returnedRoom
    } finally {
      loading.value = false
    }
  }
  async function editRoomStore(room: Room) {
    if (loading.value) return

    loading.value = true

    try {
      const response = await editRoomApi(api, room)
      var returnedRoom: Room
      returnedRoom = response.response.data
      rooms.value.splice(
        rooms.value.findIndex((roomElement) => (roomElement.id = room.id)),
        1
      )
      rooms.value.push(returnedRoom)
    } finally {
      loading.value = false
    }
  }
  async function getRoomsStore(searchFilter: RoomSearchFilter) {
    if (loading.value) return

    loading.value = true

    try {
      const returnedResponse = await getRoomsApi(api, searchFilter)
      rooms.value = returnedResponse.response.data
      pagination.value = returnedResponse.response.pagination
    } finally {
      loading.value = false
    }
  }

  return {
    rooms,
    pagination,
    deleteRoomStore,
    addRoomStore,
    editRoomStore,
    getRoomStore,
    getRoomsStore,
  } as const
})

/**
 * Pinia supports Hot Module replacement so you can edit your stores and
 * interact with them directly in your app without reloading the page.
 *
 * @see https://pinia.esm.dev/cookbook/hot-module-replacement.html
 * @see https://vitejs.dev/guide/api-hmr.html
 */
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRoom, import.meta.hot))
}
