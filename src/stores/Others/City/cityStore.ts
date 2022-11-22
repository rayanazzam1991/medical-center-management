/**
 * This is a store that hold the messaging-v1 state
 * It uses the useApi composition component to make the api calls
 *
 * @see /src/pages/messaging-v1.vue
 * @see /src/composable/useApi.ts
 * @see /src/components/partials/chat/*.vue
 * @see /src/utils/api/chat
 */

 import { ref, computed } from 'vue'
 import { acceptHMRUpdate, defineStore } from 'pinia'
 
 import { City, getCities , deleteCityApi, addCityApi , editCityApi } from '/@src/utils/api/Others/City'
 import { useApi } from '/@src/composable/useApi'
 
 export const defaultCity: City = {
   id: 0,
   name: '',
   status: 0,
 }
 
 export const useCity = defineStore('city', () => {
   const api = useApi()
   const cities = ref<City[]>([])
   const loading = ref(false)
 
async function loadCities(start = 0, limit = 10) {
  if (loading.value) return

  loading.value = true

  try {
    const returnedResponse = await getCities(api, start, limit)
    cities.value = returnedResponse.response.data

  } finally {
    loading.value = false
  }
}
async function deleteCityStore(cityId : number) {
  if (loading.value) return

  loading.value = true

  try {
    const response = await deleteCityApi(api, cityId)
    cities.value.splice(cities.value.findIndex((city : City) => city.id === cityId),1)

  } finally {
    loading.value = false
  }
}
async function addCityStore(city : City) {

  if (loading.value) return

  loading.value = true

  try {
    const response = await addCityApi(api, city)
    var returnedCity : City
    returnedCity = response.response.data 
    cities.value.push(returnedCity)
    console.log('store', cities.value)


  } finally {
    loading.value = false
  }
}
async function editCityStore(city : City) {

  if (loading.value) return

  loading.value = true

  try {
    const response = await editCityApi(api, city)
    var returnedCity : City
    returnedCity = response.response.data 
    cities.value.splice( cities.value.findIndex((cityElement) => cityElement.id = city.id ),1)
    cities.value.push(returnedCity)
    console.log('store', cities.value)


  } finally {
    loading.value = false
  }
}
 
   return {
    cities,
    loadCities,
    deleteCityStore,
    addCityStore,
    editCityStore
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
 