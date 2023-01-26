import { AxiosError } from "axios"
import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { Contractor, CreateContractor, UpdateContractor, ContractorSearchFilter, CreateUpdateServicesHelper, ContractorWithWallet } from "/@src/models/Contractor/contractor"
import { Media } from "/@src/models/Others/Media/media"
import { addContractorApi, updateContractorApi, getContractorsApi, addServicesApi, getContractorApi } from "/@src/utils/api/Contractor"
import { uploadMediaApi, getMediaApi, deleteMediaApi } from "/@src/utils/api/Others/Media"
import { Pagination, defaultPagination } from "/@src/utils/response"
import sleep from "/@src/utils/sleep"




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
    sleep(2000)
    try {
      const response = await addContractorApi(api, contractor)

      let returnedContractor: Contractor
      returnedContractor = response.response.data
      contractors.value.push(returnedContractor)
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message

      return returnedContractor
    } catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message

    }

    finally {
      loading.value = false
    }
  }
  async function updateContractorStore(contractorId: number, contractor: UpdateContractor) {
    if (loading.value) return
    loading.value = true
    sleep(2000)
    try {
      const response = await updateContractorApi(api, contractorId, contractor)

      let returnedContractor: Contractor
      returnedContractor = response.response.data
      contractors.value.push(returnedContractor)
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message

      return returnedContractor
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
  async function getContractorsStore(searchFilter: ContractorSearchFilter) {
    if (loading.value) return
    loading.value = true
    try {
      const returnedResponse = await getContractorsApi(api, searchFilter)
      contractors.value = returnedResponse.response.data
      pagination.value = returnedResponse.response.pagination
      success.value = returnedResponse.response.success
      error_code.value = returnedResponse.response.error_code
      message.value = returnedResponse.response.message

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


  async function addServicesStore(contractor_id: number, services: Array<CreateUpdateServicesHelper>) {
    if (loading.value) return
    loading.value = true
    sleep(2000)
    try {
      const response = await addServicesApi(api, contractor_id, services)
      let returnedContractor: Contractor
      returnedContractor = response.response.data
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message

      return returnedContractor

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

  async function getContractorStore(contractor_id: number) {
    if (loading.value) return
    loading.value = true
    sleep(2000)
    try {
      const response = await getContractorApi(api, contractor_id)
      let returnedContractor: Contractor
      returnedContractor = response.response.data
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message

      return returnedContractor

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

  async function getContractorProfilePicture(media: Media) {
    if (loading.value) return
    loading.value = true
    sleep(2000)
    try {
      const response = await getMediaApi(api, media)
      let returnedMedia: Media[]
      returnedMedia = response.response.data
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message

      return returnedMedia

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
  async function getContractorFilesStore(media: Media) {
    if (loading.value) return
    loading.value = true
    sleep(2000)
    try {
      const response = await getMediaApi(api, media)
      let returnedMedia: Media[]
      returnedMedia = response.response.data
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message

      return returnedMedia

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

  async function addContractorFileStore(media: FormData) {
    if (loading.value) return
    loading.value = true
    sleep(2000)
    try {
      const response = await uploadMediaApi(api, media)
      let returnedMedia: Media[]
      returnedMedia = response.response.data
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message

      return returnedMedia

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

  async function deleteContractorFile(picture_id: number) {
    if (loading.value) return
    loading.value = true
    sleep(2000)
    try {
      const response = await deleteMediaApi(api, picture_id)
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message

      return response

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


  return {
    success,
    error_code,
    message,
    contractors,
    pagination,
    loading,
    addContractorStore,
    addServicesStore,
    getContractorStore,
    updateContractorStore,
    getContractorsStore,
    getContractorProfilePicture,
    getContractorFilesStore,
    addContractorFileStore,
    deleteContractorFile
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
