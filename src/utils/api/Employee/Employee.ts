import { AxiosInstance } from "axios"
import { CustomResponseSingle, CustomResponseCollection } from "../../response"
import { CreateEmployee, UpdateEmployee, EmployeeSearchFilter } from "/@src/models/Employee/employee"


export async function addEmployeeApi(
  api: AxiosInstance,
  employee: CreateEmployee
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.post(`employee`, employee)
  return { response }
}
export async function updateEmployeeApi(
  api: AxiosInstance,
  employeeId: number,
  employee: UpdateEmployee
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.put(`employee/${employeeId}`, employee)
  return { response }
}
export async function getEmployeeApi(
  api: AxiosInstance,
  employee_id: number
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.get(`employee/${employee_id}`)
  return { response }
}

export async function getEmployeesApi(
  api: AxiosInstance,
  searchFilter: EmployeeSearchFilter
): Promise<{ response: CustomResponseCollection }> {
  const { data: response, headers } = await api.get('employee/getEmployeesList', {
    params: searchFilter,
  })
  return { response }
}
