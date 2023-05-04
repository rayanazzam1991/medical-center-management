import {useAuth} from "/@src/stores/Others/User/authStore";
import { SignInRequest } from "/@src/models/Others/User/auth"; 

export async function signIn(request: SignInRequest){
  const auth = useAuth();
   await auth.signInAuthStore(request)
  const user = auth.getUser()
  const success: boolean = auth.success ?? false
  const error_code: string = auth.error_code ?? ''
  const message: string = auth.message ?? ''
  return { success, error_code, message, user }

}
