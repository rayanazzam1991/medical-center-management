import { addUser } from "../../Others/User/addUser"
import { defaultCustomer, useCustomer } from "/@src/stores/CRM/Customer/customerStore"
import {  CreateUpdateCustomerSocialMediaHelper, Customer, UpdateCustomer } from "/@src/utils/api/CRM/Customer"
import { MedicalInfo } from "/@src/utils/api/CRM/MedicalInfo"
import { CreateUpdateUser } from "/@src/utils/api/Others/User"


export async function updateCustomer(
    customer_id : number,
    customerData: UpdateCustomer ,
    userData : CreateUpdateUser ,
    medicalData : MedicalInfo,
    customerSocialMedia : Array<CreateUpdateCustomerSocialMediaHelper>
     ) {

    const newCustomerData : UpdateCustomer = {
        emergency_contact_phone: customerData.emergency_contact_phone,
        emergency_contact_name : customerData.emergency_contact_name,
        customer_group_id : customerData.customer_group_id,
        medical_info : medicalData ,
        user : userData,
        social_medias : customerSocialMedia
    }
    const customerResponse =  useCustomer()
    console.log(newCustomerData)
    var customer : Customer = await customerResponse.updateCustomerStore(customer_id ,newCustomerData) ?? defaultCustomer

    var success : boolean = customerResponse.success ?? false
    var error_code : string = customerResponse.error_code ?? ''
    var message : string = customerResponse.message ?? ''
    return {success , error_code , message , customer}
      

}