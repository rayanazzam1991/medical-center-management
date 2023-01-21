import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { CustomerGroup, CustomerGroupSearchFilter } from "/@src/models/Others/CustomerGroup/customerGroup"
import { deleteCustomerGroupApi, getCustomerGroupApi, addCustomerGroupApi, editCustomerGroupApi, getCustomerGroupsApi } from "/@src/utils/api/Others/CustomerGroup"
import { Pagination, defaultPagination } from "/@src/utils/response"
import sleep from "/@src/utils/sleep";



export const useCustomerGroup = defineStore('customerGroup', () => {
  const api = useApi()
  const customerGroups = ref<CustomerGroup[]>([])
  const pagination = ref<Pagination>(defaultPagination)
  const loading = ref(false)
  const success = ref<boolean>()
  const error_code = ref<string>()
  const message = ref<string>()

  async function deleteCustomerGroupStore(customerGroupId: number) {
    if (loading.value) return

    loading.value = true

    try {
      const response = await deleteCustomerGroupApi(api, customerGroupId)
      customerGroups.value.splice(
        customerGroups.value.findIndex((customerGroup: CustomerGroup) => customerGroup.id === customerGroupId),
        1
      )
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
  async function getCustomerGroupStore(customerGroupId: number) {
    if (loading.value) return

    loading.value = true

    try {
      const response = await getCustomerGroupApi(api, customerGroupId)
      var returnedCustomerGroup: CustomerGroup
      returnedCustomerGroup = response.response.data
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message

      return returnedCustomerGroup
    } catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message
    }
    finally {
      loading.value = false
    }
  }
  async function addCustomerGroupStore(customerGroup: CustomerGroup) {
    if (loading.value) return

    loading.value = true
    sleep(2000)


    try {
      const response = await addCustomerGroupApi(api, customerGroup)
      var returnedCustomerGroup: CustomerGroup
      returnedCustomerGroup = response.response.data
      customerGroups.value.push(returnedCustomerGroup)
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message

      return returnedCustomerGroup


    } catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message
    }
    finally {
      loading.value = false
    }
  }
  async function editCustomerGroupStore(customerGroup: CustomerGroup) {
    if (loading.value) return

    loading.value = true
    sleep(2000)


    try {
      const response = await editCustomerGroupApi(api, customerGroup)
      var returnedCustomerGroup: CustomerGroup
      returnedCustomerGroup = response.response.data
      customerGroups.value.splice(customerGroups.value.findIndex((customerGroupElement) => customerGroupElement.id = customerGroup.id), 1)
      customerGroups.value.push(returnedCustomerGroup)
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
  async function getCustomerGroupsStore(searchFilter: CustomerGroupSearchFilter) {
    if (loading.value) return

    loading.value = true

    try {
      const returnedResponse = await getCustomerGroupsApi(api, searchFilter)
      customerGroups.value = returnedResponse.response.data
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
    customerGroups,
    pagination,
    loading,
    deleteCustomerGroupStore,
    addCustomerGroupStore,
    editCustomerGroupStore,
    getCustomerGroupStore,
    getCustomerGroupsStore,
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
  import.meta.hot.accept(acceptHMRUpdate(useCustomerGroup, import.meta.hot))
}
