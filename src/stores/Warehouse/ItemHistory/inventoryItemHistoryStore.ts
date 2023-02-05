import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { Media } from "/@src/models/Others/Media/media"
import { inventoryItemHistory, addQuantity, withdrawQuantity, InventoryItemHistorySearchFilter, ChangeItemHistoryStatus } from "../../../models/Warehouse/ItemHistory/inventoryItemHistory"
import { uploadMediaApi } from "/@src/utils/api/Others/Media"
import { addQuantityApi, getInternalInventoryMovementsListApi, withdrawQuantityApi, changeItemHistoryStatusApi, getItemHistoryApi } from "../../../utils/api/Warehouse/InventoryItemHistory"
import { Pagination, defaultPagination } from "/@src/utils/response"
import sleep from "/@src/utils/sleep";


export const useinventoryItemHistory = defineStore('inventoryItemHistory', () => {
    const api = useApi()
    const inventoryItemHistories = ref<inventoryItemHistory[]>([])
    const pagination = ref<Pagination>(defaultPagination)
    const loading = ref(false)
    const success = ref<boolean>()
    const error_code = ref<string>()
    const message = ref<string>()

    async function addQuantityStore(addquantity: addQuantity) {
        if (loading.value) return
        loading.value = true
        sleep(2000)
        try {
            const response = await addQuantityApi(api, addquantity)
            var returnedinventoryItemHistory: inventoryItemHistory
            returnedinventoryItemHistory = response.response.data
            inventoryItemHistories.value.push(returnedinventoryItemHistory)
            success.value = response.response.success
            error_code.value = response.response.error_code
            message.value = response.response.message

            return returnedinventoryItemHistory
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
    async function addItemHistoryFileStore(media: FormData) {
        if (loading.value) return
        loading.value = true
        sleep(2000)
        try {
            const response = await uploadMediaApi(api, media)
            var returnedMedia: Media[]
            returnedMedia = response.response.data
            success.value = response.response.success
            error_code.value = response.response.error_code
            message.value = response.response.message

            return returnedMedia

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
    async function withdrawQuantityStore(withdrawquantity: withdrawQuantity) {
        if (loading.value) return
        loading.value = true
        sleep(2000)
        try {
            const response = await withdrawQuantityApi(api, withdrawquantity)
            var returnedinventoryItemHistory: inventoryItemHistory
            returnedinventoryItemHistory = response.response.data
            inventoryItemHistories.value.push(returnedinventoryItemHistory)
            success.value = response.response.success
            error_code.value = response.response.error_code
            message.value = response.response.message

            return returnedinventoryItemHistory
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
    async function getInternalInventoryMovementsListStore(searchFilter: InventoryItemHistorySearchFilter) {
        if (loading.value) return

        loading.value = true

        try {
            const returnedResponse = await getInternalInventoryMovementsListApi(api, searchFilter)
            inventoryItemHistories.value = returnedResponse.response.data
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

    async function changeItemHistoryStatusStore(inventoryItemHistory: ChangeItemHistoryStatus) {
        if (loading.value) return
        loading.value = true
        try {
            const response = await changeItemHistoryStatusApi(api, inventoryItemHistory)
            var returnedItemHistory: inventoryItemHistory
            returnedItemHistory = response.response.data
            inventoryItemHistories.value.splice(
                inventoryItemHistories.value.findIndex((inventoryItemHistoryElement) => (inventoryItemHistoryElement.id = inventoryItemHistory.id)),
                1
            )
            success.value = response.response.success
            error_code.value = response.response.error_code
            message.value = response.response.message

            inventoryItemHistories.value.push(returnedItemHistory)
        } catch (error: any) {
            success.value = error?.response.data.success
            error_code.value = error?.response.data.error_code
            message.value = error?.response.data.message
        }
        finally {
            loading.value = false
        }
    }
    async function getItemHistoryStore(itemId: number,
        searchFilter: InventoryItemHistorySearchFilter) {
        if (loading.value) return
        loading.value = true

        try {
            const returnedResponse = await getItemHistoryApi(api, itemId, searchFilter)
            inventoryItemHistories.value = returnedResponse.response.data
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
        inventoryItemHistories,
        pagination,
        loading,
        addQuantityStore,
        withdrawQuantityStore,
        addItemHistoryFileStore,
        getInternalInventoryMovementsListStore,
        changeItemHistoryStatusStore,
        getItemHistoryStore
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
    import.meta.hot.accept(acceptHMRUpdate(useinventoryItemHistory, import.meta.hot))
}
