import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { Room, CreateUpdateRoom, RoomSearchFilter } from "/@src/models/Others/Room/room"
import { getRoleApi, getRolesApi, updateRolePermissionsApi } from "/@src/utils/api/Others/Role"
import { deleteRoomApi, getRoomApi, addRoomApi, editRoomApi, getRoomsApi } from "/@src/utils/api/Others/Room"
import { Role } from "/@src/utils/consts/rolesPermissions"
import { Pagination, defaultPagination } from "/@src/utils/response"
import sleep from "/@src/utils/sleep";



export const useRole = defineStore('role', () => {
    const api = useApi()
    const roles = ref<Role[]>([])
    const pagination = ref<Pagination>(defaultPagination)
    const loading = ref(false)
    const success = ref<boolean>()
    const error_code = ref<string>()
    const message = ref<string>()

    async function getRolesStore() {
        if (loading.value) return

        loading.value = true

        try {
            const returnedResponse = await getRolesApi(api)
            roles.value = returnedResponse.response.data
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
    async function getRoleStore(roleId: number) {
        if (loading.value) return

        loading.value = true

        try {
            const returnedResponse = await getRoleApi(api, roleId)
            success.value = returnedResponse.response.success
            error_code.value = returnedResponse.response.error_code
            message.value = returnedResponse.response.message
            return returnedResponse.response.data as Role

        } catch (error: any) {
            success.value = error?.response.data.success
            error_code.value = error?.response.data.error_code
            message.value = error?.response.data.message
        }
        finally {
            loading.value = false
        }
    }

    async function updateRolePermissionsStore(roleId: number, permissions: String[]) {
        if (loading.value) return

        loading.value = true

        try {
            const returnedResponse = await updateRolePermissionsApi(api, roleId, permissions)
            success.value = returnedResponse.response.success
            error_code.value = returnedResponse.response.error_code
            message.value = returnedResponse.response.message
            return returnedResponse.response.data as Role

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
        roles,
        pagination,
        loading,
        getRolesStore,
        getRoleStore,
        updateRolePermissionsStore
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
    import.meta.hot.accept(acceptHMRUpdate(useRole, import.meta.hot))
}
