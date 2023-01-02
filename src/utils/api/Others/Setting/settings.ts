import { AxiosInstance } from "axios"
import { CustomResponseCollection, CustomResponseSingle } from "/@src/utils/response"

export async function getSettingsApi(
  api: AxiosInstance,
): Promise<{ response: CustomResponseCollection }> {
  const { data: response, headers } = await api.get('setting')
  return { response }
}
