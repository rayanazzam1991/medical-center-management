import { useUserStatus } from '/@src/stores/Others/UserStatus/userStatusStore'
import { defaultUserStatus, UserStatus, UserStatusSearchFilter } from '/@src/models/Others/UserStatus/userStatus'
import { Pagination } from '/@src/utils/response'

export async function addUserStatus(userstatusData: UserStatus) {
  const userstatusResponse = useUserStatus()
  var userStatus: UserStatus = await userstatusResponse.addUserStatusStore(userstatusData) ?? defaultUserStatus
  var success: boolean = userstatusResponse.success ?? false
  var error_code: string = userstatusResponse.error_code ?? ''
  var message: string = userstatusResponse.message ?? ''
  return { success, error_code, message, userStatus }

}
export async function deleteUserStatus(userstatusId: number) {
  const userstatusResponse = useUserStatus()
  await userstatusResponse.deleteUserStatusStore(userstatusId)
  var success: boolean = userstatusResponse.success ?? false
  var error_code: string = userstatusResponse.error_code ?? ''
  var message: string = userstatusResponse.message ?? ''
  return { success, error_code, message }

}
export async function editUserStatus(userstatusData: UserStatus) {
  const userstatusResponse = useUserStatus()
  await userstatusResponse.editUserStatusStore(userstatusData)
  var success: boolean = userstatusResponse.success ?? false
  var error_code: string = userstatusResponse.error_code ?? ''
  var message: string = userstatusResponse.message ?? ''
  return { success, error_code, message }
}

export async function getUserStatus(userstatusId: number) {
  const userstatusResponse = useUserStatus()
  var userStatus: UserStatus = await userstatusResponse.getUserStatusStore(userstatusId) ?? defaultUserStatus
  var success: boolean = userstatusResponse.success ?? false
  var error_code: string = userstatusResponse.error_code ?? ''
  var message: string = userstatusResponse.message ?? ''
  return { success, error_code, message, userStatus }

}
export async function getUserStatusesList(searchFilter: UserStatusSearchFilter) {
  const userstatusResponse = useUserStatus()
  await userstatusResponse.getUserStatusesStore(searchFilter)
  var success: boolean = userstatusResponse.success ?? false
  var error_code: string = userstatusResponse.error_code ?? ''
  var message: string = userstatusResponse.message ?? ''
  var userstatuses: UserStatus[] = userstatusResponse.userstatuses
  var pagination: Pagination = userstatusResponse.pagination
  return { success, error_code, message, userstatuses, pagination }
}
