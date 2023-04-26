import { AxiosInstance } from "axios"
import { CustomResponseCollection, CustomResponseSingle } from "/@src/utils/response"

export async function getDaysPerMonthApi(
  api: AxiosInstance,
  year: number
): Promise<{ response: CustomResponseCollection }> {
  const { data: response, headers } = await api.post(`date/getDaysPerMonth`, { "year": year })

  return { response }
}
export async function getDaysNamePerMonthApi(
  api: AxiosInstance,
  year: number,
  month: number

): Promise<{ response: CustomResponseCollection }> {
  const { data: response, headers } = await api.post(`date/getDaysNamePerMonth`, { "year": year, "month": month })

  return { response }
}
export async function getCurrentWeekStartAndEndApi(
  api: AxiosInstance,
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.get(`date/getCurrentWeekStartAndEnd`)

  return { response }
}
