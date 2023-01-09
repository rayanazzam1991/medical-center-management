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
  console.log(year, month  )
  const { data: response, headers } = await api.post(`date/getDaysNamePerMonth`, { "year": year, "month": month })

  return { response }
}
