import { CreateService, defaultService, Service, ServiceSearchFilter, ServiceWithProvider } from "/@src/models/Others/Service/service"
import { useService } from "/@src/stores/Others/Service/serviceStore"
import { Pagination } from "/@src/utils/response"


export async function addService(serviceData: CreateService) {
  const serviceResponse = useService()
  var service: CreateService = await serviceResponse.addServiceStore(serviceData) ?? defaultService
  var success: boolean = serviceResponse.success ?? false
  var error_code: string = serviceResponse.error_code ?? ''
  var message: string = serviceResponse.message ?? ''
  return { success, error_code, message, service }
}

export async function deleteService(serviceId: number) {
  const serviceResponse = useService()
  await serviceResponse.deleteServiceStore(serviceId)
  var success: boolean = serviceResponse.success ?? false
  var error_code: string = serviceResponse.error_code ?? ''
  var message: string = serviceResponse.message ?? ''
  return { success, error_code, message }

}

export async function editService(serviceData: CreateService) {
  const serviceResponse = useService()
  await serviceResponse.editServiceStore(serviceData)
  var success: boolean = serviceResponse.success ?? false
  var error_code: string = serviceResponse.error_code ?? ''
  var message: string = serviceResponse.message ?? ''
  return { success, error_code, message }
}

export async function getService(serviceId: number) {
  const serviceResponse = useService()
  var service: Service = await serviceResponse.getServiceStore(serviceId) ?? defaultService
  var success: boolean = serviceResponse.success ?? false
  var error_code: string = serviceResponse.error_code ?? ''
  var message: string = serviceResponse.message ?? ''
  return { success, error_code, message, service }
}

export async function getServicesList(searchFilter: ServiceSearchFilter) {
  const serviceResponse = useService()
  await serviceResponse.getServicesStore(searchFilter)
  var services: Service[] = serviceResponse.services
  var pagination: Pagination = serviceResponse.pagination
  var success: boolean = serviceResponse.success ?? false
  var error_code: string = serviceResponse.error_code ?? ''
  var message: string = serviceResponse.message ?? ''
  return { success, error_code, message, services, pagination }

}
export async function getServicesWithProviders() {
  const serviceResponse = useService()
  const services: ServiceWithProvider[] = await serviceResponse.getServicesWithProvidersStore() ?? []
  const pagination: Pagination = serviceResponse.pagination
  const success: boolean = serviceResponse.success ?? false
  const error_code: string = serviceResponse.error_code ?? ''
  const message: string = serviceResponse.message ?? ''
  return { success, error_code, message, services, pagination }

}
