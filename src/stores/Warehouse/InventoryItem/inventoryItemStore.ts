import { AxiosInstance } from "axios";
import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { CreateInventoryItem, InventoryItem } from "/@src/models/Warehouse/InventoryItem/inventoryItem";
import { fromMainInventoryApi, toMainInventoryApi } from "/@src/utils/api/Warehouse/InventoryItem";
import { Pagination, defaultPagination } from "/@src/utils/response"
import sleep from "/@src/utils/sleep";


export const useInventoryItem = defineStore('inventoryItem', () => {
    const api = useApi()
    const inventoryItems = ref<InventoryItem[]>([])
    const pagination = ref<Pagination>(defaultPagination)
    const loading = ref(false)
    const success = ref<boolean>()
    const error_code = ref<string>()
    const message = ref<string>()

    async function fromMainInventoryStore(inventoryItem: CreateInventoryItem) {
        if (loading.value) return
        loading.value = true
        sleep(2000)
        try {
            const response = await fromMainInventoryApi(api, inventoryItem)

            let returnedInventoryItem: InventoryItem
            returnedInventoryItem = response.response.data
            inventoryItems.value.push(returnedInventoryItem)
            success.value = response.response.success
            error_code.value = response.response.error_code
            message.value = response.response.message

            return returnedInventoryItem
        } catch (error: any) {
            success.value = error?.response.data.success
            error_code.value = error?.response.data.error_code
            message.value = error?.response.data.message

        }

        finally {
            loading.value = false
        }
    }
    async function toMainInventoryStore(inventoryItem: CreateInventoryItem) {
        if (loading.value) return
        loading.value = true
        sleep(2000)
        try {
            const response = await toMainInventoryApi(api, inventoryItem)

            let returnedInventoryItem: InventoryItem
            returnedInventoryItem = response.response.data
            inventoryItems.value.push(returnedInventoryItem)
            success.value = response.response.success
            error_code.value = response.response.error_code
            message.value = response.response.message

            return returnedInventoryItem
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
        inventoryItems,
        pagination,
        loading,
        fromMainInventoryStore,
        toMainInventoryStore,
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
    import.meta.hot.accept(acceptHMRUpdate(useInventoryItem, import.meta.hot))
}
function fromMainInventory(api: AxiosInstance, inventoryItem: CreateInventoryItem) {
    throw new Error("Function not implemented.");
}

