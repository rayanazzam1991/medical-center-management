import {acceptHMRUpdate, defineStore} from "pinia";
import {signIn, SignInRequest} from "/@src/utils/api/Others/User/auth";
import {useApi} from "/@src/composable/useApi";

export const defaultSignInRequest :SignInRequest={
  phone_number: undefined,
  password: undefined
}
export const useAuth = defineStore('auth', () => {
  async function signInAuthStore(credentials: SignInRequest) {
    const api = useApi();
    try {
      const response = await signIn(api, credentials);
      return response.response.data
    } catch (e) {
      console.log("error", e)
    } finally {

    }
  }
  return {signInAuthStore} as const
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuth, import.meta.hot))
}
