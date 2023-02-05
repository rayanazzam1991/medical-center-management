import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { DeliveringSalariesSearchFilter, DeliveringSalary, OnholdSalariesSearchFilter, OnholdSalary, ReviewGenerateSalariesRequestBody, ReviewSalaries, Salary, SalarySearchFilter } from "/@src/models/HR/Payroll/Salary/salary"
import { generateSalariesApi, getDeliveringSalariesApi, getOnholdSalariesApi, getSalariesListApi, getSalaryPayslipApi, moveSalariesToOnholdApi, paySalaryApi, returnSalaryApi, reviewSalariesApi } from "/@src/utils/api/HR/Payroll/Salary"
import { Pagination, defaultPagination } from "/@src/utils/response"
import sleep from "/@src/utils/sleep"


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
    async function getDeliveringSalariesStore(filter: DeliveringSalariesSearchFilter) {
        if (loading.value) return

        loading.value = true

        try {
            const returnedResponse = await getDeliveringSalariesApi(api, filter)
            pagination.value = returnedResponse.response.pagination
            success.value = returnedResponse.response.success
            error_code.value = returnedResponse.response.error_code
            message.value = returnedResponse.response.message
            return returnedResponse.response.data as DeliveringSalary[]
        } catch (error: any) {
            success.value = error?.response.data.success
            error_code.value = error?.response.data.error_code
            message.value = error?.response.data.message
        }
        finally {
            loading.value = false
        }
    }
    async function getOnholdSalariesStore(filter: OnholdSalariesSearchFilter) {
        if (loading.value) return

        loading.value = true

        try {
            const returnedResponse = await getOnholdSalariesApi(api, filter)
            pagination.value = returnedResponse.response.pagination
            success.value = returnedResponse.response.success
            error_code.value = returnedResponse.response.error_code
            message.value = returnedResponse.response.message
            return returnedResponse.response.data as OnholdSalary[]
        } catch (error: any) {
            success.value = error?.response.data.success
            error_code.value = error?.response.data.error_code
            message.value = error?.response.data.message
        }
        finally {
            loading.value = false
        }
    }
    async function getSalariesStore(selectedMonth: ReviewGenerateSalariesRequestBody, filter: SalarySearchFilter) {
        if (loading.value) return

        loading.value = true

        try {
            const returnedResponse = await getSalariesListApi(api, selectedMonth, filter)
            pagination.value = returnedResponse.response.pagination
            success.value = returnedResponse.response.success
            error_code.value = returnedResponse.response.error_code
            message.value = returnedResponse.response.message
            return returnedResponse.response.data as Salary[]
        } catch (error: any) {
            success.value = error?.response.data.success
            error_code.value = error?.response.data.error_code
            message.value = error?.response.data.message
        }
        finally {
            loading.value = false
        }
    }
    async function paySalaryStore(salaryId: number) {
        if (loading.value) return

        loading.value = true

        try {
            const returnedResponse = await paySalaryApi(api, salaryId)
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
    async function returnSalaryStore(salaryId: number) {
        if (loading.value) return

        loading.value = true

        try {
            const returnedResponse = await returnSalaryApi(api, salaryId)
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
    async function moveSalariesToOnholdStore() {
        if (loading.value) return

        loading.value = true

        try {
            const returnedResponse = await moveSalariesToOnholdApi(api)
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
    async function getSalaryPayslipStore(salaryId: number) {
        if (loading.value) return

        loading.value = true
        await sleep(200)
        try {
            const returnedResponse = await getSalaryPayslipApi(api, salaryId)
            success.value = returnedResponse.response.success
            error_code.value = returnedResponse.response.error_code
            message.value = returnedResponse.response.message
            return returnedResponse.response.data as Salary
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
        generateSalariesStore,
        getDeliveringSalariesStore,
        getOnholdSalariesStore,
        getSalariesStore,
        paySalaryStore,
        returnSalaryStore,
        moveSalariesToOnholdStore,
        getSalaryPayslipStore
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
