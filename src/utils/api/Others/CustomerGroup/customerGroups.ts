import { AxiosInstance } from "axios"
import { CustomerGroup, CustomerGroupSearchFilter } from "/@src/models/Others/CustomerGroup/customerGroup"
import { CustomResponseCollection, CustomResponseSingle } from "/@src/utils/response"


export async function deleteCustomerGroupApi(
  api: AxiosInstance,
  customerGroupId: number
): Promise<{ response: CustomResponseCollection }> {
  const { data: response, headers } = await api.delete(`customerGroup/${customerGroupId}`)

  return { response }
}
export async function addCustomerGroupApi(
  api: AxiosInstance,
  customerGroup: CustomerGroup
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.post(`customerGroup`, customerGroup)

  return { response }
}
export async function editCustomerGroupApi(
  api: AxiosInstance,
  customerGroup: CustomerGroup
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.put(
    `customerGroup/${customerGroup.id}`,
    customerGroup
  )
  return { response }
}
export async function getCustomerGroupApi(
  api: AxiosInstance,
  customerGroupId: number
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.get(`customerGroup/${customerGroupId}`)

  return { response }
}
export async function getCustomerGroupsApi(
  api: AxiosInstance,
  searchFilter: CustomerGroupSearchFilter
): Promise<{ response: CustomResponseCollection }> {
  const { data: response, headers } = await api.get(
    'customerGroup/getCustomerGroupsList',
    { params: searchFilter }
  )
  return { response }
}
