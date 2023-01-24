import { AxiosInstance } from "axios"
import { ReviewGenerateSalariesRequestBody } from "/@src/models/HR/Payroll/Salary/salary"
import { CustomResponseSingle } from "/@src/utils/response"

export async function reviewSalariesApi(
  api: AxiosInstance,
  reviewGenerateSalariesRequestBody: ReviewGenerateSalariesRequestBody
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.post('salary/reviewSalaries', reviewGenerateSalariesRequestBody)
  return { response }
}
export async function generateSalariesApi(
  api: AxiosInstance,
  reviewGenerateSalariesRequestBody: ReviewGenerateSalariesRequestBody
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.post('salary/generateSalaries', reviewGenerateSalariesRequestBody)
  return { response }
}
