import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { CreateEmployeeVariablePayment, EmployeeVariablePayment, EmployeeVariablePaymentSearchFilter, UpdateEmployeeVariablePayment } from "/@src/models/HR/Payroll/EmployeVariablePayment/employeeVariablePayment"
import { createEmployeeVariablePaymentApi, getEmployeeVariablePaymentApi, getEmployeeVariablePaymentsApi, updateEmployeeVariablePaymentApi } from "/@src/utils/api/HR/Payroll/EmployeeVariablePayment"
import { Pagination, defaultPagination } from "/@src/utils/response"
import sleep from "/@src/utils/sleep"


export const useEmployeeVariablePayment = defineStore('employeeVariablePayment', () => {
    const api = useApi()
    const loading = ref(false)
    const success = ref<boolean>()
    const error_code = ref<string>()
    const message = ref<string>()
    const employeeVariablePayments = ref<EmployeeVariablePayment[]>([])
    const pagination = ref<Pagination>(defaultPagination)

    async function createEmployeeVariablePaymentStore(employeeVariablePayment: CreateEmployeeVariablePayment) {
        if (loading.value) return

        loading.value = true

        try {
            const returnedResponse = await createEmployeeVariablePaymentApi(api, employeeVariablePayment)
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
    async function updateEmployeeVariablePaymentStore(employeeVariablePaymentId: number, employeeVariablePayment: UpdateEmployeeVariablePayment) {
        if (loading.value) return

        loading.value = true

        try {
            const returnedResponse = await updateEmployeeVariablePaymentApi(api, employeeVariablePaymentId, employeeVariablePayment)
            success.value = returnedResponse.response.success
            error_code.value = returnedResponse.response.error_code
            message.value = returnedResponse.response.message
            return returnedResponse.response.data as EmployeeVariablePayment
        } catch (error: any) {
            success.value = error?.response.data.success
            error_code.value = error?.response.data.error_code
            message.value = error?.response.data.message
        }
        finally {
            loading.value = false
        }
    }
    async function getEmployeeVariablePaymentStore(employeeVariablePaymentId: number) {
        if (loading.value) return

        loading.value = true
        sleep(2000)


        try {
            const response = await getEmployeeVariablePaymentApi(api, employeeVariablePaymentId)
            let returnedVariablePayment: EmployeeVariablePayment
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
    async function getEmployeeVariablePaymentsStore(searchFilter: EmployeeVariablePaymentSearchFilter) {
        if (loading.value) return

        loading.value = true

        try {
            const returnedResponse = await getEmployeeVariablePaymentsApi(api, searchFilter)
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
        employeeVariablePayments,
        getEmployeeVariablePaymentsStore,
        createEmployeeVariablePaymentStore,
        updateEmployeeVariablePaymentStore,
        getEmployeeVariablePaymentStore
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
    import.meta.hot.accept(acceptHMRUpdate(useEmployeeVariablePayment, import.meta.hot))
}
