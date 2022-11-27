/**
 * This is a store that hold the messaging-v1 state
 * It uses the useApi composition component to make the api calls
 *
 * @see /src/pages/messaging-v1.vue
 * @see /src/composable/useApi.ts
 * @see /src/components/partials/chat/*.vue
 * @see /src/utils/api/chat
 */

import { ref, computed } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'

import { Department, Room, getRooms, deleteRoomApi } from '/@src/utils/api/Others/Room'
import { useApi } from '/@src/composable/useApi'

const defaultDepartment: Department = {
    id: 0,
    name: '',
    status: 0
}
const defaultRoom: Room = {
    id: 0,
    number: 0,
    floor: 0,
    department_id: defaultDepartment,
    status: 0,
}

export const useRoom = defineStore('room', () => {
    const api = useApi()
    const rooms = ref<Room[]>([])
    const loading = ref(false)

    async function loadRooms(start = 0, limit = 10) {
        if (loading.value) return

        loading.value = true

        try {
            const returnedResponse = await getRooms(api, start, limit)
            rooms.value = returnedResponse.response.data
            console.log(rooms.value)

        } finally {
            loading.value = false
        }
    }
    async function deleteRoomStore(roomId: number) {
        if (loading.value) return

        loading.value = true

        try {
            const response = await deleteRoomApi(api, roomId)
            rooms.value.splice(rooms.value.findIndex((room: Room) => room.id === roomId), 1)

        } finally {
            loading.value = false
        }
    }

    return {
        rooms,
        loadRooms,
        deleteRoomStore
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
