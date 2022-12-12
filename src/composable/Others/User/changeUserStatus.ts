import { useUser } from '/@src/stores/Others/User/userStore'
import { ChangeUserStatus } from '/@src/utils/api/Others/User'

export async function changeUserStatus(userData: ChangeUserStatus) {
  const user = useUser()
  await user.changeUserStatusStore(userData)
}
