import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { MedicalInfo } from "/@src/utils/api/CRM/MedicalInfo"
import { Pagination, defaultPagination } from "/@src/utils/response"

export const defaultMedicalInfo: MedicalInfo = {
    id: undefined,
    blood_type: undefined,
    allergic: undefined,
    chronic_diseases: undefined,
    infectious_diseases: undefined,
    any_other_info: undefined,
    status: 1,
    smoking: undefined,
    }
  


export const useMedicalInfo = defineStore('medicalInfo', () => {
  const api = useApi()
  const medicalInfos = ref<MedicalInfo[]>([])
  const pagination = ref<Pagination>(defaultPagination)
  const loading = ref(false)

  // async function addMedicalInfoStore(medicalInfo: MedicalInfo) {
  //   if (loading.value) return

  //   loading.value = true

  //   try {
  //     const response = await addMedicalInfoApi(api, medicalInfo)
  //     var returnedMedicalInfo: MedicalInfo
  //     returnedMedicalInfo = response.response.data
  //     medicalInfos.value.push(returnedMedicalInfo)
  //     return returnedMedicalInfo
  //   } finally {
  //     loading.value = false
  //   }
  // }

  return {
    medicalInfos,
    pagination,
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
  import.meta.hot.accept(acceptHMRUpdate(useMedicalInfo, import.meta.hot))
}