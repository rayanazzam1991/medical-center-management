import { useUser } from '/@src/stores/Others/User/userStore'

export async function phoneExistsCheck(phone_number: string) {
  const user = useUser()
  const result = await user.phoneExistsCheckStore(phone_number)

  return { result }
}
