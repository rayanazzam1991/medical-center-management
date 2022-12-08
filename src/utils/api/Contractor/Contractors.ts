import type { AxiosInstance } from 'axios'
import { CustomResponseSingle, CustomResponseCollection } from '../../response'
import { User, CreateUpdateUser } from '../Others/User'


export interface Contractor {
  id?: number
  starting_date: string
  payment_percentage: number
  user: User
  services: Array<CreateUpdateServicesHelper>
  is_completed? : boolean
}
export interface CreateContractor {
  id?: number
  starting_date?: string
  payment_percentage?: number
  user: CreateUpdateUser
  services: Array<CreateUpdateServicesHelper>
  is_completed? : boolean

}
export interface UpdateContractor {
  id?: number
  starting_date?: string
  payment_percentage?: number
  user: CreateUpdateUser
  services: Array<CreateUpdateServicesHelper>
  is_completed? : boolean

}
export interface CreateUpdateServicesHelper {
  service_id: number
  price: number
  contractor_service_amount : number
}
export interface ContractorSearchFilter {
  name? : string
  phone_number? : number
  gender? : string
  date_between? : string 
  from? : string
  to? : string 
  room_id? : number
  is_completed? : boolean
  user_status_id?: number
  page? : number
  per_page? : number
  order_by? : string
  order? : string
}

export async function addContractorApi(
  api: AxiosInstance,
  contractor: CreateContractor
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.post(`contractor/`, contractor)

  return { response }
}
export async function updateContractorApi(
  api: AxiosInstance,
  contractorId : number,
  contractor: UpdateContractor
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.put(`contractor/${contractorId}`, contractor)
  

  return { response }
}

export async function addServicesApi(
  api: AxiosInstance,
  contractor_id : number,
  services: Array<CreateUpdateServicesHelper>,
  
): Promise<{ response: CustomResponseSingle}> {
  const { data: response, headers } = await api.post(`contractor/${contractor_id}/addServices`,{ services :services} )
  return { response }
}

export async function getContractorApi(
  api: AxiosInstance,
  contractor_id : number,
  
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.get(`contractor/${contractor_id}`)

  return { response }
}

export async function getContractorsApi(
  api: AxiosInstance,
  searchFilter : ContractorSearchFilter
  ): Promise<{ response: CustomResponseCollection;  }> {

  const { data: response , headers  } = await api.get(
    'contractor/getContractorsList', { params: searchFilter }
  )
  return { response }
}

