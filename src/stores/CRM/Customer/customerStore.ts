import { defineStore, acceptHMRUpdate } from "pinia"
import { defaultCustomerGroup } from "../../Others/CustomerGroup/customerGroupStore"
import { defaultCreateUpdateUser, defaultUser } from "../../Others/User/userStore"
import { defaultMedicalInfo } from "../MedicaInfo/medicalInfoStore"
import { useApi } from "/@src/composable/useApi"
import { CreateCustomer,UpdateCustomer, Customer, addCustomerApi, addMedicalInfoApi, CreateUpdateCustomerSocialMediaHelper, addSocialMediaApi, getCustomerApi, updateCustomerApi } from "/@src/utils/api/CRM/Customer"
import { MedicalInfo } from "/@src/utils/api/CRM/MedicalInfo"
import { Pagination, defaultPagination } from "/@src/utils/response"

  
export const defaultCreateCustomer: CreateCustomer = {
  id: 0,
  emergency_contact_name: '',
  emergency_contact_phone: '',
  user: defaultCreateUpdateUser,
  medical_info_id: undefined,
  customer_group_id: 1,
  social_medias: [],
  is_completed : false,
}
export const defaultUpdateCustomer: UpdateCustomer = {
  id: 0,
  emergency_contact_name: '',
  emergency_contact_phone: '',
  user: defaultCreateUpdateUser,
  medical_info: defaultMedicalInfo,
  customer_group_id: 1,
  social_medias: [],
  is_completed : false,

}
export const defaultCustomer: Customer = {
    id: 0,
    emergency_contact_name: '',
    emergency_contact_phone: '',
    user: defaultUser,
    medical_info: defaultMedicalInfo,
    customer_group: defaultCustomerGroup,
    social_medias: [],
    is_completed : false,

  }



export const useCustomer = defineStore('customer', () => {
  const api = useApi()
  const customers = ref<Customer[]>([])
  const pagination = ref<Pagination>(defaultPagination)
  const success = ref<boolean>()
  const error_code = ref<string>()
  const message = ref<string>()
  const loading = ref(false)

  async function addCustomerStore(customer: CreateCustomer) {
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
  async function updateCustomerStore(customerId : number ,customer: UpdateCustomer) {
    if (loading.value) return

    loading.value = true

    try {
      const response = await updateCustomerApi(api,customerId, customer)

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
  // async function editCustomerStore(customer: CreateUpdateCustomer) {
  //   if (loading.value) return

  //   loading.value = true

  //   try {
  //     const response = await editCustomerApi(api, customer)
  //     var returnedCustomer: Customer
  //     returnedCustomer = response.response.data
  //     customers.value.splice(
  //       customers.value.findIndex((userElement) => (userElement.id = customer.id)),
  //       1
  //     )
  //     customers.value.push(returnedCustomer)
  //   } finally {
  //     loading.value = false
  //   }
  // }
  async function addMedicalInfoStore(customer_id: number , medical_info : MedicalInfo) {
    if (loading.value) return

    loading.value = true

    try {
      const response = await addMedicalInfoApi(api, customer_id , medical_info)
      console.log(response)
      var returnedCustomer: Customer
      returnedCustomer = response.response.data
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message
      return returnedCustomer

    } finally {
      loading.value = false
    }
  }
  async function addSocialMediaStore(customer_id: number , social_medias : Array<CreateUpdateCustomerSocialMediaHelper>) {
    if (loading.value) return

    loading.value = true

    try {
      const response = await addSocialMediaApi(api, customer_id , social_medias)
      var returnedCustomer: Customer
      returnedCustomer = response.response.data
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message
      return returnedCustomer

    } finally {
      loading.value = false
    }
  }
  
  async function getCustomerStore(customer_id: number) {
    if (loading.value) return

    loading.value = true

    try {
      const response = await getCustomerApi(api, customer_id )
      var returnedCustomer: Customer
      returnedCustomer = response.response.data
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message
      return returnedCustomer

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
    addSocialMediaStore,
    addMedicalInfoStore,
    getCustomerStore,
    updateCustomerStore
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
