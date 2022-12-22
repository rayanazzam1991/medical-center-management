import { useDepartment } from '/@src/stores/Others/Department/departmentStore'
import { defaultDepartment, Department, DepartmentSearchFilter } from '/@src/models/Others/Department/department'
import { Pagination } from '/@src/utils/response'

export async function addDepartment(departmentData: Department) {
  const departmentResponse = useDepartment()
  var department: Department = await departmentResponse.addDepartmentStore(departmentData) ?? defaultDepartment
  var success: boolean = departmentResponse.success ?? false
  var error_code: string = departmentResponse.error_code ?? ''
  var message: string = departmentResponse.message ?? ''
  return { success, error_code, message, department }
}
export async function getDepartment(departmentId: number) {
  const departmentResponse = useDepartment()
  var department: Department = await departmentResponse.getDepartmentStore(departmentId) ?? defaultDepartment
  var success: boolean = departmentResponse.success ?? false
  var error_code: string = departmentResponse.error_code ?? ''
  var message: string = departmentResponse.message ?? ''
  return { success, error_code, message, department }

}
export async function editDepartment(departmentData: Department) {
  const departmentResponse = useDepartment()
  await departmentResponse.editDepartmentStore(departmentData)
  var success: boolean = departmentResponse.success ?? false
  var error_code: string = departmentResponse.error_code ?? ''
  var message: string = departmentResponse.message ?? ''
  return { success, error_code, message }

}
export async function deleteDepartment(departmentId: number) {
  const departmentResponse = useDepartment()
  await departmentResponse.deleteDepartmentStore(departmentId)
  var success: boolean = departmentResponse.success ?? false
  var error_code: string = departmentResponse.error_code ?? ''
  var message: string = departmentResponse.message ?? ''
  return { success, error_code, message }


}
export async function getDepartmentsList(searchFilter: DepartmentSearchFilter) {
  const departmentResponse = useDepartment()
  await departmentResponse.getDepartmentsStore(searchFilter)
  var success: boolean = departmentResponse.success ?? false
  var departments: Department[] = departmentResponse.departments
  var pagination: Pagination = departmentResponse.pagination

  var error_code: string = departmentResponse.error_code ?? ''
  var message: string = departmentResponse.message ?? ''
  return { success, error_code, message, departments, pagination }
}
