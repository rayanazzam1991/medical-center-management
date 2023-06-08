import { defineStore, acceptHMRUpdate } from "pinia";
import { useApi } from "/@src/composable/useApi"
import { National, NationalSearchFilter } from "/@src/models/Others/National/national"
import { NationalApi } from "/@src/utils/api/Others/National"
import { CustomResponseSingle, Pagination, defaultPagination } from "/@src/utils/response"

export const nationalStore = defineStore('national', () => {
  const api = useApi()
  const _nationalApi = new NationalApi()
  const nationals = ref<National[]>([])
  const pagination = ref<Pagination>(defaultPagination)
  const loading = ref(false)
  const success = ref<boolean>()
  const error_code = ref<string>()
  const message = ref<string>()

  async function get(NationalSearchFilter: NationalSearchFilter) {
    if (loading.value) return
    loading.value = true
    try {
      const response = await _nationalApi.get(api, NationalSearchFilter)
      nationals.value = response.response.data
      pagination.value = response.response.pagination
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

  async function show(id: Number) {
    if (loading.value) return
    loading.value = true
    try {
      const response = await _nationalApi.show(api, id)
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message
      return response.response.data
    } catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message
    }
    finally {
      loading.value = false
    }
  }

  async function store(national: National) {
    if (loading.value) return
    loading.value = true
    try {
      const response = await _nationalApi.store(api, national)
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message
      return response.response.data
    } catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message
    }
    finally {
      loading.value = false
    }
  }

  async function update(national: National) {
    if (loading.value) return
    loading.value = true
    try {
      const response = await _nationalApi.update(api, national)
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message
      return response.response.data
    } catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message
    }
    finally {
      loading.value = false
    }
  }

  async function destroy(id: Number) {
    if (loading.value) return
    loading.value = true
    try {
      nationals.value.splice(nationals.value.findIndex((national: National) => national.id === id), 1)
      const response = await _nationalApi.destroy(api, id)
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

  return {
    success,
    error_code,
    message,
    nationals,
    pagination,
    loading,
    get,
    show,
    store,
    update,
    destroy
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
  import.meta.hot.accept(acceptHMRUpdate(nationalStore, import.meta.hot))
}
