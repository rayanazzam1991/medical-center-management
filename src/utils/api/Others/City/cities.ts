import type { AxiosInstance } from 'axios'
import {CustomResponseCollection,CustomResponseSingle} from '../../../response'

export interface City {
  id?: number
  name : string
  status: number
}


export async function getCities(
  api: AxiosInstance,
  start = 0,
  limit = 20
): Promise<{ response: CustomResponseCollection;  }> {

  const { data: response , headers } = await api.get(
    'city'
  )
  
  return { response }
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
