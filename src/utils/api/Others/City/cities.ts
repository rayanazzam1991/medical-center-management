import { AxiosInstance } from "axios"
import { City, CitySearchFilter } from "/@src/models/Others/City/city"
import { CustomResponseCollection, CustomResponseSingle } from "/@src/utils/response"

export async function deleteCityApi(
  api: AxiosInstance,
  cityId: number
): Promise<{ response: CustomResponseCollection }> {
  const { data: response, headers } = await api.delete(`city${cityId}`)

  return { response }
}
export async function addCityApi(
  api: AxiosInstance,
  city: City
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.post(`city`, city)

  return { response }
}
export async function editCityApi(
  api: AxiosInstance,
  city: City
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.put(`city/${city.id}`, city)
  return { response }
}
export async function getCityApi(
  api: AxiosInstance,
  cityId: number
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.get(`city/${cityId}`)

  return { response }
}
export async function getCitiesApi(
  api: AxiosInstance,
  searchFilter: CitySearchFilter
): Promise<{ response: CustomResponseCollection }> {
  const { data: response, headers } = await api.get('city/getCitiesList', {
    params: searchFilter,
  })
  return { response }
}
