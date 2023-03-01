import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { Pagination, defaultPagination } from "/@src/utils/response"
import sleep from "/@src/utils/sleep";
import { CreateSupplier, Supplier, SupplierSearchFilter, UpdateSupplier } from "/@src/models/Others/Supplier/supplier";
import { addSupplierApi, editSupplierApi, getSupplierApi, getSuppliersApi } from "/@src/utils/api/Others/Supplier"
import { defaultAccount } from "/@src/models/Accounting/Account/account";




export const useSupplier = defineStore('supplier', () => {

  const api = useApi()
  const suppliers = ref<Supplier[]>([])
  const pagination = ref<Pagination>(defaultPagination)
  const loading = ref(false)
  const success = ref<boolean>()
  const error_code = ref<string>()
  const message = ref<string>()


  async function addSupplierStore(supplier: CreateSupplier) {
    if (loading.value) return
    loading.value = true
    sleep(2000)
    try {
      const response = await addSupplierApi(api, supplier)
      var returnedSupplier: Supplier
      returnedSupplier = response.response.data
      suppliers.value.push(returnedSupplier)
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message

      return returnedSupplier
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
  async function editSupplierStore(supplier: UpdateSupplier) {
    if (loading.value) return
    loading.value = true
    sleep(2000)
    try {
      const response = await editSupplierApi(api, supplier)
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message

    } catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message
    }
    finally {
      loading.value = false
    }
  }
  async function getSupplierStore(supplierId: number) {
    if (loading.value) return
    loading.value = true
    sleep(2000)
    try {
      const response = await getSupplierApi(api, supplierId)
      var returnedSupplier: Supplier
      returnedSupplier = response.response.data
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message

      return returnedSupplier
    } catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message
    }
    finally {
      loading.value = false
    }
  }
  async function getSuppliersStore(searchFilter: SupplierSearchFilter) {
    if (loading.value) return

    loading.value = true

    try {
      const returnedResponse = await getSuppliersApi(api, searchFilter)
      suppliers.value = returnedResponse.response.data
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
    suppliers,
    pagination,
    loading,
    addSupplierStore,
    editSupplierStore,
    getSupplierStore,
    getSuppliersStore
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
  import.meta.hot.accept(acceptHMRUpdate(useSupplier, import.meta.hot))
}

