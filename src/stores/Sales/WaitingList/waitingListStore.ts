import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { WaitingListSearchFilter } from "/@src/models/Sales/WaitingList/waitingList"
import { getWaitingListByProviderIdApi, getWaitingListsListApi } from "/@src/utils/api/Sales/WaitingList"


export const useWaitingList = defineStore('waitingList', () => {
    const api = useApi()
    const loading = ref(false)
    const success = ref<boolean>()
    const error_code = ref<string>()
    const message = ref<string>()

    async function getWaitingListsStore(searchFilter: WaitingListSearchFilter) {
        if (loading.value) return

        loading.value = true

        try {
            const returnedResponse = await getWaitingListsListApi(api, searchFilter)
            success.value = returnedResponse.response.success
            error_code.value = returnedResponse.response.error_code
            message.value = returnedResponse.response.message
            return returnedResponse.response.data


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
    async function getWaitingListByProviderStore(providerId: number) {
        if (loading.value) return

        loading.value = true

        try {
            const returnedResponse = await getWaitingListByProviderIdApi(api, providerId)
            success.value = returnedResponse.response.success
            error_code.value = returnedResponse.response.error_code
            message.value = returnedResponse.response.message
            return returnedResponse.response.data
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
        loading,
        getWaitingListsStore,
        getWaitingListByProviderStore
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
    import.meta.hot.accept(acceptHMRUpdate(useWaitingList, import.meta.hot))
}
