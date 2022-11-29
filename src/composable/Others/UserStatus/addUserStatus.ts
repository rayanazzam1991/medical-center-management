import { useUserStatus } from '/@src/stores/Others/UserStatus/userStatusStore'
import { UserStatus } from '/@src/utils/api/Others/UserStatus'

export async function addUserStatus(userstatusData: UserStatus) {
  const userstatus = useUserStatus()
  return await userstatus.addUserStatusStore(userstatusData)
}
