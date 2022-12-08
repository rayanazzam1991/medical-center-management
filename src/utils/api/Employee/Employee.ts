import type { AxiosInstance } from 'axios'
import { CustomResponseCollection, CustomResponseSingle } from '../../../response'
import { Nationality } from '../../Others/Nationality'
import { User } from '../../Others/User'

export interface Employee {
  id?: number
  starting_date: string
  end_date: string
  basic_salary: number
  user: User
  nationality: Nationality
}
export interface CreateUpdateEmployee {
  id?: number
  starting_date?: string
  end_date?: string
  user_id: number
  basic_salary: number
  nationality_id?: number
}
export interface EmployeeSearchFilter {
  name?: string
  phone_number?: number
  status?: number
  page?: number
  per_page?: number
  order_by?: string
  order?: string
}

export async function addEmployeeApi(
  api: AxiosInstance,
  employee: CreateUpdateEmployee
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.post(`employee/`, employee)

  return { response }
}
export async function editEmployeeApi(
  api: AxiosInstance,
  employee: CreateUpdateEmployee
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.put(`employee/${employee.id}`, employee)
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
