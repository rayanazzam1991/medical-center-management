import { useUser } from '/@src/stores/Others/User/userStore'
import { CreateUpdateUser } from '/@src/utils/api/Others/User'
import { ChangeUserStatus } from '/@src/utils/api/Others/User'
import { User, UserSearchFilter } from '/@src/utils/api/Others/User'
import { Pagination } from '/@src/utils/response'

export async function addUser(userData: CreateUpdateUser) {
  console.log(userData)
  const user = useUser()
  return await user.addUserStore(userData)
}
export async function getUser(userId: number) {
  const user = useUser()
  return await user.getUserStore(userId)
}
export async function editUser(userData: CreateUpdateUser) {
  const user = useUser()
  await user.editUserStore(userData)
}
export async function changeUserStatus(userData: ChangeUserStatus) {
  const user = useUser()
  await user.changeUserStatusStore(userData)
}
export async function deleteUser(userId: number) {
  const user = useUser()
  await user.deleteUserStore(userId)
}

export async function getUsersList(searchFilter: UserSearchFilter) {
  const user = useUser()
  await user.getUsersStore(searchFilter)

  var users: User[] = user.users
  var pagination: Pagination = user.pagination
  return { users, pagination }
}
export async function phoneExistsCheck(phone_number: string) {
  const user = useUser()
  const result = await user.phoneExistsCheckStore(phone_number)

  return { result }
}
