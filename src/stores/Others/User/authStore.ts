import { defineStore, acceptHMRUpdate } from "pinia";
import { useApi } from "/@src/composable/useApi";
import { SignInRequest } from "/@src/models/Others/User/auth";
import { User } from "/@src/models/Others/User/user";
import { signIn } from "/@src/utils/api/Others/User/auth";

export const useAuth = defineStore('userAuth', () => {

  const api = useApi();
  const token = useStorage('token', '')
  const user = ref<Partial<User>>()
  const userFullName = useStorage('userFullName', '')
  const loading = ref(true)

  const isLoggedIn = computed(() => token.value !== undefined && token.value !== '')

  function setUser(newUser: Partial<User>) {
    user.value = newUser
    userFullName.value = newUser?.first_name + " " + newUser?.last_name
  }

  function getUser(): Partial<User> {
    return user.value as User;
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
      // await logoutUser();
      const response = await signIn(api, credentials);

      // @ts-ignore
      token.value = response?.response?.data?.token as string;
      // @ts-ignore
      user.value = response?.response?.data as User;

      setToken(token.value)
      setUser(user.value)

      return response.response.data
    } catch (e: any) {
      throw e
    } finally {

    }
  }

  return { signInAuthStore, setUser, setToken, setLoading, logoutUser, getUser, getUserFulLName, user, token, isLoggedIn } as const
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuth, import.meta.hot))
}
