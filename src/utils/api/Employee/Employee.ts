import type { AxiosInstance } from 'axios'
import { CustomResponseCollection, CustomResponseSingle } from '../../response'
import { Nationality } from '../Others/Nationality'
import { CreateUpdateUser, User } from '../Others/User'

export interface Employee {
  id?: number
  starting_date: string
  end_date: string
  basic_salary: number
  user: User
  nationality: Nationality
}
export interface CreateEmployee {
  id?: number
  starting_date?: string
  end_date?: string
  user: CreateUpdateUser
  basic_salary?: number
  nationality_id?: number
}
export interface UpdateEmployee {
  id?: number
  starting_date?: string
  end_date?: string
  user: CreateUpdateUser
  basic_salary?: number
  nationality_id?: number
}
export interface EmployeeSearchFilter {
  name?: string
  phone_number?: number
  gender?: string
  date_between?: string
  from?: string
  to?: string
  city_id?: number
  nationality_id?: number
  user_status_id?: number
  page?: number
  per_page?: number
  order_by?: string
  order?: string
}

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
