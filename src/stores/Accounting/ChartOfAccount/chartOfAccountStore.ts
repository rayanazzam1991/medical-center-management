import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { ChartOfAccount, ChartOfAccountSearchFilter } from "/@src/models/Accounting/ChartOfAccount/chartOfAccount"
import { getChartOfAccountsApi } from "/@src/utils/api/Accounting/ChartOfAccount"
import { Pagination, defaultPagination } from "/@src/utils/response"


export const useChartOfAccount = defineStore('chartOfAccount', () => {
  const api = useApi()
  const chartOfAccounts = ref<ChartOfAccount[]>([])
  const pagination = ref<Pagination>(defaultPagination)
  const loading = ref(false)
  const success = ref<boolean>()
  const error_code = ref<string>()
  const message = ref<string>()

  async function getChartOfAccountsStore(searchFilter: ChartOfAccountSearchFilter) {
    if (loading.value) return
    loading.value = true

    try {
      const returnedResponse = await getChartOfAccountsApi(api, searchFilter)
      chartOfAccounts.value = returnedResponse.response.data
      pagination.value = returnedResponse.response.pagination
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
    chartOfAccounts,
    pagination,
    loading,
    getChartOfAccountsStore
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
  import.meta.hot.accept(acceptHMRUpdate(useChartOfAccount, import.meta.hot))
}
