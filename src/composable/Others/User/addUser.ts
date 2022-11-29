import { useUser } from '/@src/stores/Others/User/userStore'
import { CreateUpdateUser } from '/@src/utils/api/Others/User'

export async function addUser(userData: CreateUpdateUser) {
  console.log(userData)
  const user = useUser()
  return await user.addUserStore(userData)
}
