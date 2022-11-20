import type { AxiosInstance } from 'axios'

export interface City {
  id: number
  name : string
  status: number
}

export async function getCities(
  api: AxiosInstance,
  start = 0,
  limit = 20
): Promise<{ cities: City[];  }> {

  const { data: cities, headers } = await api.get<City[]>(
    'city'
  )


  return { cities }
}
