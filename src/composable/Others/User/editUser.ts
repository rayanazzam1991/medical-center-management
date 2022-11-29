import { useUser } from '/@src/stores/Others/User/userStore'
import { CreateUpdateUser } from '/@src/utils/api/Others/User'

export async function editUser(userData: CreateUpdateUser) {
  const user = useUser()
  await user.editUserStore(userData)
}
