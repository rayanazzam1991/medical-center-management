

 import { ref } from 'vue'
 import { acceptHMRUpdate, defineStore } from 'pinia'
 
 import {  NationalitySearchFilter ,Nationality, getNationalityApi , deleteNationalityApi, addNationalityApi , editNationalityApi , getNationalitiesApi } from '/@src/utils/api/Others/Nationality'
 import { useApi } from '/@src/composable/useApi'
import { Pagination ,defaultPagination } from '/@src/utils/response'
 
 export const defaultNationality: Nationality = {
  id: 0,
  name: '',
  status: 1,
}

export const defaultNationalitySearchFilter: NationalitySearchFilter = {
  name: undefined,
  status: undefined,
  page : undefined,
  order : undefined,
  order_by : undefined,
  per_page : undefined
}

export const useNationality = defineStore('nationality', () => {
   const api = useApi()
   const nationalities = ref<Nationality[]>([])
   const pagination = ref<Pagination>(defaultPagination)
   const loading = ref(false)
 
async function deleteNationalityStore(nationalityId : number) {
  if (loading.value) return

  loading.value = true

  try {
    const response = await deleteNationalityApi(api, nationalityId)
    nationalities.value.splice(nationalities.value.findIndex((nationality : Nationality) => nationality.id === nationalityId),1)

  } finally {
    loading.value = false
  }
}
async function getNationalityStore(nationalityId : number) {
  if (loading.value) return

  loading.value = true

  try {
    const response = await getNationalityApi(api, nationalityId)
    var returnedNationality : Nationality
    returnedNationality = response.response.data 
    return returnedNationality

  } finally {
    loading.value = false

  }
}
async function addNationalityStore(nationality : Nationality) {

  if (loading.value) return

  loading.value = true

  try {
    const response = await addNationalityApi(api, nationality)
    var returnedNationality : Nationality
    returnedNationality = response.response.data 
    nationalities.value.push(returnedNationality)
    return returnedNationality


  } finally {
    loading.value = false
  }
}
async function editNationalityStore(nationality : Nationality) {

  if (loading.value) return

  loading.value = true

  try {
    const response = await editNationalityApi(api, nationality)
    var returnedNationality : Nationality
    returnedNationality = response.response.data 
    nationalities.value.splice( nationalities.value.findIndex((nationalityElement) => nationalityElement.id = nationality.id ),1)
    nationalities.value.push(returnedNationality)


  } finally {
    loading.value = false
  }
}
async function getNationalities(searchFilter : NationalitySearchFilter) {

  if (loading.value) return

  loading.value = true

  try {
    const returnedResponse = await getNationalitiesApi(api, searchFilter)
    nationalities.value = returnedResponse.response.data
    pagination.value = returnedResponse.response.pagination
    
  } finally {
    loading.value = false
  }
}

   return {
    nationalities,
    pagination,
    deleteNationalityStore,
    addNationalityStore,
    editNationalityStore,
    getNationalityStore,
    getNationalities
    
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
 