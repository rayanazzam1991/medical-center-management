import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { BalanceSheet, TrialBalance } from "/@src/models/Accounting/Account/account"
import { generateBalanceSheetReportApi, generateTrailBalanceReportApi } from "/@src/utils/api/Accounting/Account"
import { Pagination, defaultPagination } from "/@src/utils/response"
import sleep from "/@src/utils/sleep"


export const useAccount = defineStore('account', () => {
    const api = useApi()
    const loading = ref(false)
    const success = ref<boolean>()
    const error_code = ref<string>()
    const message = ref<string>()
    const pagination = ref<Pagination>(defaultPagination)

    async function generateTrailBalanceReportStore() {
        if (loading.value) return
        loading.value = true
        await sleep(3000);
        try {
            const returnedResponse = await generateTrailBalanceReportApi(api)
            success.value = returnedResponse.response.success
            error_code.value = returnedResponse.response.error_code
            message.value = returnedResponse.response.message
            return returnedResponse.response.data as TrialBalance
        } catch (error: any) {
            success.value = error?.response.data.success
            error_code.value = error?.response.data.error_code
            message.value = error?.response.data.message
        }
        finally {
            loading.value = false
        }
    }

    async function generateBalanceSheetReportStore() {
        if (loading.value) return
        loading.value = true
        await sleep(3000);
        try {
            const returnedResponse = await generateBalanceSheetReportApi(api)
            success.value = returnedResponse.response.success
            error_code.value = returnedResponse.response.error_code
            message.value = returnedResponse.response.message
            return returnedResponse.response.data as BalanceSheet
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
        generateTrailBalanceReportStore,
        generateBalanceSheetReportStore
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
    import.meta.hot.accept(acceptHMRUpdate(useAccount, import.meta.hot))
}
