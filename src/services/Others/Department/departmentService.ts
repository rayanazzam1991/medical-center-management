import { useDepartment } from '/@src/stores/Others/Department/departmentStore'
import { Department, SearchFilter } from '/@src/utils/api/Others/Department'
import { Pagination } from '/@src/utils/response'

export async function addDepartment(departmentData: Department) {
  console.log('comp')

  const department = useDepartment()
  return await department.addDepartmentStore(departmentData)
}
export async function getDepartment(departmentId: number) {
  const department = useDepartment()
  return await department.getDepartmentStore(departmentId)
}
export async function editDepartment(departmentData: Department) {
  console.log(departmentData)
  const department = useDepartment()
  await department.editDepartmentStore(departmentData)
}
export async function deleteDepartment(departmentId: number) {
  const department = useDepartment()
  await department.deleteDepartmentStore(departmentId)
}
export async function getDepartmentsList(searchFilter: SearchFilter) {
  const department = useDepartment()
  await department.getDepartmentsStore(searchFilter)

  var departments: Department[] = department.departments
  var pagination: Pagination = department.pagination
  return { departments, pagination }
}
