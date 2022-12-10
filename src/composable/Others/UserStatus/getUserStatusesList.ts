import { useUserStatus } from '/@src/stores/Others/UserStatus/userStatusStore'
import { UserStatus , UserStatusSearchFilter   } from '/@src/utils/api/Others/UserStatus'
import { Pagination } from '/@src/utils/response'

export async function getUserStatusesList(searchFilter: UserStatusSearchFilter) {
  const userstatus = useUserStatus()
  await userstatus.getUserStatusesStore(searchFilter)

  var userstatuses: UserStatus[] = userstatus.userstatuses
  var pagination: Pagination = userstatus.pagination
  return { userstatuses, pagination }
}
