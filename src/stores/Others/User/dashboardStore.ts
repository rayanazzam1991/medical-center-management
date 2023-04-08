import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { AnalystDashboard, AdminDashboard, HRDashboard, InventoryDashboard, defaultAnalystDashboard, defaultAdminDashboard, defaultHRDashboard, defaultInventoryDashboard } from "/@src/models/Others/User/dashboard"
import { getAnalystDashboadApi, getAdminDashboardApi, getHumanResourcesDashboadApi, getInventoryDashboardApi } from "/@src/utils/api/Others/User"
import sleep from "/@src/utils/sleep"




export const useDashboard = defineStore('dashboard', () => {

    const api = useApi()
  const inventoryDashboard = ref<InventoryDashboard>(defaultInventoryDashboard)
  const adminDashboard = ref<AdminDashboard>(defaultAdminDashboard)
    const hrDashboard = ref<HRDashboard>(defaultHRDashboard)
    const analystDashboard = ref<AnalystDashboard>(defaultAnalystDashboard)
    const loading = ref(false)
    const success = ref<boolean>()
    const error_code = ref<string>()
    const message = ref<string>()

    async function getAdminDashboardStore() {
      if (loading.value) return
      loading.value = true
      sleep(2000)
      try {
          const response = await getAdminDashboardApi(api)
          adminDashboard.value = response.response.data
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
    async function getInventoryDashboardStore() {
        if (loading.value) return
        loading.value = true
        sleep(2000)
        try {
            const response = await getInventoryDashboardApi(api)
            inventoryDashboard.value = response.response.data
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
    async function getHumanResourcesDashboardStore() {
        if (loading.value) return
        loading.value = true
        sleep(2000)
        try {
            const response = await getHumanResourcesDashboadApi(api)
            hrDashboard.value = response.response.data
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
    async function getAnalystDashboardStore() {
        if (loading.value) return
        loading.value = true
        sleep(2000)
        try {
            const response = await getAnalystDashboadApi(api)
            analystDashboard.value = response.response.data
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

    return {
        success,
        error_code,
        message,
        loading,
        inventoryDashboard,
      hrDashboard,
        analystDashboard,
      adminDashboard,
      getAdminDashboardStore,
        getInventoryDashboardStore,
        getHumanResourcesDashboardStore,
        getAnalystDashboardStore
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
    import.meta.hot.accept(acceptHMRUpdate(useDashboard, import.meta.hot))
}
