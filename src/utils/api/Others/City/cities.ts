import type { AxiosInstance } from 'axios'
import { CustomResponse } from '../../../response'

export interface City {
  id: number
  name : string
  status: number
}


export async function getCities(
  api: AxiosInstance,
  start = 0,
  limit = 20
): Promise<{ response: CustomResponse;  }> {

  const { data: response , headers } = await api.get(
    'city'
  )
  
  // const citiesData = cities.data
  // console.log(cities)
  return { response }
}

export async function deleteCityApi(
  api: AxiosInstance,
  cityId : number
  ): Promise<{ response: CustomResponse;  }> {

  const { data: response, headers } = await api.delete(
    `city/${cityId}`
  )

  return { response }
}
