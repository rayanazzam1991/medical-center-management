import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { CreateUpdateServiceHistoryScreen, ServiceHistoryScreen, ServiceHistoryScreenDetails, ServiceHistoryScreenSearchFilter } from "/@src/models/Sales/ServiceHistoryScreen/serviceHistoryScreen"
import { createServiceHistoryScreenApi, getServiceHistoryScreenForEditApi, getServiceHistoryScreensListApi, updateServiceHistoryScreenApi,getServiceHistoryScreensApi } from "/@src/utils/api/Sales/ServiceHistoryScreen"
import { Pagination, defaultPagination } from "/@src/utils/response"


export const useServiceHistoryScreen = defineStore('serviceHistoryScreen', () => {
    const api = useApi()
    const loading = ref(false)
    const success = ref<boolean>()
    const error_code = ref<string>()
    const message = ref<string>()
    const serviceHistoryScreens = ref<ServiceHistoryScreen[]>([])
    const pagination = ref<Pagination>(defaultPagination)

    async function createServiceHistoryScreenStore(serviceHistoryScreen: CreateUpdateServiceHistoryScreen) {
        if (loading.value) return

        loading.value = true

        try {
            const returnedResponse = await createServiceHistoryScreenApi(api, serviceHistoryScreen)
            success.value = returnedResponse.response.success
            error_code.value = returnedResponse.response.error_code
            message.value = returnedResponse.response.message
            return returnedResponse.response.data as ServiceHistoryScreen
        } catch (error: any) {
            success.value = error?.response.data.success
            error_code.value = error?.response.data.error_code
            message.value = error?.response.data.message
        }
        finally {
            loading.value = false
        }
    }
    async function updateServiceHistoryScreenStore(screenId: number, serviceHistoryScreen: CreateUpdateServiceHistoryScreen) {
        if (loading.value) return

        loading.value = true

        try {
            const returnedResponse = await updateServiceHistoryScreenApi(api, screenId, serviceHistoryScreen)
            success.value = returnedResponse.response.success
            error_code.value = returnedResponse.response.error_code
            message.value = returnedResponse.response.message
            return returnedResponse.response.data as ServiceHistoryScreen
        } catch (error: any) {
            success.value = error?.response.data.success
            error_code.value = error?.response.data.error_code
            message.value = error?.response.data.message
        }
        finally {
            loading.value = false
        }
    }
    async function getServiceHistoryScreenForEditStore(screenId: number) {
        if (loading.value) return

        loading.value = true

        try {
            const returnedResponse = await getServiceHistoryScreenForEditApi(api, screenId)
            success.value = returnedResponse.response.success
            error_code.value = returnedResponse.response.error_code
            message.value = returnedResponse.response.message
            return returnedResponse.response.data as ServiceHistoryScreen
        } catch (error: any) {
            success.value = error?.response.data.success
            error_code.value = error?.response.data.error_code
            message.value = error?.response.data.message
        }
        finally {
            loading.value = false
        }
    }
    async function getServiceHistoryScreensStore(searchFilter: ServiceHistoryScreenSearchFilter) {
        if (loading.value) return

        loading.value = true

        try {
            const returnedResponse = await getServiceHistoryScreensListApi(api, searchFilter)
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
  async function getServiceHistoryScreenStore(screenId: number) {
    if (loading.value) return

    loading.value = true

    try {
        const returnedResponse = await getServiceHistoryScreensApi(api, screenId)
        pagination.value = returnedResponse.response.pagination
        success.value = returnedResponse.response.success
        error_code.value = returnedResponse.response.error_code
        message.value = returnedResponse.response.message
        return returnedResponse.response.data as ServiceHistoryScreenDetails
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
        serviceHistoryScreens,
        createServiceHistoryScreenStore,
        updateServiceHistoryScreenStore,
        getServiceHistoryScreenForEditStore,
      getServiceHistoryScreensStore,
      getServiceHistoryScreenStore
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
    import.meta.hot.accept(acceptHMRUpdate(useServiceHistoryScreen, import.meta.hot))
}
