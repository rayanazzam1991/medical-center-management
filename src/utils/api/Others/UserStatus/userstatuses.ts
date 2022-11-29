import type { AxiosInstance } from 'axios'
import { CustomResponseCollection, CustomResponseSingle } from '../../../response'

export interface UserStatus {
  id?: number
  name: string
}
export interface SearchFilter {
  name?: string
  page?: number
  order_by?: string
  order?: string
}

export async function deleteUserStatusApi(
  api: AxiosInstance,
  userstatusId: number
): Promise<{ response: CustomResponseCollection }> {
  const { data: response, headers } = await api.delete(`userstatus/${userstatusId}`)

  return { response }
}
export async function addUserStatusApi(
  api: AxiosInstance,
  userstatus: UserStatus
): Promise<{ response: CustomResponseSingle }> {
  console.log('api', userstatus)

  const { data: response, headers } = await api.post(`userstatus/`, userstatus)

  return { response }
}
export async function editUserStatusApi(
  api: AxiosInstance,
  userstatus: UserStatus
): Promise<{ response: CustomResponseSingle }> {
  console.log('api', userstatus)
  console.log(typeof userstatus.id)
  const { data: response, headers } = await api.put(
    `userstatus/${userstatus.id}`,
    userstatus
  )
  console.log(response)
  return { response }
}
export async function getUserStatusApi(
  api: AxiosInstance,
  userstatusId: number
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.get(`userstatus/${userstatusId}`)

  return { response }
}
export async function getUserStatusesApi(
  api: AxiosInstance,
  searchFilter: SearchFilter
): Promise<{ response: CustomResponseCollection }> {
  const { data: response, headers } = await api.get('userstatus/getStatusList', {
    params: searchFilter,
  })
  return { response }
}
