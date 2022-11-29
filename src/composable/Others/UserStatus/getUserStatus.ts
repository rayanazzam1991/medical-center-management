import { useUserStatus } from '/@src/stores/Others/UserStatus/userStatusStore'

export async function getUserStatus(userstatusId: number) {
  const userstatus = useUserStatus()
  return await userstatus.getUserStatusStore(userstatusId)
}
