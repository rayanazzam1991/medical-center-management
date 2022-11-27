import { useDepartment } from '/@src/stores/Others/Department/departmentStore'
import { Department } from '/@src/utils/api/Others/Department'

export async function editDepartment(departmentData: Department) {
  console.log(departmentData)
  const department = useDepartment()
  await department.editDepartmentStore(departmentData)
}
