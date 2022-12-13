import { useEmployee } from "/@src/stores/Employee/employeeStore"
import { Media } from "/@src/utils/api/Others/Media"
import { MediaConsts } from "/@src/utils/consts/media"


export async function addPersonalId (employee_id : unknown,fd : FormData)  {

    const employeeResponse =  useEmployee()
    const is_featured : unknown = true
    fd.append('model_id', employee_id as string)
    fd.append('model_type', MediaConsts.EMPLOYEE_MODEL_ROUTE)
    fd.append('is_featured', String(is_featured))
    var media : Media[] = await employeeResponse.addEmployeePersonalId(fd) ?? []
    var success : boolean = employeeResponse.success ?? false
    var error_code : string = employeeResponse.error_code ?? ''
    var message : string = employeeResponse.message ?? ''
    return {success , error_code , message , media}

    

}