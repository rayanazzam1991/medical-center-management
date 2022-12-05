import {useAuth} from "/@src/stores/Others/User/authStore";
import {SignInRequest} from "/@src/utils/api/Others/User/auth";

export async function signIn(request: SignInRequest){
  const auth = useAuth();
  return await auth.signInAuthStore(request)
}
