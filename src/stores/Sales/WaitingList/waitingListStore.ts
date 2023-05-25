import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { ServiceCard, ServiceCardsListSearchFilter, WaitingListSearchFilter } from "/@src/models/Sales/WaitingList/waitingList"
import { getServiceCardsListApi, getWaitingListByProviderIdApi, getWaitingListByTicketIdApi, getWaitingListsListApi, sendAlertToProviderApi, serveNextTicketInProviderWaitingListApi } from "/@src/utils/api/Sales/WaitingList"
import { Pagination, defaultPagination } from "/@src/utils/response"


export const useWaitingList = defineStore('waitingList', () => {
    const api = useApi()
    const loading = ref(false)
    const success = ref<boolean>()
    const error_code = ref<string>()
    const message = ref<string>()
    const pagination = ref<Pagination>(defaultPagination)
    const serviceCardsList = ref<ServiceCard[]>([])

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
    async function serveNextTicketInProviderWaitingListStore(providerId: number) {
        if (loading.value) return

        loading.value = true

        try {
            const returnedResponse = await serveNextTicketInProviderWaitingListApi(api, providerId)
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
    async function getWaitingListByTicketIdStore(ticketId: number) {
        if (loading.value) return

        loading.value = true

        try {
            const returnedResponse = await getWaitingListByTicketIdApi(api, ticketId)
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
    async function getServiceCardsListStore(searchFilter: ServiceCardsListSearchFilter) {
        if (loading.value) return

        loading.value = true

        try {
            const returnedResponse = await getServiceCardsListApi(api, searchFilter)
            serviceCardsList.value = returnedResponse.response.data
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
    async function sendAlertToProviderStore(providerId: number) {
        if (loading.value) return
        loading.value = true
        try {
            const returnedResponse = await sendAlertToProviderApi(api, providerId)
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
        loading,
        pagination,
        serviceCardsList,
        getWaitingListsStore,
        getWaitingListByProviderStore,
        serveNextTicketInProviderWaitingListStore,
        getWaitingListByTicketIdStore,
        getServiceCardsListStore,
        sendAlertToProviderStore
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
