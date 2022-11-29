import { useUser } from '/@src/stores/Others/User/userStore'
import { User, UserSearchFilter } from '/@src/utils/api/Others/User'
import { Pagination } from '/@src/utils/response'

export async function getUsersList(searchFilter: UserSearchFilter) {
  const user = useUser()
  await user.getUsersStore(searchFilter)

  var users: User[] = user.users
  var pagination: Pagination = user.pagination
  return { users, pagination }
}
