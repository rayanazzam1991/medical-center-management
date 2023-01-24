import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { ReviewGenerateSalariesRequestBody, ReviewSalaries } from "/@src/models/HR/Payroll/Salary/salary"
import { generateSalariesApi, reviewSalariesApi } from "/@src/utils/api/HR/Payroll/Salary"
import { Pagination, defaultPagination } from "/@src/utils/response"


export const useSalary = defineStore('salary', () => {
    const api = useApi()
    const loading = ref(false)
    const success = ref<boolean>()
    const error_code = ref<string>()
    const message = ref<string>()
    const pagination = ref<Pagination>(defaultPagination)

    async function reviewSalariesStore(reviewGenerateSalariesRequestBody: ReviewGenerateSalariesRequestBody) {
        if (loading.value) return

        loading.value = true

        try {
            const returnedResponse = await reviewSalariesApi(api, reviewGenerateSalariesRequestBody)
            success.value = returnedResponse.response.success
            error_code.value = returnedResponse.response.error_code
            message.value = returnedResponse.response.message
            return returnedResponse.response.data as ReviewSalaries
        } catch (error: any) {
            success.value = error?.response.data.success
            error_code.value = error?.response.data.error_code
            message.value = error?.response.data.message
        }
        finally {
            loading.value = false
        }
    }
    async function generateSalariesStore(reviewGenerateSalariesRequestBody: ReviewGenerateSalariesRequestBody) {
        if (loading.value) return

        loading.value = true

        try {
            const returnedResponse = await generateSalariesApi(api, reviewGenerateSalariesRequestBody)
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
        loading,
        pagination,
        reviewSalariesStore,
        generateSalariesStore
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
    import.meta.hot.accept(acceptHMRUpdate(useSalary, import.meta.hot))
}
