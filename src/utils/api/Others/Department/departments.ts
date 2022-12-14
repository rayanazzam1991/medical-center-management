import { AxiosInstance } from "axios"
import { Department, DepartmentSearchFilter } from "/@src/models/Others/Department/department"
import { CustomResponseCollection, CustomResponseSingle } from "/@src/utils/response"

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

  const { data: response, headers } = await api.post(`department`, department)

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
  searchFilter: DepartmentSearchFilter
): Promise<{ response: CustomResponseCollection }> {
  const { data: response, headers } = await api.get('department/getDepartmentsList', {
    params: searchFilter,
  })
  return { response }
}
