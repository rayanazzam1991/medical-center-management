import { useEmployee } from "/@src/stores/Employee/employeeStore"

export async function deletePersonalId (picture_id : number)  {

    const employeeResponse =  useEmployee()
    await employeeResponse.deleteEmployeePersonalId(picture_id) 
    var success : boolean = employeeResponse.success ?? false
    var error_code : string = employeeResponse.error_code ?? ''
    var message : string = employeeResponse.message ?? ''
    return {success , error_code , message }

    

}