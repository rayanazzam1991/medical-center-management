import { CustomResponseCollection, CustomResponseSingle } from "/@src/utils/response";
import { AxiosInstance } from "axios";
import { ChangePassword, SignInRequest } from "/@src/models/Others/User/auth";

export async function signIn(
  api: AxiosInstance,
  credentials: SignInRequest
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.post('auth/signIn', credentials);
  return { response }
}
export async function resetPasswordApi(
  api: AxiosInstance,
  user_id: number
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.post('auth/resetPassword', { user_id: user_id });
  return { response }
}
export async function ChangePasswordApi(
  api: AxiosInstance,
  change_password_data: ChangePassword
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.post('auth/changePassword', change_password_data);
  return { response }
}
