import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { Setting } from "../../../models/Others/Setting/setting"
import { editSettingsApi, getSettingsApi } from "/@src/utils/api/Others/Setting"
import { Pagination, defaultPagination } from "/@src/utils/response"


export const useSetting = defineStore('setting', () => {
    const api = useApi()
    const settings = ref<Setting[]>([])
    const pagination = ref<Pagination>(defaultPagination)
    const loading = ref(false)
    const success = ref<boolean>()
    const error_code = ref<string>()
    const message = ref<string>()
    const settingsStorage = useStorage('settings', <Array<Setting>>[])

    async function getSettingsStore() {
        if (loading.value) return

        loading.value = true

        try {
            const returnedResponse = await getSettingsApi(api)
            settings.value = returnedResponse.response.data
            setSettings(returnedResponse.response.data)
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

    function setSettings(settings: Setting[]) {
        settingsStorage.value = settings as Setting[]
    }
    function getSettings(): Setting[] {
        return settingsStorage.value;
    }
    function removeFromStorage () {
        settingsStorage.value = undefined
    }
    async function editSettingsStore(newSettings: Setting[]) {
        if (loading.value) return
        loading.value = true
        try {
            const response = await editSettingsApi(api, newSettings)
            settings.value = response.response.data
            setSettings(response.response.data)

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
        settings,
        pagination,
        loading,
        getSettingsStore,
        getSettings,
        setSettings,
        editSettingsStore,
        removeFromStorage
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
    import.meta.hot.accept(acceptHMRUpdate(useSetting, import.meta.hot))
}
