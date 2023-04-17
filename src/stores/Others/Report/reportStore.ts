import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import sleep from "/@src/utils/sleep";
import { AccountHistoryReportFilter, BestAttendingEmployeeFilter, BestClientReportFilter, BestServiceProviderFilter, BestSoldItemFilter, MostConsumedItemFilter, ServiceProviderMonthlyReportData, WorstAttendingEmployeeFilter } from "/@src/models/Others/Report/report"
import { getAccountHistoryReportApi, getBestAttendingEmployeeReportApi, getBestClientReportApi, getBestServiceProviderReportApi, getBestSoldItemReportApi, getMostConsumedItemReportApi, getServiceProviderMonthlyReportApi, getWorstAttendingEmployeeReportApi } from "/@src/utils/api/Others/Report"


export const useReport = defineStore('report', () => {
    const api = useApi()
    const loading = ref(false)
    const success = ref<boolean>()
    const error_code = ref<string>()
    const message = ref<string>()


    async function getBestClientReportStore(filter: BestClientReportFilter) {
        if (loading.value) return
        loading.value = true
        sleep(2000)
        try {
            const response = await getBestClientReportApi(api, filter)
            return response.response
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
    async function getBestServiceProviderReportStore(filter: BestServiceProviderFilter) {
        if (loading.value) return
        loading.value = true
        sleep(2000)
        try {
            const response = await getBestServiceProviderReportApi(api, filter)
            return response.response
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
    async function getServiceProviderMonthlyReportStore(data: ServiceProviderMonthlyReportData) {
        if (loading.value) return
        loading.value = true
        sleep(2000)
        try {
            const response = await getServiceProviderMonthlyReportApi(api, data)
            return response.response
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
    async function getBestSoldItemReportStore(filter: BestSoldItemFilter) {
        if (loading.value) return
        loading.value = true
        sleep(2000)
        try {
            const response = await getBestSoldItemReportApi(api, filter)
            return response.response
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

    async function getMostConsumedItemReportStore(filter: MostConsumedItemFilter) {
        if (loading.value) return
        loading.value = true
        sleep(2000)
        try {
            const response = await getMostConsumedItemReportApi(api, filter)
            return response.response
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
    async function getBestAttendingEmployeeReportStore(filter: BestAttendingEmployeeFilter) {
        if (loading.value) return
        loading.value = true
        sleep(2000)
        try {
            const response = await getBestAttendingEmployeeReportApi(api, filter)
            return response.response
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
    async function getWorstAttendingEmployeeReportStore(filter: WorstAttendingEmployeeFilter) {
        if (loading.value) return
        loading.value = true
        sleep(2000)
        try {
            const response = await getWorstAttendingEmployeeReportApi(api, filter)
            return response.response
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
    async function getAccountHistoryReportStore(filter: AccountHistoryReportFilter) {
        if (loading.value) return
        loading.value = true
        sleep(2000)
        try {
            const response = await getAccountHistoryReportApi(api, filter)
            return response.response
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
        getBestClientReportStore,
        getBestServiceProviderReportStore,
        getServiceProviderMonthlyReportStore,
        getBestSoldItemReportStore,
        getMostConsumedItemReportStore,
        getBestAttendingEmployeeReportStore,
        getWorstAttendingEmployeeReportStore,
        getAccountHistoryReportStore
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
    import.meta.hot.accept(acceptHMRUpdate(useReport, import.meta.hot))
}
