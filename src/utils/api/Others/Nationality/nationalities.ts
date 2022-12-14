import type { AxiosInstance } from 'axios'
import { CustomResponseCollection, CustomResponseSingle } from '../../../response'

export interface Nationality {
  id?: number
  name: string
  status: number
}
export interface NationalitySearchFilter {
  name?: string
  status?: number
  page?: number
  per_page?: number
  order_by?: string
  order?: string
}

export async function deleteNationalityApi(
  api: AxiosInstance,
  nationalityId: number
): Promise<{ response: CustomResponseCollection }> {
  const { data: response, headers } = await api.delete(`nationality/${nationalityId}`)

  return { response }
}
export async function addNationalityApi(
  api: AxiosInstance,
  nationality: Nationality
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.post(`nationality`, nationality)

  return { response }
}
export async function editNationalityApi(
  api: AxiosInstance,
  nationality: Nationality
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.put(
    `nationality/${nationality.id}`,
    nationality
  )
  return { response }
}
export async function getNationalityApi(
  api: AxiosInstance,
  nationalityId: number
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.get(`nationality/${nationalityId}`)

  return { response }
}
export async function getNationalitiesApi(
  api: AxiosInstance,
  searchFilter: NationalitySearchFilter
): Promise<{ response: CustomResponseCollection }> {
  const { data: response, headers } = await api.get('nationality/getNationalitiesList', {
    params: searchFilter,
  })
  return { response }
}
