import { defaultCustomer, useCustomer } from "/@src/stores/CRM/Customer/customerStore"
import { Customer } from "/@src/utils/api/CRM/Customer"
import { MedicalInfo } from "/@src/utils/api/CRM/MedicalInfo"


export async function addMedicalInfo (customer_id : number,medicalInfoData : MedicalInfo)  {

    const customerResponse =  useCustomer()

    var customer : Customer = await customerResponse.addMedicalInfoStore(customer_id,medicalInfoData) ?? defaultCustomer

    var success : boolean = customerResponse.success ?? false
    var error_code : string = customerResponse.error_code ?? ''
    var message : string = customerResponse.message ?? ''
    return {success , error_code , message , customer}

    

}