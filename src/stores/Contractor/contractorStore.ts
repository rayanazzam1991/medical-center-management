import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { Contractor, CreateContractor, UpdateContractor, ContractorSearchFilter, CreateUpdateServicesHelper } from "/@src/models/Contractor/contractor"
import { Media } from "/@src/models/Others/Media/media"
import { addContractorApi, updateContractorApi, getContractorsApi, addServicesApi, getContractorApi } from "/@src/utils/api/Contractor"
import { uploadMediaApi, getMediaApi, deleteMediaApi } from "/@src/utils/api/Others/Media"
import { Pagination, defaultPagination } from "/@src/utils/response"

  


export const useContractor = defineStore('contractor', () => {
  const api = useApi()
  const contractors = ref<Contractor[]>([])
  const pagination = ref<Pagination>(defaultPagination)
  const success = ref<boolean>()
  const error_code = ref<string>()
  const message = ref<string>()
  const loading = ref(false)

  async function addContractorStore(contractor: CreateContractor) {
    if (loading.value) return

    loading.value = true

    try {
      const response = await addContractorApi(api, contractor)

      var returnedContractor: Contractor
      returnedContractor = response.response.data
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message
      contractors.value.push(returnedContractor)
      return returnedContractor
    } 
    
    
    finally {
      loading.value = false
    }
  }
  async function updateContractorStore(contractorId : number ,contractor: UpdateContractor) {
    if (loading.value) return

    loading.value = true

    try {
      const response = await updateContractorApi(api,contractorId, contractor)

      var returnedContractor: Contractor
      returnedContractor = response.response.data
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message
      contractors.value.push(returnedContractor)
      return returnedContractor
    } 
    
    
    finally {
      loading.value = false
    }
  }
  async function getContractorsStore(searchFilter: ContractorSearchFilter) {
    if (loading.value) return

    loading.value = true

    try {
      const returnedResponse = await getContractorsApi(api, searchFilter)
      contractors.value = returnedResponse.response.data
      pagination.value = returnedResponse.response.pagination
    } finally {
      loading.value = false
    }
  }

  async function addServicesStore(contractor_id: number , services : Array<CreateUpdateServicesHelper>) {
    if (loading.value) return

    loading.value = true

    try {
      const response = await addServicesApi(api, contractor_id , services)
      var returnedContractor: Contractor
      returnedContractor = response.response.data
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message
      return returnedContractor

    } finally {
      loading.value = false
    }
  }
  
  async function getContractorStore(contractor_id: number) {
    if (loading.value) return

    loading.value = true

    try {
      const response = await getContractorApi(api, contractor_id )
      var returnedContractor: Contractor
      returnedContractor = response.response.data
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message
      return returnedContractor

    } finally {
      loading.value = false
    }
  }
  async function addContractorPersonalId(media : FormData) {
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

  async function getContractorPersonalId(media : Media) {
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
  async function deleteContractorPersonalId(picture_id: number) {
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
    contractors,
    pagination,
    addContractorStore,
    addServicesStore,
    getContractorStore,
    updateContractorStore,
    getContractorsStore,
    addContractorPersonalId,
    getContractorPersonalId,
    deleteContractorPersonalId
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
  import.meta.hot.accept(acceptHMRUpdate(useContractor, import.meta.hot))
}
