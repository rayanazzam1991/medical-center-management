import { useDepartment } from "/@src/stores/Others/Department/departmentStore";
import { Department } from "/@src/utils/api/Others/Department";


export async function getDepartmentsList() {
    const department = useDepartment()
    await department.loadDepartments()
    var departments: Department[] = department.departments
    return { departments }

}