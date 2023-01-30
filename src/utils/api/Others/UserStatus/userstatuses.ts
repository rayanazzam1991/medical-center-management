import { AxiosInstance } from "axios"
import { UserStatus, UserStatusSearchFilter } from "/@src/models/Others/UserStatus/userStatus"
import { CustomResponseCollection, CustomResponseSingle } from "/@src/utils/response"


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

  const { data: response, headers } = await api.post(`userstatus`, userstatus)

  return { response }
}
export async function editUserStatusApi(
  api: AxiosInstance,
  userstatus: UserStatus
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.put(
    `userstatus/${userstatus.id}`,
    userstatus
  )
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
  searchFilter: UserStatusSearchFilter
): Promise<{ response: CustomResponseCollection }> {
  const { data: response, headers } = await api.get('userstatus/getStatusList', {
    params: searchFilter,
  })
  return { response }
}
