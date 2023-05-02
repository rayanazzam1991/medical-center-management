import { AxiosInstance } from "axios"
import { CreateVariablePayment, UpdateVariablePayment, VariablePayment, VariablePaymentSearchFilter } from "/@src/models/HR/Payroll/VariablePayment/variablePayment"
import { CustomResponseCollection, CustomResponseSingle } from "/@src/utils/response"

export async function createVariablePaymentApi(
  api: AxiosInstance,
  variablePayment: CreateVariablePayment
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.post('variablePayment', variablePayment)

  return { response }
}
export async function updateVariablePaymentApi(
  api: AxiosInstance,
  variablePaymentId: number,
  variablePayment: UpdateVariablePayment
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.put(`variablePayment/${variablePaymentId}`, variablePayment)

  return { response }
}

export async function getVariablePaymentApi(
  api: AxiosInstance,
  variablePaymentId: number
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.get(`variablePayment/${variablePaymentId}`)

  return { response }
}
export async function getVariablePaymentsApi(
  api: AxiosInstance,
  searchFilter: VariablePaymentSearchFilter
): Promise<{ response: CustomResponseCollection }> {
  const { data: response, headers } = await api.get('variablePayment/getVariablePaymentsList', {
    params: searchFilter,
  })
  return { response }
}

