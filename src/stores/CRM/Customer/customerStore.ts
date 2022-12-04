import { defineStore, acceptHMRUpdate } from "pinia"
import { defaultCustomerGroup } from "../../Others/CustomerGroup/customerGroupStore"
import { defaultCreateUpdateUser, defaultUser } from "../../Others/User/userStore"
import { defaultMedicalInfo } from "../MedicaInfo/medicalInfoStore"
import { useApi } from "/@src/composable/useApi"
import { CreateUpdateCustomer, Customer, addCustomerApi, editCustomerApi } from "/@src/utils/api/CRM/Customer"
import { Pagination, defaultPagination } from "/@src/utils/response"

  
export const defaultCreateUpdateCustomer: CreateUpdateCustomer = {
  id: 0,
  emergency_contact_name: '',
  emergency_contact_phone: '',
  user: defaultCreateUpdateUser,
  medical_info_id: undefined,
  customer_group_id: 1,
  social_medias: []
}
export const defaultCustomer: Customer = {
    id: 0,
    emergency_contact_name: '',
    emergency_contact_phone: '',
    user: defaultUser,
    medical_info: defaultMedicalInfo,
    customer_group: defaultCustomerGroup,
    social_medias: []
  }



export const useCustomer = defineStore('customer', () => {
  const api = useApi()
  const customers = ref<Customer[]>([])
  const pagination = ref<Pagination>(defaultPagination)
  const success = ref<boolean>()
  const error_code = ref<string>()
  const message = ref<string>()
  const loading = ref(false)

  async function addCustomerStore(customer: CreateUpdateCustomer) {
    if (loading.value) return

    loading.value = true

    try {
      const response = await addCustomerApi(api, customer)

      var returnedCustomer: Customer
      returnedCustomer = response.response.data
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message
      customers.value.push(returnedCustomer)
      return returnedCustomer
    } 
    
    
    finally {
      loading.value = false
    }
  }
  async function editCustomerStore(customer: CreateUpdateCustomer) {
    if (loading.value) return

    loading.value = true

    try {
      const response = await editCustomerApi(api, customer)
      var returnedCustomer: Customer
      returnedCustomer = response.response.data
      customers.value.splice(
        customers.value.findIndex((userElement) => (userElement.id = customer.id)),
        1
      )
      customers.value.push(returnedCustomer)
    } finally {
      loading.value = false
    }
  }

  return {
    success,
    error_code,
    message,
    customers,
    pagination,
    addCustomerStore,
    editCustomerStore,
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
  import.meta.hot.accept(acceptHMRUpdate(useCustomer, import.meta.hot))
}
