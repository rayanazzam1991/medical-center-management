import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { Nationality, NationalitySearchFilter } from "/@src/models/Others/Nationality/nationality"
import { deleteNationalityApi, getNationalityApi, addNationalityApi, editNationalityApi, getNationalitiesApi } from "/@src/utils/api/Others/Nationality"
import { Pagination, defaultPagination } from "/@src/utils/response"
import sleep from "/@src/utils/sleep"


export const useNationality = defineStore('nationality', () => {
  const api = useApi()
  const nationalities = ref<Nationality[]>([])
  const pagination = ref<Pagination>(defaultPagination)
  const loading = ref(false)
  const success = ref<boolean>()
  const error_code = ref<string>()
  const message = ref<string>()

  async function deleteNationalityStore(nationalityId: number) {
    if (loading.value) return

    loading.value = true

    try {
      const response = await deleteNationalityApi(api, nationalityId)
      nationalities.value.splice(nationalities.value.findIndex((nationality: Nationality) => nationality.id === nationalityId), 1)
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
  async function getNationalityStore(nationalityId: number) {
    if (loading.value) return
    loading.value = true
    sleep(2000)
    try {
      const response = await getNationalityApi(api, nationalityId)
      var returnedNationality: Nationality
      returnedNationality = response.response.data
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message

      return returnedNationality

    } catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message
    }
    finally {
      loading.value = false

    }
  }
  async function addNationalityStore(nationality: Nationality) {

    if (loading.value) return
    loading.value = true
    sleep(2000)
    try {
      const response = await addNationalityApi(api, nationality)
      var returnedNationality: Nationality
      returnedNationality = response.response.data
      nationalities.value.push(returnedNationality)
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message

      return returnedNationality


    } catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message
    }
    finally {
      loading.value = false
    }
  }
  async function editNationalityStore(nationality: Nationality) {

    if (loading.value) return
    loading.value = true
    sleep(2000)
    try {
      const response = await editNationalityApi(api, nationality)
      var returnedNationality: Nationality
      returnedNationality = response.response.data
      nationalities.value.splice(nationalities.value.findIndex((nationalityElement) => nationalityElement.id = nationality.id), 1)
      nationalities.value.push(returnedNationality)
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
  async function getNationalities(searchFilter: NationalitySearchFilter) {

    if (loading.value) return

    loading.value = true

    try {
      const returnedResponse = await getNationalitiesApi(api, searchFilter)
      nationalities.value = returnedResponse.response.data
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
    nationalities,
    pagination,
    loading,
    deleteNationalityStore,
    addNationalityStore,
    editNationalityStore,
    getNationalityStore,
    getNationalities,
    loading

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
  import.meta.hot.accept(acceptHMRUpdate(useNationality, import.meta.hot))
}
