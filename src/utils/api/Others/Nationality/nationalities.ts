import { AxiosInstance } from "axios"
import { Nationality, NationalitySearchFilter } from "/@src/models/Others/Nationality/nationality"
import { CustomResponseCollection, CustomResponseSingle } from "/@src/utils/response"

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
