import { useUser } from '/@src/stores/Others/User/userStore'
import { User } from '/@src/utils/api/Others/User'

export async function deleteUser(userId: number) {
  const user = useUser()
  await user.deleteUserStore(userId)
}
