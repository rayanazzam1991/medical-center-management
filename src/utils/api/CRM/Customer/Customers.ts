import type { AxiosInstance } from 'axios'
import { CustomResponseCollection, CustomResponseSingle } from '../../../response'
import { CustomerGroup } from '../../Others/CustomerGroup'
import { User } from '../../Others/User'
import { MedicalInfo } from '../MedicalInfo'
import { SocialMedia } from '../SocialMedia'


export interface Customer {
  id?: number
  emergency_contact_name: string
  emergency_contact_phone: string
  user: User
  medical_info: MedicalInfo
  customer_group: CustomerGroup
  social_medias: Array<SocialMedia>
}
export interface CreateUpdateCustomer {
  id?: number
  emergency_contact_name?: string
  emergency_contact_phone?: string
  user_id: number
  medical_info_id: number
  customer_group_id?: number
  social_medias: Array<CreateUpdateCustomerSocialMediaHelper>
}
export interface CreateUpdateCustomerSocialMediaHelper {
  social_media_id: number
  url: string
}

export async function addCustomerApi(
  api: AxiosInstance,
  customer: CreateUpdateCustomer
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.post(`customer/`, customer)

  return { response }
}
export async function editCustomerApi(
  api: AxiosInstance,
  customer: CreateUpdateCustomer
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.put(`customer/${customer.id}`, customer)
  return { response }
}
