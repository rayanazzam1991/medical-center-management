import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { CreateTicketService, TicketService, TicketServiceSearchFilter } from "/@src/models/Sales/TicketService/ticketService"
import { createTicketServiceApi, deleteTicketServiceApi, getTicktServiceApi, getTicktServicesListApi, serveTicketServiceApi } from "/@src/utils/api/Sales/TicketService"
import { defaultPagination, Pagination } from "/@src/utils/response"


export const useTicketService = defineStore('ticketService', () => {
    const api = useApi()
    const loading = ref(false)
    const success = ref<boolean>()
    const error_code = ref<string>()
    const message = ref<string>()
    const pagination = ref<Pagination>(defaultPagination)

    async function serveTicketServiceStore(ticketServiceId: number, ticketServiceNote: string | undefined) {
        if (loading.value) return

        loading.value = true

        try {
            const returnedResponse = await serveTicketServiceApi(api, ticketServiceId, ticketServiceNote)
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

    async function getTicktServicesListStore(searchFilter: TicketServiceSearchFilter) {
        if (loading.value) return

        loading.value = true

        try {
            const returnedResponse = await getTicktServicesListApi(api, searchFilter)
            pagination.value = returnedResponse.response.pagination
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

    async function getTicketServiceStore(ticketServiceId: number) {
        if (loading.value) return

        loading.value = true
        try {
            const returnedResponse = await getTicktServiceApi(api, ticketServiceId)
            success.value = returnedResponse.response.success
            error_code.value = returnedResponse.response.error_code
            message.value = returnedResponse.response.message
            return returnedResponse.response.data as TicketService

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
    async function createTicketServiceStore(data: CreateTicketService) {
        if (loading.value) return

        loading.value = true
        try {
            const returnedResponse = await createTicketServiceApi(api, data)
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
    async function deleteTicketServiceStore(ticketServiceId: number) {
        if (loading.value) return

        loading.value = true
        try {
            const returnedResponse = await deleteTicketServiceApi(api, ticketServiceId)
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
        serveTicketServiceStore,
        getTicktServicesListStore,
        getTicketServiceStore,
        createTicketServiceStore,
        deleteTicketServiceStore
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
    import.meta.hot.accept(acceptHMRUpdate(useTicketService, import.meta.hot))
}
