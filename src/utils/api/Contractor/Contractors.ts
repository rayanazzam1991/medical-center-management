import { AxiosInstance } from "axios"
import { CustomResponseSingle, CustomResponseCollection } from "../../response"
import { CreateContractor, UpdateContractor, CreateUpdateServicesHelper, ContractorSearchFilter } from "/@src/models/Contractor/contractor"



export async function addContractorApi(
  api: AxiosInstance,
  contractor: CreateContractor
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.post(`contractor`, contractor)

  return { response }
}
export async function updateContractorApi(
  api: AxiosInstance,
  contractorId: number,
  contractor: UpdateContractor
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.put(
    `contractor/${contractorId}`,
    contractor
  )

  return { response }
}

export async function addServicesApi(
  api: AxiosInstance,
  contractor_id: number,
  services: Array<CreateUpdateServicesHelper>
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.post(
    `contractor/${contractor_id}/addServices`,
    { services: services }
  )
  return { response }
}

export async function getContractorApi(
  api: AxiosInstance,
  contractor_id: number
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.get(`contractor/${contractor_id}`)

  return { response }
}

export async function getContractorsApi(
  api: AxiosInstance,
  searchFilter: ContractorSearchFilter
): Promise<{ response: CustomResponseCollection }> {
  const { data: response, headers } = await api.get('contractor/getContractorsList', {
    params: searchFilter,
  })
  return { response }
}
