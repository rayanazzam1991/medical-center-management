import type { AxiosInstance } from 'axios'
import { CustomResponseCollection, CustomResponseSingle } from '../../../response'
import { City } from '../City'
import { Department } from '../Department'
import { Room } from '../Room'
import { UserStatus } from '../UserStatus'

export interface User {
  id?: number
  first_name: string
  last_name: string
  password: string
  gender: string
  birth_date: string
  phone_number: string
  address: string
  room: Room
  city: City
  status: UserStatus
  role: string
}
export interface CreateUpdateUser {
  id?: number
  first_name: string
  last_name: string
  password: string
  gender: string
  birth_date: string
  phone_number: string
  address: string
  room_id?: number
  city_id?: number
  user_status_id?: number
  role: string
}
export interface UserSearchFilter {
  name?: string
  gender?: string
  phone_number?: string
  room_id?: number
  city_id?: number
  user_status_id?: number
  page?: number
  per_page?: number
  order_by?: string
  order?: string
}

export async function deleteUserApi(
  api: AxiosInstance,
  userId: number
): Promise<{ response: CustomResponseCollection }> {
  const { data: response, headers } = await api.delete(`user/${userId}`)

  return { response }
}
export async function addUserApi(
  api: AxiosInstance,
  user: CreateUpdateUser
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.post(`user/`, user)

  return { response }
}
export async function editUserApi(
  api: AxiosInstance,
  user: CreateUpdateUser
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.put(`user/${user.id}`, user)
  return { response }
}
export async function getUserApi(
  api: AxiosInstance,
  userId: number
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.get(`user/${userId}`)

  return { response }
}
export async function getUsersApi(
  api: AxiosInstance,
  searchFilter: UserSearchFilter
): Promise<{ response: CustomResponseCollection }> {
  const { data: response, headers } = await api.get('user/getUserList', {
    params: searchFilter,
  })
  return { response }
}
export async function phoneExistsCheckApi(
  api: AxiosInstance,
  phone_number: string
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.post(`user/phoneCheck`, {
    phone_number: phone_number,
  })
  return { response }
}
