import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { Media } from "/@src/models/Others/Media/media"
import { itemHistory, addQuantity, withdrawQuantity } from "/@src/models/Warehouse/ItemHistory/itemHistory"
import { uploadMediaApi } from "/@src/utils/api/Others/Media"
import { addQuantityApi, withdrawQuantityApi } from "/@src/utils/api/Warehouse/ItemHistory"
import { Pagination, defaultPagination } from "/@src/utils/response"
import sleep from "/@src/utils/sleep";


export const useitemHistory = defineStore('itemHistory', () => {
    const api = useApi()
    const itemHistories = ref<itemHistory[]>([])
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
            var returneditemHistory: itemHistory
            returneditemHistory = response.response.data
            itemHistories.value.push(returneditemHistory)
            success.value = response.response.success
            error_code.value = response.response.error_code
            message.value = response.response.message

            return returneditemHistory
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
            var returneditemHistory: itemHistory
            returneditemHistory = response.response.data
            itemHistories.value.push(returneditemHistory)
            success.value = response.response.success
            error_code.value = response.response.error_code
            message.value = response.response.message

            return returneditemHistory
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
        itemHistories,
        pagination,
        loading,
        addQuantityStore,
        withdrawQuantityStore,
        addItemHistoryFileStore
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
    import.meta.hot.accept(acceptHMRUpdate(useitemHistory, import.meta.hot))
}
