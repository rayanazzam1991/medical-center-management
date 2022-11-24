import { useDepartment } from '/@src/stores/Others/Department/departmentStore'

export async function getDepartment(departmentId: number) {
  const department = useDepartment()
  return await department.getDepartmentStore(departmentId)
}
