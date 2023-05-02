import { acceptHMRUpdate, defineStore } from "pinia";
import { useApi } from "/@src/composable/useApi";
import { ClientsCashReceiptsSearchFilter, CreateRecords, SuppliersCashReceiptsSearchFilter, TransactionSearchFilter } from "/@src/models/Accounting/Transaction/record";
import { createRecordsApi, getClientsCashReceiptsListApi, getSuppliersCashReceiptsListApi, getTransactionsListApi } from "/@src/utils/api/Accounting/Transaction/transaction";
import { defaultPagination, Pagination } from "/@src/utils/response";
import sleep from "/@src/utils/sleep";

export const useTransaction = defineStore('transaction', () => {

    const api = useApi();
    const loading = ref(false)
    const success = ref<boolean>()
    const error_code = ref<string>()
    const message = ref<string>()
    const pagination = ref<Pagination>(defaultPagination)
    async function createRecords(records: CreateRecords) {
        if (loading.value) return
        loading.value = true
        await sleep(1000);
        try {
            const returnedResponse = await createRecordsApi(api, records)
            success.value = returnedResponse.response.success
            error_code.value = returnedResponse.response.error_code
            message.value = returnedResponse.response.message
            return returnedResponse.response.data
        } catch (error: any) {
            success.value = error?.response.data.success
            error_code.value = error?.response.data.error_code
            message.value = error?.response.data.message
        }
        finally {
            loading.value = false
        }
    }

    async function getTransactionsListStore(searchFilter: TransactionSearchFilter) {
        if (loading.value) return
        loading.value = true
        sleep(1000)
        try {
            const response = await getTransactionsListApi(api, searchFilter)
            pagination.value = response.response.pagination
            success.value = response.response.success
            error_code.value = response.response.error_code
            message.value = response.response.message
            return response.response.data
        } catch (error: any) {
            success.value = error?.response.data.success
            error_code.value = error?.response.data.error_code
            message.value = error?.response.data.message

        } finally {
            loading.value = false
        }
    }
    async function getClientsCashReceiptsListStore(searchFilter: ClientsCashReceiptsSearchFilter) {
        if (loading.value) return
        loading.value = true
        sleep(1000)
        try {
            const response = await getClientsCashReceiptsListApi(api, searchFilter)
            pagination.value = response.response.pagination
            success.value = response.response.success
            error_code.value = response.response.error_code
            message.value = response.response.message
            return response.response.data
        } catch (error: any) {
            success.value = error?.response.data.success
            error_code.value = error?.response.data.error_code
            message.value = error?.response.data.message

        } finally {
            loading.value = false
        }
  }
  async function getSuppliersCashReceiptsListStore(searchFilter: SuppliersCashReceiptsSearchFilter) {
    if (loading.value) return
    loading.value = true
    sleep(1000)
    try {
        const response = await getSuppliersCashReceiptsListApi(api, searchFilter)
        pagination.value = response.response.pagination
        success.value = response.response.success
        error_code.value = response.response.error_code
        message.value = response.response.message
        return response.response.data
    } catch (error: any) {
        success.value = error?.response.data.success
        error_code.value = error?.response.data.error_code
        message.value = error?.response.data.message

    } finally {
        loading.value = false
    }
}


    return {
        loading,
        success,
        error_code,
        message,
        pagination,
        createRecords,
        getTransactionsListStore,
      getClientsCashReceiptsListStore,
      getSuppliersCashReceiptsListStore
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
    import.meta.hot.accept(acceptHMRUpdate(useTransaction, import.meta.hot))
}
