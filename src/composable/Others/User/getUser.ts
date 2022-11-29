import { useUser } from '/@src/stores/Others/User/userStore'

export async function getUser(userId: number) {
  const user = useUser()
  return await user.getUserStore(userId)
}
