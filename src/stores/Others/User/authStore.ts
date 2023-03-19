import { defineStore, acceptHMRUpdate } from "pinia";
import { useApi } from "/@src/composable/useApi";
import { ChangePassword, SignInRequest } from "/@src/models/Others/User/auth";
import { User } from "/@src/models/Others/User/user";
import { ChangePasswordApi, resetPasswordApi, signIn } from "/@src/utils/api/Others/User/auth";

export const useAuth = defineStore('userAuth', () => {

  const api = useApi();
  const token = useStorage('token', '')
  const user = ref<User>()
  const loggedUser = useStorage('user', '')
  const userFullName = useStorage('userFullName', '')
  const loading = ref(false)
  const success = ref<boolean>()
  const error_code = ref<string>()
  const message = ref<string>()

  const isLoggedIn = computed(() => token.value !== undefined && token.value !== '')

  function setUser(newUser: User) {
    user.value = newUser
    loggedUser.value = JSON.stringify(newUser)
    userFullName.value = newUser?.first_name + " " + newUser?.last_name
  }

  function getUser(): User {
    return JSON.parse(loggedUser.value) as User;
  }
  function setToken(newToken: string) {
    token.value = newToken
  }

  function setLoading(newLoading: boolean) {
    loading.value = newLoading
  }

  async function logoutUser() {
    token.value = undefined
    user.value = undefined
  }
  function getUserFulLName(): string {
    return userFullName.value;
  }

  async function signInAuthStore(credentials: SignInRequest) {

    try {
      const response = await signIn(api, credentials);

      token.value = response?.response?.data?.token as string;
      user.value = response?.response?.data as User;

      setToken(token.value)
      setUser(user.value)

      return response.response.data
    } catch (e: any) {
      throw e
    } finally {

    }
  }
  async function resetPasswordStore(user_id: number) {
    if (loading.value) return
    loading.value = true
    try {
      const response = await resetPasswordApi(api, user_id)
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message

      return
    }
    catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message

    }
    finally {
      loading.value = false
    }
  }
  async function changePasswordStore(change_password_data: ChangePassword) {
    if (loading.value) return
    loading.value = true
    try {
      const response = await ChangePasswordApi(api, change_password_data)
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message

      return
    }
    catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.messageu

    }
    finally {
      loading.value = false
    }
  }

  return { signInAuthStore, resetPasswordStore, setUser, setToken, setLoading, logoutUser, getUser, getUserFulLName, changePasswordStore, user, loading, loggedUser, token, isLoggedIn, success, error_code, message } as const
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuth, import.meta.hot))
}
