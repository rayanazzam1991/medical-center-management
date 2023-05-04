import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { GeneratableMonth, GeneratedSalariesMonth } from "/@src/models/HR/Payroll/GeneratedSalariesMonth/generatedSalariesMonth"
import { getAllGeneratedMonthsApi, getGeneratableMonthsApi } from "/@src/utils/api/HR/Payroll/GeneratedSalariesMonths"
import { Pagination, defaultPagination } from "/@src/utils/response"


export const useGeneratedSalariesMonth = defineStore('generatedSalariesMonth', () => {
    const api = useApi()
    const loading = ref(false)
    const success = ref<boolean>()
    const error_code = ref<string>()
    const message = ref<string>()
    const pagination = ref<Pagination>(defaultPagination)

    async function getGeneratableMonthsStore() {
        if (loading.value) return

        loading.value = true

        try {
            const returnedResponse = await getGeneratableMonthsApi(api)
            success.value = returnedResponse.response.success
            error_code.value = returnedResponse.response.error_code
            message.value = returnedResponse.response.message
            return returnedResponse.response.data as GeneratableMonth[]
        } catch (error: any) {
            success.value = error?.response.data.success
            error_code.value = error?.response.data.error_code
            message.value = error?.response.data.message
        }
        finally {
            loading.value = false
        }
    }
    async function getAllGeneratedMonthsStore() {
        if (loading.value) return

        loading.value = true

        try {
            const returnedResponse = await getAllGeneratedMonthsApi(api)
            success.value = returnedResponse.response.success
            error_code.value = returnedResponse.response.error_code
            message.value = returnedResponse.response.message
            return returnedResponse.response.data as GeneratedSalariesMonth[]
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
        loading,
        pagination,
        getGeneratableMonthsStore,
        getAllGeneratedMonthsStore
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
    import.meta.hot.accept(acceptHMRUpdate(useGeneratedSalariesMonth, import.meta.hot))
}
