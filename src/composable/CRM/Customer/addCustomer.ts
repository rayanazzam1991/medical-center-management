import { addUser } from '../../Others/User/addUser'
import { defaultCustomer, useCustomer } from '/@src/stores/CRM/Customer/customerStore'
import {
  CreateCustomer,
  CreateUpdateCustomerSocialMediaHelper,
  Customer,
} from '/@src/utils/api/CRM/Customer'
import { MedicalInfo } from '/@src/utils/api/CRM/MedicalInfo'
import { CreateUpdateUser } from '/@src/utils/api/Others/User'

export async function addCustomer(
  customerData: CreateCustomer,
  userData: CreateUpdateUser
) {
  userData.password = '1231313'

  const newCustomerData: CreateCustomer = {
    emergency_contact_phone: customerData.emergency_contact_phone,
    emergency_contact_name: customerData.emergency_contact_name,
    customer_group_id: customerData.customer_group_id,
    medical_info_id: undefined,
    user: userData,
    social_medias: [],
  }
  const customerResponse = useCustomer()

  var customer: Customer =
    (await customerResponse.addCustomerStore(newCustomerData)) ?? defaultCustomer

  var success: boolean = customerResponse.success ?? false
  var error_code: string = customerResponse.error_code ?? ''
  var message: string = customerResponse.message ?? ''
  return { success, error_code, message, customer }
}
