import type { AxiosInstance } from 'axios'
import { CustomResponseCollection, CustomResponseSingle } from '../../../response'

export interface Service {
  id?: number
  name: string
  status: number
  description?: string
  service_price?: number
  duration_minutes?: number
}
export interface ServiceSearchFilter {
  name?: string
  status?: number
  service_price?: number
  duration_minutes?: number
  page?: number
  per_page?: number
  order_by?: string
  order?: string
}

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
