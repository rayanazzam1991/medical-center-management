import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { ActivityLog, ActivityLogSearchFilter } from "/@src/models/Others/ActivityLog/activityLog";
import { getActivityLogListApi } from "/@src/utils/api/Others/AcivityLog";
import { Pagination, defaultPagination } from "/@src/utils/response"


export const useActivityLog = defineStore('activity_log', () => {
  const api = useApi()
  const activitiesLog = ref<ActivityLog[]>([])
  const pagination = ref<Pagination>(defaultPagination)
  const loading = ref(false)
  const success = ref<boolean>()
  const error_code = ref<string>()
  const message = ref<string>()

  async function getActivityLogStore(searchFilter:ActivityLogSearchFilter) {
    if (loading.value) return

    loading.value = true

    try {
      const returnedResponse = await getActivityLogListApi(api,searchFilter)
      activitiesLog.value = returnedResponse.response.data
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
    activitiesLog,
    pagination,
    loading,
    getActivityLogStore
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
  import.meta.hot.accept(acceptHMRUpdate(useActivityLog, import.meta.hot))
}
