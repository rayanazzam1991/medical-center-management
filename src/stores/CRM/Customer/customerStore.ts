import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { Customer, CreateCustomer, UpdateCustomer, CustomerSearchFilter, CreateUpdateCustomerSocialMediaHelper } from "/@src/models/CRM/Customer/customer"
import { MedicalInfo } from "/@src/models/CRM/MedicalInfo/medicalInfo"
import { Media } from "/@src/models/Others/Media/media"
import { addCustomerApi, updateCustomerApi, getCustomersApi, addMedicalInfoApi, addSocialMediaApi, getCustomerApi } from "/@src/utils/api/CRM/Customer"
import { uploadMediaApi, getMediaApi, deleteMediaApi } from "/@src/utils/api/Others/Media"
import { Pagination, defaultPagination } from "/@src/utils/response"


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
  async function getCustomersStore(searchFilter: CustomerSearchFilter) {
    if (loading.value) return

    loading.value = true

    try {
      const returnedResponse = await getCustomersApi(api, searchFilter)
      customers.value = returnedResponse.response.data
      pagination.value = returnedResponse.response.pagination
    } finally {
      loading.value = false
    }
  }


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
  async function addCustomerProfilePictureStore(media : FormData) {
    if (loading.value) return

    loading.value = true

    try {
      const response = await uploadMediaApi(api , media)
      console.log(response)
      var returnedMedia: Media[]
      returnedMedia = response.response.data
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message
      return returnedMedia

    } finally {
      loading.value = false
    }
  }

  async function getCustomerProfilePicture(media : Media) {
    if (loading.value) return

    loading.value = true

    try {
      const response = await getMediaApi(api , media)
      console.log(response)
      var returnedMedia: Media[]
      returnedMedia = response.response.data
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message
      return returnedMedia

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
  async function deleteCustomerProfilePicture(picture_id: number) {
    if (loading.value) return

    loading.value = true

    try {
      const response = await deleteMediaApi(api, picture_id )
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message
      return response

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
    updateCustomerStore,
    getCustomersStore,
    addCustomerProfilePictureStore,
    getCustomerProfilePicture,
    deleteCustomerProfilePicture
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
