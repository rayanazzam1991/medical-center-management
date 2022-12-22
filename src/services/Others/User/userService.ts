import { useUser } from '/@src/stores/Others/User/userStore'
import { CreateUpdateUser, ChangeUserStatus, User, UserSearchFilter, defaultUser } from '/@src/models/Others/User/user'
import { Pagination } from '/@src/utils/response'

export async function addUser(userData: CreateUpdateUser) {
  const userResponse = useUser()
  var user: User = await userResponse.addUserStore(userData) ?? defaultUser
  var success: boolean = userResponse.success ?? false
  var error_code: string = userResponse.error_code ?? ''
  var message: string = userResponse.message ?? ''
  return { success, error_code, message, user }

}
export async function getUser(userId: number) {
  const userResponse = useUser()
  var user: User = await userResponse.getUserStore(userId) ?? defaultUser
  var success: boolean = userResponse.success ?? false
  var error_code: string = userResponse.error_code ?? ''
  var message: string = userResponse.message ?? ''
  return { success, error_code, message, user }

}
export async function editUser(userData: CreateUpdateUser) {
  const userResponse = useUser()
  await userResponse.editUserStore(userData)
  var success: boolean = userResponse.success ?? false
  var error_code: string = userResponse.error_code ?? ''
  var message: string = userResponse.message ?? ''
  return { success, error_code, message }
}
export async function changeUserStatus(userData: ChangeUserStatus) {
  const userResponse = useUser()
  await userResponse.changeUserStatusStore(userData)
  var success: boolean = userResponse.success ?? false
  var error_code: string = userResponse.error_code ?? ''
  var message: string = userResponse.message ?? ''
  return { success, error_code, message }

}
export async function deleteUser(userId: number) {
  const userResponse = useUser()
  await userResponse.deleteUserStore(userId)
  var success: boolean = userResponse.success ?? false
  var error_code: string = userResponse.error_code ?? ''
  var message: string = userResponse.message ?? ''
  return { success, error_code, message }
}

export async function getUsersList(searchFilter: UserSearchFilter) {
  const userResponse = useUser()
  await userResponse.getUsersStore(searchFilter)
  var success: boolean = userResponse.success ?? false
  var error_code: string = userResponse.error_code ?? ''
  var message: string = userResponse.message ?? ''
  var users: User[] = userResponse.users
  var pagination: Pagination = userResponse.pagination

  return { success, error_code, message, users, pagination }

}
export async function phoneExistsCheck(phone_number: string) {
  const userResponse = useUser()
  var result = await userResponse.phoneExistsCheckStore(phone_number)
  var success: boolean = userResponse.success ?? false
  var error_code: string = userResponse.error_code ?? ''
  var message: string = userResponse.message ?? ''
  var users: User[] = userResponse.users
  var pagination: Pagination = userResponse.pagination
  return { success, error_code, message, result }

}
