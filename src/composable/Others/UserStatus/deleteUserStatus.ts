import { useUserStatus } from '/@src/stores/Others/UserStatus/userStatusStore'
import { UserStatus } from '/@src/utils/api/Others/UserStatus'

export async function deleteUserStatus(userstatusId: number) {
  const userstatus = useUserStatus()
  await userstatus.deleteUserStatusStore(userstatusId)
}
