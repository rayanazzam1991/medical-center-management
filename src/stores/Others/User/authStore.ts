import {acceptHMRUpdate, defineStore} from "pinia";
import {signIn, SignInRequest} from "/@src/utils/api/Others/User/auth";
import {useApi} from "/@src/composable/useApi";
import {User} from "/@src/utils/api/Others/User";

export const defaultSignInRequest: SignInRequest = {
  phone_number: undefined,
  password: undefined
}
export const useAuth = defineStore('userAuth', () => {

  const api = useApi();
  const token = useStorage('token', '')
  const user = ref<Partial<User>>()
  const loading = ref(true)

  const isLoggedIn = computed(() => token.value !== undefined && token.value !== '')

  function setUser(newUser: Partial<User>) {
    user.value = newUser
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
    setToken(token.value)
  }

  async function signInAuthStore(credentials: SignInRequest) {

    try {
      // await logoutUser();
      const response = await signIn(api, credentials);
      // @ts-ignore
      token.value = response?.response?.data?.token;
      setToken(token.value)
      return response.response.data
    } catch (e : any) {
      throw e
    } finally {

    }
  }

  return {signInAuthStore,setUser, setToken, setLoading, logoutUser, user,token,isLoggedIn} as const
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuth, import.meta.hot))
}
