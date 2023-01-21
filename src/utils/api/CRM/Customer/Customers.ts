import { AxiosInstance } from "axios"
import { CreateCustomer, UpdateCustomer, CreateUpdateCustomerSocialMediaHelper, CustomerSearchFilter, UpdateNotes } from "/@src/models/CRM/Customer/customer"
import { MedicalInfo } from "/@src/models/CRM/MedicalInfo/medicalInfo"
import { CustomResponseSingle, CustomResponseCollection } from "/@src/utils/response"


export async function addCustomerApi(
  api: AxiosInstance,
  customer: CreateCustomer
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.post(`customer`, customer)
  return { response }
}
export async function updateCustomerApi(
  api: AxiosInstance,
  customerId: number,
  customer: UpdateCustomer
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.put(`customer/${customerId}`, customer)

  return { response }
}
export async function addMedicalInfoApi(
  api: AxiosInstance,
  customer_id: number,
  medical_info: MedicalInfo
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.post(
    `customer/${customer_id}/addMedicalInfo`,
    medical_info
  )

  return { response }
}
export async function addSocialMediaApi(
  api: AxiosInstance,
  customer_id: number,
  social_medias: Array<CreateUpdateCustomerSocialMediaHelper>
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.post(
    `customer/${customer_id}/addSocialMedia`,
    { social_medias: social_medias }
  )
  return { response }
}

export async function getCustomerApi(
  api: AxiosInstance,
  customer_id: number
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.get(`customer/${customer_id}`)
  return { response }
}

export async function getCustomersApi(
  api: AxiosInstance,
  searchFilter: CustomerSearchFilter
): Promise<{ response: CustomResponseCollection }> {
  const { data: response, headers } = await api.get('customer/getCustomersList', {
    params: searchFilter,
  })
  return { response }
}
export async function UpdateNotesApi(
  api: AxiosInstance,
  customer_id: number,
  notes: UpdateNotes
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.post(`customer/${customer_id}/updateNotes`, notes)
  return { response }
}

// export async function editCustomerApi(
//   api: AxiosInstance,
//   customer: CreateUpdateCustomer
// ): Promise<{ response: CustomResponseSingle }> {
//   const { data: response, headers } = await api.put(`customer/${customer.id}`, customer)
//   return { response }
// }
