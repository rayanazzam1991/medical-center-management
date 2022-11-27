import { useDepartment } from '/@src/stores/Others/Department/departmentStore'
import { Department } from '/@src/utils/api/Others/Department'

export async function addDepartment(departmentData: Department) {
  console.log('comp')

  const department = useDepartment()
  return await department.addDepartmentStore(departmentData)
}
