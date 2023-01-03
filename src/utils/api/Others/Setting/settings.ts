import { AxiosInstance } from "axios"
import { Setting } from "/@src/models/Others/Setting/setting"
import { CustomResponseCollection, CustomResponseSingle } from "/@src/utils/response"

export async function getSettingsApi(
  api: AxiosInstance,
): Promise<{ response: CustomResponseCollection }> {
  const { data: response, headers } = await api.get('setting')
  return { response }
}
export async function editSettingsApi(
  api: AxiosInstance,
  newSettings: Setting[]
): Promise<{ response: CustomResponseCollection }> {
  const { data: response, headers } = await api.put('setting/', { settings: newSettings })
  return { response }
}
