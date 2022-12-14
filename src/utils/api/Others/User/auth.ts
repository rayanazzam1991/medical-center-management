import {CustomResponseCollection} from "/@src/utils/response";
import {AxiosInstance} from "axios";

export interface SignInRequest {
  phone_number?: string,
  password?: string
}

export async function signIn(
  api: AxiosInstance,
  credentials: SignInRequest
): Promise<{ response: CustomResponseCollection }> {
  const {data: response, headers} = await api.post('auth/signIn', credentials);
  return {response}
}
