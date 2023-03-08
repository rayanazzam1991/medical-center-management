import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { CreateService, Service, ServiceSearchFilter, ServiceWithProvider } from "/@src/models/Others/Service/service"
import { deleteServiceApi, getServiceApi, addServiceApi, editServiceApi, getServicesApi, getServicesWithProvidersApi } from "/@src/utils/api/Others/Service"
import { Pagination, defaultPagination } from "/@src/utils/response"
import sleep from "/@src/utils/sleep"


export const useService = defineStore('service', () => {
  const api = useApi()
  const services = ref<Service[]>([])
  const pagination = ref<Pagination>(defaultPagination)
  const loading = ref(false)
  const success = ref<boolean>()
  const error_code = ref<string>()
  const message = ref<string>()

  async function deleteServiceStore(serviceId: number) {
    if (loading.value) return

    loading.value = true

    try {
      const response = await deleteServiceApi(api, serviceId)
      services.value.splice(
        services.value.findIndex((service: Service) => service.id === serviceId),
        1
      )
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
  async function getServiceStore(serviceId: number) {
    if (loading.value) return
    loading.value = true
    sleep(2000)
    try {
      const response = await getServiceApi(api, serviceId)
      var returnedService: Service
      returnedService = response.response.data
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message

      return returnedService
    } catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message
    }
    finally {
      loading.value = false
    }
  }
  async function addServiceStore(service: CreateService) {
    if (loading.value) return
    loading.value = true
    sleep(2000)
    try {
      const response = await addServiceApi(api, service)
      var returnedService: Service
      returnedService = response.response.data
      services.value.push(returnedService)
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message

      return returnedService
    } catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message
    }
    finally {
      loading.value = false
    }
  }
  async function editServiceStore(service: CreateService) {
    if (loading.value) return
    loading.value = true
    sleep(2000)
    try {
      const response = await editServiceApi(api, service)
      var returnedService: Service
      returnedService = response.response.data
      services.value.splice(
        services.value.findIndex((serviceElement) => (serviceElement.id = service.id)),
        1
      )

      services.value.push(returnedService)
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
  async function getServicesStore(searchFilter: ServiceSearchFilter) {
    if (loading.value) return

    loading.value = true

    try {
      const returnedResponse = await getServicesApi(api, searchFilter)
      services.value = returnedResponse.response.data
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
  async function getServicesWithProvidersStore() {
    if (loading.value) return

    loading.value = true

    try {
      const returnedResponse = await getServicesWithProvidersApi(api)
      pagination.value = returnedResponse.response.pagination
      success.value = returnedResponse.response.success
      error_code.value = returnedResponse.response.error_code
      message.value = returnedResponse.response.message
      return returnedResponse.response.data as ServiceWithProvider[]

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
    services,
    pagination,
    loading,
    deleteServiceStore,
    addServiceStore,
    editServiceStore,
    getServiceStore,
    getServicesStore,
    getServicesWithProvidersStore
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
  import.meta.hot.accept(acceptHMRUpdate(useService, import.meta.hot))
}
