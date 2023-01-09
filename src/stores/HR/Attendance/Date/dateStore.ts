import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { DaysNamePerMonth, DaysPerMonth } from "/@src/models/HR/Attendance/Date/date"
import { getDaysPerMonthApi, getDaysNamePerMonthApi } from "/@src/utils/api/HR/Attendance/Date"


export const useDate = defineStore('date', () => {
  const api = useApi()
  const loading = ref(false)
  const success = ref<boolean>()
  const error_code = ref<string>()
  const message = ref<string>()

  async function getDaysPerMonthStore(year: number) {
    if (loading.value) return

    loading.value = true

    try {
      const returnedResponse = await getDaysPerMonthApi(api, year)
      success.value = returnedResponse.response.success
      error_code.value = returnedResponse.response.error_code
      message.value = returnedResponse.response.message
      return returnedResponse.response.data as DaysPerMonth[]

    } catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message
    }
    finally {
      loading.value = false
    }
  }

  async function getDaysNamePerMonthStore(month: number, year: number) {
    if (loading.value) return
    loading.value = true
    try {
      const response = await getDaysNamePerMonthApi(api, month, year)
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message
      return response.response.data as DaysNamePerMonth[]


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
    loading,
    getDaysPerMonthStore,
    getDaysNamePerMonthStore
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
  import.meta.hot.accept(acceptHMRUpdate(useDate, import.meta.hot))
}
