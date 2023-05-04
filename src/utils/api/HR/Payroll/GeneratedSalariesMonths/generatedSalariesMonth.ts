import { AxiosInstance } from "axios"
import { CustomResponseCollection, CustomResponseSingle } from "/@src/utils/response"

export async function getGeneratableMonthsApi(
  api: AxiosInstance,
): Promise<{ response: CustomResponseCollection }> {
  const { data: response, headers } = await api.get('generatedSalariesMonth/generatableMonths')

  return { response }
}
export async function getAllGeneratedMonthsApi(
  api: AxiosInstance,
): Promise<{ response: CustomResponseCollection }> {
  const { data: response, headers } = await api.get('generatedSalariesMonth')

  return { response }
}
