import type { AxiosInstance } from 'axios'
import {CustomResponseCollection,CustomResponseSingle} from '../../../response'

export interface City {
  id?: number
  name : string
  status: number
}
export interface CitySearchFilter {
  name? : string
  status?: number
  page? : number
  per_page? : number
  order_by? : string
  order? : string
}



export async function deleteCityApi(
  api: AxiosInstance,
  cityId : number
  ): Promise<{ response: CustomResponseCollection;  }> {

  const { data: response, headers } = await api.delete(
    `city/${cityId}`
  )

  return { response }
}
export async function addCityApi(
  api: AxiosInstance,
  city : City
  ): Promise<{ response: CustomResponseSingle;  }> {
    console.log('api', city)

  const { data: response, headers } = await api.post(
    `city/`,city
  )

  return { response }
}
export async function editCityApi(
  api: AxiosInstance,
  city : City
  ): Promise<{ response: CustomResponseSingle;  }> {
    console.log('api', city)
    console.log(typeof(city.id))
  const { data: response, headers } = await api.put(
    `city/${city.id}`,city
  )
  console.log(response)
  return { response }
}
export async function getCityApi(
  api: AxiosInstance,
  cityId : number
  ): Promise<{ response: CustomResponseSingle;  }> {

    const { data: response, headers } = await api.get(
      `city/${cityId}`
    )
  
  return { response }
}
export async function getCitiesApi(
  api: AxiosInstance,
  searchFilter : CitySearchFilter
  ): Promise<{ response: CustomResponseCollection;  }> {

  const { data: response , headers  } = await api.get(
    'city/getCitiesList', { params: searchFilter }
  )
  return { response }
}

