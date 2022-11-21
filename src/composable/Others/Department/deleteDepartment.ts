import { useDepartment } from "/@src/stores/Others/Department/departmentStore";
import { Department } from "/@src/utils/api/Others/Department";


export async function deleteDepartment(departmentId: number) {
    const department = useDepartment()
    await department.deleteDepartmentStore(departmentId)


}