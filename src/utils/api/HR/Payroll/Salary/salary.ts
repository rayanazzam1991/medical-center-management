import { AxiosInstance } from "axios"
import { DeliveringSalariesSearchFilter, OnholdSalariesSearchFilter, ReviewGenerateSalariesRequestBody, SalarySearchFilter } from "/@src/models/HR/Payroll/Salary/salary"
import { CustomResponseCollection, CustomResponseSingle } from "/@src/utils/response"

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
export async function getDeliveringSalariesApi(
  api: AxiosInstance,
  filter: DeliveringSalariesSearchFilter
): Promise<{ response: CustomResponseCollection }> {
  const { data: response, headers } = await api.get('salary/getDeliveringSalaries', { params: filter })
  return { response }
}
export async function getOnholdSalariesApi(
  api: AxiosInstance,
  filter: OnholdSalariesSearchFilter
): Promise<{ response: CustomResponseCollection }> {
  const { data: response, headers } = await api.get('salary/getOnholdSalaries', { params: filter })
  return { response }
}
export async function getSalariesListApi(
  api: AxiosInstance,
  selectedMonth: ReviewGenerateSalariesRequestBody,
  filter: SalarySearchFilter
): Promise<{ response: CustomResponseCollection }> {
  const { data: response, headers } = await api.get('salary/getSalariesList', { params: Object.assign(filter, selectedMonth) })
  return { response }
}
export async function paySalaryApi(
  api: AxiosInstance,
  salaryId: number
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.put(`salary/paySalary/${salaryId}`)
  return { response }
}
export async function returnSalaryApi(
  api: AxiosInstance,
  salaryId: number
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.put(`salary/returnSalary/${salaryId}`)
  return { response }
}
export async function moveSalariesToOnholdApi(
  api: AxiosInstance
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.post(`salary/moveSalariesToOnhold`)
  return { response }
}
export async function getSalaryPayslipApi(
  api: AxiosInstance,
  salaryId: number
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.get(`salary/${salaryId}`)
  return { response }
}
