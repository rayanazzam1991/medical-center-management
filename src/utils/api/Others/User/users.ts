import { AxiosInstance } from "axios"
import { CreateUpdateUser, ChangeUserStatus, UserSearchFilter, GenerateUniqueUsernameData } from "/@src/models/Others/User/user"
import { CustomResponseCollection, CustomResponseSingle } from "/@src/utils/response"

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
  const { data: response, headers } = await api.post(`user`, user)

  return { response }
}
export async function editUserApi(
  api: AxiosInstance,
  user: CreateUpdateUser
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.put(`user/${user.id}`, user)
  return { response }
}
export async function changeUserStatusApi(
  api: AxiosInstance,
  user: ChangeUserStatus
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.put(
    `user/${user.id}/changeUserStatus`,
    user
  )
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

export async function getUsersWithoutCustomerApi(
  api: AxiosInstance,
  searchFilter: UserSearchFilter
): Promise<{ response: CustomResponseCollection }> {
  const { data: response, headers } = await api.get('user/getUserListWithoutCustomer', {
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
export async function generateUniqueUsernameApi(
  api: AxiosInstance,
  data: GenerateUniqueUsernameData
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.post(`user/generateUniqueUsername`, data)
  return { response }
}
