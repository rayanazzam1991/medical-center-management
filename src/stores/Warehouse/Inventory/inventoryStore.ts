import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { Inventory, InventorySearchFilter } from "/@src/models/Warehouse/Inventory/inventory";
import { getInventoriesApi } from "/@src/utils/api/Warehouse/Inventory";
import { Pagination, defaultPagination } from "/@src/utils/response"
import sleep from "/@src/utils/sleep";


export const useInventory = defineStore('inventory', () => {
    const api = useApi()
    const inventories = ref<Inventory[]>([])
    const pagination = ref<Pagination>(defaultPagination)
    const loading = ref(false)
    const success = ref<boolean>()
    const error_code = ref<string>()
    const message = ref<string>()



    async function getInventoriesStore(searchFilter: InventorySearchFilter) {
        if (loading.value) return
        loading.value = true
        try {
            const returnedResponse = await getInventoriesApi(api, searchFilter)

            inventories.value = returnedResponse.response.data
            pagination.value = returnedResponse.response.pagination
            success.value = returnedResponse.response.success
            error_code.value = returnedResponse.response.error_code
            message.value = returnedResponse.response.message

        }
        catch (error: any) {
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
        inventories,
        pagination,
        loading,
        getInventoriesStore,
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
    import.meta.hot.accept(acceptHMRUpdate(useInventory, import.meta.hot))
}
