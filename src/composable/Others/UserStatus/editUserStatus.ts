import { useUserStatus } from '/@src/stores/Others/UserStatus/userStatusStore'
import { UserStatus } from '/@src/utils/api/Others/UserStatus'

export async function editUserStatus(userstatusData: UserStatus) {
  const userstatus = useUserStatus()
  await userstatus.editUserStatusStore(userstatusData)
}
