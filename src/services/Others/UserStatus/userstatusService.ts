import { useUserStatus } from '/@src/stores/Others/UserStatus/userStatusStore'
import { UserStatus, UserStatusSearchFilter } from '/@src/utils/api/Others/UserStatus'
import { Pagination } from '/@src/utils/response'

export async function addUserStatus(userstatusData: UserStatus) {
  const userstatus = useUserStatus()
  return await userstatus.addUserStatusStore(userstatusData)
}
export async function deleteUserStatus(userstatusId: number) {
  const userstatus = useUserStatus()
  await userstatus.deleteUserStatusStore(userstatusId)
}
export async function editUserStatus(userstatusData: UserStatus) {
  const userstatus = useUserStatus()
  await userstatus.editUserStatusStore(userstatusData)
}
export async function getUserStatus(userstatusId: number) {
  const userstatus = useUserStatus()
  return await userstatus.getUserStatusStore(userstatusId)
}
export async function getUserStatusesList(searchFilter: UserStatusSearchFilter) {
  const userstatus = useUserStatus()
  await userstatus.getUserStatusesStore(searchFilter)

  var userstatuses: UserStatus[] = userstatus.userstatuses
  var pagination: Pagination = userstatus.pagination
  return { userstatuses, pagination }
}
