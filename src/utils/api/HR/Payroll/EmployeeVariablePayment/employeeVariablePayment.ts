import { AxiosInstance } from "axios"
import { CreateEmployeeVariablePayment, EmployeeVariablePaymentSearchFilter, UpdateEmployeeVariablePayment } from "/@src/models/HR/Payroll/EmployeVariablePayment/employeeVariablePayment"
import { CustomResponseCollection, CustomResponseSingle } from "/@src/utils/response"

export async function createEmployeeVariablePaymentApi(
  api: AxiosInstance,
  employeeVariablePayment: CreateEmployeeVariablePayment
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.post('employeeVariablePayment', employeeVariablePayment)

  return { response }
}
export async function updateEmployeeVariablePaymentApi(
  api: AxiosInstance,
  employeeVariablePaymentId: number,
  employeeVariablePayment: UpdateEmployeeVariablePayment
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.put(`employeeVariablePayment/${employeeVariablePaymentId}`, employeeVariablePayment)

  return { response }
}

export async function getEmployeeVariablePaymentApi(
  api: AxiosInstance,
  employeeVariablePaymentId: number
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.get(`employeeVariablePayment/${employeeVariablePaymentId}`)

  return { response }
}
export async function getEmployeeVariablePaymentsApi(
  api: AxiosInstance,
  searchFilter: EmployeeVariablePaymentSearchFilter
): Promise<{ response: CustomResponseCollection }> {
  const { data: response, headers } = await api.get('employeeVariablePayment/getEmployeeVariablePaymentsList', {
    params: searchFilter,
  })
  return { response }
}

