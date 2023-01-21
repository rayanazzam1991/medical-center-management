import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { Room, CreateUpdateRoom, RoomSearchFilter } from "/@src/models/Others/Room/room"
import { deleteRoomApi, getRoomApi, addRoomApi, editRoomApi, getRoomsApi } from "/@src/utils/api/Others/Room"
import { Pagination, defaultPagination } from "/@src/utils/response"
import sleep from "/@src/utils/sleep";



export const useRoom = defineStore('room', () => {
  const api = useApi()
  const rooms = ref<Room[]>([])
  const pagination = ref<Pagination>(defaultPagination)
  const loading = ref(false)
  const success = ref<boolean>()
  const error_code = ref<string>()
  const message = ref<string>()

  async function deleteRoomStore(roomId: number) {
    if (loading.value) return

    loading.value = true

    try {
      const response = await deleteRoomApi(api, roomId)
      rooms.value.splice(
        rooms.value.findIndex((room: Room) => room.id === roomId),
        1
      )
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message

    } catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message
    }
    finally {
      loading.value = false
    }
  }
  async function getRoomStore(roomId: number) {
    if (loading.value) return
    loading.value = true
    sleep(2000)
    try {
      const response = await getRoomApi(api, roomId)
      var returnedRoom: Room
      returnedRoom = response.response.data
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message

      return returnedRoom
    } catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message
    }
    finally {
      loading.value = false
    }
  }
  async function addRoomStore(room: CreateUpdateRoom) {
    if (loading.value) return
    loading.value = true
    sleep(2000)
    try {
      const response = await addRoomApi(api, room)
      var returnedRoom: Room
      returnedRoom = response.response.data
      rooms.value.push(returnedRoom)
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message

      return returnedRoom
    } catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message
    }
    finally {
      loading.value = false
    }
  }
  async function editRoomStore(room: CreateUpdateRoom) {
    if (loading.value) return
    loading.value = true
    sleep(2000)
    try {
      const response = await editRoomApi(api, room)
      var returnedRoom: Room
      returnedRoom = response.response.data
      rooms.value.splice(
        rooms.value.findIndex((roomElement) => (roomElement.id = room.id)),
        1
      )
      rooms.value.push(returnedRoom)
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message

    } catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message
    }
    finally {
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
      success.value = returnedResponse.response.success
      error_code.value = returnedResponse.response.error_code
      message.value = returnedResponse.response.message

    } catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message
    }
    finally {
      loading.value = false
    }
  }

  return {
    success,
    error_code,
    message,
    rooms,
    pagination,
    loading,
    deleteRoomStore,
    addRoomStore,
    editRoomStore,
    getRoomStore,
    getRoomsStore
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
