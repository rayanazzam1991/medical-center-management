import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { CustomerGroup, CustomerGroupSearchFilter } from "/@src/models/Others/CustomerGroup/customerGroup"
import { deleteCustomerGroupApi, getCustomerGroupApi, addCustomerGroupApi, editCustomerGroupApi, getCustomerGroupsApi } from "/@src/utils/api/Others/CustomerGroup"
import { Pagination, defaultPagination } from "/@src/utils/response"


export const useCustomerGroup = defineStore('customerGroup', () => {
  const api = useApi()
  const customerGroups = ref<CustomerGroup[]>([])
  const pagination = ref<Pagination>(defaultPagination)
  const loading = ref(false)

  async function deleteCustomerGroupStore(customerGroupId: number) {
    if (loading.value) return

    loading.value = true

    try {
      const response = await deleteCustomerGroupApi(api, customerGroupId)
      customerGroups.value.splice(
        customerGroups.value.findIndex((customerGroup: CustomerGroup) => customerGroup.id === customerGroupId),
        1
      )
    } finally {
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
      return returnedCustomerGroup
    } finally {
      loading.value = false
    }
  }
  async function addCustomerGroupStore(customerGroup: CustomerGroup) {
    if (loading.value) return

    loading.value = true

  try {
    const response = await addCustomerGroupApi(api, customerGroup)
    var returnedCustomerGroup : CustomerGroup
    returnedCustomerGroup = response.response.data 
    customerGroups.value.push(returnedCustomerGroup)
    return returnedCustomerGroup


  } finally {
    loading.value = false
  }
}
  async function editCustomerGroupStore(customerGroup: CustomerGroup) {
    if (loading.value) return

    loading.value = true

  try {
    const response = await editCustomerGroupApi(api, customerGroup)
    var returnedCustomerGroup : CustomerGroup
    returnedCustomerGroup = response.response.data 
    customerGroups.value.splice( customerGroups.value.findIndex((customerGroupElement) => customerGroupElement.id = customerGroup.id ),1)
    customerGroups.value.push(returnedCustomerGroup)


  } finally {
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
    } finally {
      loading.value = false
    }
  }

  return {
    customerGroups,
    pagination,
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
