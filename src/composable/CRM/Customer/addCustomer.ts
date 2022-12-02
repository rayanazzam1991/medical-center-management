import { addUser } from "../../Others/User/addUser"
import { addMedicalInfo } from "../MedicalInfo/addMedicalInfo"
import { useCustomer } from "/@src/stores/CRM/Customer/customerStore"
import { CreateUpdateCustomer, CreateUpdateCustomerSocialMediaHelper } from "/@src/utils/api/CRM/Customer"
import { MedicalInfo } from "/@src/utils/api/CRM/MedicalInfo"
import { CreateUpdateUser } from "/@src/utils/api/Others/User"


export async function addCustomer(
    customerData: CreateUpdateCustomer ,
    userData : CreateUpdateUser ,
    medicalInfoData : MedicalInfo ,
    customerSocialMediaData : Array<CreateUpdateCustomerSocialMediaHelper> ) {
    userData.password = '1231313'

    const userRespone = await addUser(userData)

    const medicalInfoResponse = await addMedicalInfo(medicalInfoData)
    const newCustomerData : CreateUpdateCustomer = {
        emergency_contact_phone: customerData.emergency_contact_phone,
        emergency_contact_name : customerData.emergency_contact_name,
        customer_group_id : customerData.customer_group_id,
        medical_info_id : medicalInfoResponse?.id ?? 0 ,
        user_id : userRespone?.id ?? 0,
        social_medias : customerSocialMediaData
    }
    const customer = useCustomer()
    return await customer.addCustomerStore(newCustomerData)
      

}