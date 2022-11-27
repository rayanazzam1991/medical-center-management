import type { AxiosInstance } from 'axios'
import { CustomResponseCollection, CustomResponseSingle } from '../../../response'

export interface Department {
  id?: number
  name: string
  status: number
}
export interface SearchFilter {
  name?: string
  status?: number
  page?: number
  order_by?: string
  order?: string
}

export async function deleteDepartmentApi(
  api: AxiosInstance,
  departmentId: number
): Promise<{ response: CustomResponseCollection }> {
  const { data: response, headers } = await api.delete(`department/${departmentId}`)

  return { response }
}
export async function addDepartmentApi(
  api: AxiosInstance,
  department: Department
): Promise<{ response: CustomResponseSingle }> {
  console.log('api', department)

  const { data: response, headers } = await api.post(`department/`, department)

  return { response }
}
export async function editDepartmentApi(
  api: AxiosInstance,
  department: Department
): Promise<{ response: CustomResponseSingle }> {
  console.log('api', department)
  console.log(typeof department.id)
  const { data: response, headers } = await api.put(
    `department/${department.id}`,
    department
  )
  console.log(response)
  return { response }
}
export async function getDepartmentApi(
  api: AxiosInstance,
  departmentId: number
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.get(`department/${departmentId}`)

  return { response }
}
export async function getDepartmentsApi(
  api: AxiosInstance,
  searchFilter: SearchFilter
): Promise<{ response: CustomResponseCollection }> {
  const { data: response, headers } = await api.get('department/getDepartmentsList', {
    params: searchFilter,
  })
  console.log('lal', response)
  return { response }
}
