import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { Currency, CurrencySearchFilter } from "/@src/models/Accounting/Currency/currency"
import { getCurrenciesApi, getCurrencyByCodeApi, updateCurrencyRateApi } from "/@src/utils/api/Accounting/Currency";
import { Pagination, defaultPagination } from "/@src/utils/response"
import sleep from "/@src/utils/sleep";


export const useCurrency = defineStore('currency', () => {
  const api = useApi()
  const currencies = ref<Currency[]>([])
  const pagination = ref<Pagination>(defaultPagination)
  const loading = ref(false)
  const success = ref<boolean>()
  const error_code = ref<string>()
  const message = ref<string>()

  async function getCurrenciesStore(searchFilter: CurrencySearchFilter) {
    if (loading.value) return
    loading.value = true

    try {
      const returnedResponse = await getCurrenciesApi(api, searchFilter)
      currencies.value = returnedResponse.response.data
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

  async function getCurrencyByCodeStore(code: string) {
    if (loading.value) return
    loading.value = true

    try {
      const returnedResponse = await getCurrencyByCodeApi(api, code)
      success.value = returnedResponse.response.success
      error_code.value = returnedResponse.response.error_code
      message.value = returnedResponse.response.message
      return returnedResponse.response.data as Currency

    } catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message
    }
    finally {
      loading.value = false
    }
  }

  async function updateCurrencyRateStore(id: number, rate: number) {
    if (loading.value) return
    loading.value = true

    try {
      const returnedResponse = await updateCurrencyRateApi(api, id, rate)
      pagination.value = returnedResponse.response.pagination
      success.value = returnedResponse.response.success
      error_code.value = returnedResponse.response.error_code
      message.value = returnedResponse.response.message
      return returnedResponse.response.data as Currency

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
    currencies,
    pagination,
    loading,
    getCurrenciesStore,
    getCurrencyByCodeStore,
    updateCurrencyRateStore
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
  import.meta.hot.accept(acceptHMRUpdate(useCurrency, import.meta.hot))
}
