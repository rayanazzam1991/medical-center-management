import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { CreateVariablePayment, UpdateVariablePayment, VariablePayment, VariablePaymentSearchFilter } from "/@src/models/HR/Payroll/VariablePayment/variablePayment"
import { createVariablePaymentApi, getVariablePaymentApi, getVariablePaymentsApi, updateVariablePaymentApi } from "/@src/utils/api/HR/Payroll/VariablePayment"
import { defaultPagination, Pagination } from "/@src/utils/response"
import sleep from "/@src/utils/sleep"


export const useVariablePayment = defineStore('variablePayment', () => {
    const api = useApi()
    const loading = ref(false)
    const success = ref<boolean>()
    const error_code = ref<string>()
    const message = ref<string>()
    const variablePayments = ref<VariablePayment[]>([])
    const pagination = ref<Pagination>(defaultPagination)

    async function createVariablePaymentStore(variablePayment: CreateVariablePayment) {
        if (loading.value) return

        loading.value = true

        try {
            const returnedResponse = await createVariablePaymentApi(api, variablePayment)
            success.value = returnedResponse.response.success
            error_code.value = returnedResponse.response.error_code
            message.value = returnedResponse.response.message
            return returnedResponse.response.data as VariablePayment
        } catch (error: any) {
            success.value = error?.response.data.success
            error_code.value = error?.response.data.error_code
            message.value = error?.response.data.message
        }
        finally {
            loading.value = false
        }
    }
    async function updateVariablePaymentStore(variablePaymentId: number, variablePayment: UpdateVariablePayment) {
        if (loading.value) return

        loading.value = true

        try {
            const returnedResponse = await updateVariablePaymentApi(api, variablePaymentId, variablePayment)
            success.value = returnedResponse.response.success
            error_code.value = returnedResponse.response.error_code
            message.value = returnedResponse.response.message
            return returnedResponse.response.data as VariablePayment
        } catch (error: any) {
            success.value = error?.response.data.success
            error_code.value = error?.response.data.error_code
            message.value = error?.response.data.message
        }
        finally {
            loading.value = false
        }
    }
    async function getVariablePaymentStore(variablePaymentId: number) {
        if (loading.value) return

        loading.value = true
        sleep(2000)


        try {
            const response = await getVariablePaymentApi(api, variablePaymentId)
            let returnedVariablePayment: VariablePayment
            returnedVariablePayment = response.response.data
            success.value = response.response.success
            error_code.value = response.response.error_code
            message.value = response.response.message

            return returnedVariablePayment
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
    async function getVariablePaymentsStore(searchFilter: VariablePaymentSearchFilter) {
        if (loading.value) return

        loading.value = true

        try {
            const returnedResponse = await getVariablePaymentsApi(api, searchFilter)
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



    return {
        success,
        error_code,
        message,
        loading,
        pagination,
        variablePayments,
        getVariablePaymentsStore,
        createVariablePaymentStore,
        updateVariablePaymentStore,
        getVariablePaymentStore
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
    import.meta.hot.accept(acceptHMRUpdate(useVariablePayment, import.meta.hot))
}
