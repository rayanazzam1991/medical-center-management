import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { PermissionGroup, PermissionGroupSearchFilter } from "/@src/models/Others/PermissionGroup/permissionGroup"
import { getPermissionGroupsListApi } from "/@src/utils/api/Others/PermissionGroup"



export const usePermissionGroup = defineStore('permissionGroup', () => {
    const api = useApi()
    const permissionGroups = ref<PermissionGroup[]>([])
    const loading = ref(false)
    const success = ref<boolean>()
    const error_code = ref<string>()
    const message = ref<string>()

    async function getPermissionGroupsStore(filter: PermissionGroupSearchFilter) {
        if (loading.value) return

        loading.value = true

        try {
            const returnedResponse = await getPermissionGroupsListApi(api, filter)
            permissionGroups.value = returnedResponse.response.data
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
        permissionGroups,
        loading,
        getPermissionGroupsStore,
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
    import.meta.hot.accept(acceptHMRUpdate(usePermissionGroup, import.meta.hot))
}
