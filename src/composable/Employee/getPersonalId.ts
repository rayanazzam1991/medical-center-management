import { useEmployee, defaultEmployeePersonalId } from "/@src/stores/Employee/employeeStore"
import { Media } from "/@src/utils/api/Others/Media"
import { MediaConsts } from "/@src/utils/consts/media"


export async function getPersonalId (employee_id : number)  {

    const employeeResponse =  useEmployee()
    var mediaParams = defaultEmployeePersonalId
    mediaParams.is_featured = '1' 
    mediaParams.model_id = employee_id
    var media : Media[] = await employeeResponse.getEmployeePersonalId(mediaParams) ?? []
    media.forEach(element => {
        element.relative_path= MediaConsts.MEDIA_BASE_URL + element.relative_path
    });
    var success : boolean = employeeResponse.success ?? false
    var error_code : string = employeeResponse.error_code ?? ''
    var message : string = employeeResponse.message ?? ''
    return {success , error_code , message , media}

    

}