import {CustomResponseCollection} from "/@src/utils/response";
import {AxiosInstance} from "axios";
import { SignInRequest } from "/@src/models/Others/User/auth";

export async function signIn(
  api: AxiosInstance,
  credentials: SignInRequest
): Promise<{ response: CustomResponseCollection }> {
  const {data: response, headers} = await api.post('auth/signIn', credentials);
  return {response}
}
