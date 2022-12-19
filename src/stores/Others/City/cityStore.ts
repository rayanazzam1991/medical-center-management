import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { City, CitySearchFilter } from "/@src/models/Others/City/city"
import { deleteCityApi, getCityApi, addCityApi, editCityApi, getCitiesApi } from "/@src/utils/api/Others/City"
import { Pagination, defaultPagination } from "/@src/utils/response"
import sleep from "/@src/utils/sleep";


export const useCity = defineStore('city', () => {
  const api = useApi()
  const cities = ref<City[]>([])
  const pagination = ref<Pagination>(defaultPagination)
  const loading = ref(false)
  const success = ref<boolean>()
  const error_code = ref<string>()
  const message = ref<string>()

  async function deleteCityStore(cityId: number) {
    if (loading.value) return

    loading.value = true

    try {
      const response = await deleteCityApi(api, cityId)
      cities.value.splice(
        cities.value.findIndex((city: City) => city.id === cityId),
        1
      )
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message

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
  async function getCityStore(cityId: number) {
    if (loading.value) return

    loading.value = true
    sleep(2000)


    try {
      const response = await getCityApi(api, cityId)
      var returnedCity: City
      returnedCity = response.response.data
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message

      return returnedCity
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
  async function addCityStore(city: City) {
    if (loading.value) return
    loading.value = true
    sleep(2000)
    try {
      const response = await addCityApi(api, city)
      var returnedCity: City
      returnedCity = response.response.data
      cities.value.push(returnedCity)
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message

      return returnedCity
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
  async function editCityStore(city: City) {
    if (loading.value) return
    loading.value = true
    sleep(2000)
    try {
      const response = await editCityApi(api, city)
      var returnedCity: City
      returnedCity = response.response.data
      cities.value.splice(
        cities.value.findIndex((cityElement) => (cityElement.id = city.id)),
        1
      )
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message

      cities.value.push(returnedCity)
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
  async function getCitiesStore(searchFilter: CitySearchFilter) {
    if (loading.value) return

    loading.value = true

    try {
      const returnedResponse = await getCitiesApi(api, searchFilter)
      cities.value = returnedResponse.response.data
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



  return {
    success,
    error_code,
    message,
    cities,
    pagination,
    loading,
    deleteCityStore,
    addCityStore,
    editCityStore,
    getCityStore,
    getCitiesStore,
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
  import.meta.hot.accept(acceptHMRUpdate(useCity, import.meta.hot))
}
