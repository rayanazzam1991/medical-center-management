import type { AxiosInstance } from 'axios'
import { CustomResponseCollection, CustomResponseSingle } from '../../../response'
import { CustomerGroup } from '../../Others/CustomerGroup'
import { CreateUpdateUser, User } from '../../Others/User'
import { MedicalInfo } from '../MedicalInfo'
import { SocialMedia } from '../SocialMedia'


export interface Customer {
  id?: number
  emergency_contact_name: string
  emergency_contact_phone: string
  user: User
  medical_info: MedicalInfo
  customer_group: CustomerGroup
  social_medias: Array<CreateUpdateCustomerSocialMediaHelper>,
  is_completed? : boolean
}
export interface CreateCustomer {
  id?: number
  emergency_contact_name?: string
  emergency_contact_phone?: string
  user: CreateUpdateUser
  medical_info_id?: number
  customer_group_id?: number
  social_medias: Array<CreateUpdateCustomerSocialMediaHelper>,
  is_completed? : boolean

}
export interface UpdateCustomer {
  id?: number
  emergency_contact_name?: string
  emergency_contact_phone?: string
  user: CreateUpdateUser
  medical_info: MedicalInfo
  customer_group_id?: number
  social_medias: Array<CreateUpdateCustomerSocialMediaHelper>,
  is_completed? : boolean

}
export interface CreateUpdateCustomerSocialMediaHelper {
  social_media_id: number
  url: string
}
export interface CustomerSearchFilter {
  name? : string
  phone_number? : number
  gender? : string
  date_between? : string 
  from? : string
  to? : string 
  city_id? : number
  customer_group_id? : number
  is_completed? : boolean
  user_status_id?: number
  page? : number
  per_page? : number
  order_by? : string
  order? : string
}

export async function addCustomerApi(
  api: AxiosInstance,
  customer: CreateCustomer
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.post(`customer/`, customer)

  return { response }
}
export async function updateCustomerApi(
  api: AxiosInstance,
  customerId : number,
  customer: UpdateCustomer
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.put(`customer/${customerId}`, customer)
  console.log(response);
  

  return { response }
}
export async function addMedicalInfoApi(
  api: AxiosInstance,
  customer_id : number,
  medical_info: MedicalInfo,
  
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.post(`customer/${customer_id}/addMedicalInfo`, medical_info)

  return { response }
}
export async function addSocialMediaApi(
  api: AxiosInstance,
  customer_id : number,
  social_medias: Array<CreateUpdateCustomerSocialMediaHelper>,
  
): Promise<{ response: CustomResponseSingle}> {
  const { data: response, headers } = await api.post(`customer/${customer_id}/addSocialMedia`,{ social_medias :social_medias} )
  console.log(response)
  return { response }
}

export async function getCustomerApi(
  api: AxiosInstance,
  customer_id : number,
  
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.get(`customer/${customer_id}`)

  return { response }
}

export async function getCustomersApi(
  api: AxiosInstance,
  searchFilter : CustomerSearchFilter
  ): Promise<{ response: CustomResponseCollection;  }> {

  const { data: response , headers  } = await api.get(
    'customer/getCustomersList', { params: searchFilter }
  )
  return { response }
}


// export async function editCustomerApi(
//   api: AxiosInstance,
//   customer: CreateUpdateCustomer
// ): Promise<{ response: CustomResponseSingle }> {
//   const { data: response, headers } = await api.put(`customer/${customer.id}`, customer)
//   return { response }
// }
