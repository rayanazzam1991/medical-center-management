import { useDepartment } from '/@src/stores/Others/Department/departmentStore'
import { Department, SearchFilter } from '/@src/utils/api/Others/Department'
import { Pagination } from '/@src/utils/response'

export async function getDepartmentsList(searchFilter: SearchFilter) {
  const department = useDepartment()
  await department.getDepartmentsStore(searchFilter)

  var departments: Department[] = department.departments
  var pagination: Pagination = department.pagination
  return { departments, pagination }
}
