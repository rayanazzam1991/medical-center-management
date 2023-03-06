import { AxiosInstance } from "axios"
import { Service, ServiceSearchFilter } from "/@src/models/Others/Service/service"
import { CustomResponseCollection, CustomResponseSingle } from "/@src/utils/response"

export async function deleteServiceApi(
  api: AxiosInstance,
  serviceId: number
): Promise<{ response: CustomResponseCollection }> {
  const { data: response, headers } = await api.delete(`service/${serviceId}`)

  return { response }
}
export async function addServiceApi(
  api: AxiosInstance,
  service: Service
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.post(`service`, service)

  return { response }
}
export async function editServiceApi(
  api: AxiosInstance,
  service: Service
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.put(`service/${service.id}`, service)
  return { response }
}
export async function getServiceApi(
  api: AxiosInstance,
  serviceId: number
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.get(`service/${serviceId}`)

  return { response }
}
export async function getServicesApi(
  api: AxiosInstance,
  searchFilter: ServiceSearchFilter
): Promise<{ response: CustomResponseCollection }> {
  const { data: response, headers } = await api.get('service/getServicesList', {
    params: searchFilter,
  })
  return { response }
}
export async function getServicesWithProvidersApi(
  api: AxiosInstance,
): Promise<{ response: CustomResponseCollection }> {
  const { data: response, headers } = await api.get('service/getServicesListWithProviders')
  return { response }
}
