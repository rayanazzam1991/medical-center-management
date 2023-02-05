import { AxiosInstance } from "axios"
import { CreateUpdateSupplier, SupplierSearchFilter } from '/@src/models/Others/Supplier/supplier'
import { CustomResponseCollection, CustomResponseSingle } from "/@src/utils/response"


export async function addSupplierApi(
  api: AxiosInstance,
  supplier: CreateUpdateSupplier
): Promise<{ response: CustomResponseSingle }> {
  console.log(typeof (supplier.city_id))

  const { data: response, headers } = await api.post(`supplier`, supplier)
  return { response }
}
export async function editSupplierApi(
  api: AxiosInstance,
  supplier: CreateUpdateSupplier
): Promise<{ response: CustomResponseSingle }> {

  const { data: response, headers } = await api.put(`supplier/${supplier.id}`, supplier)
  return { response }
}
export async function getSupplierApi(
  api: AxiosInstance,
  supplierId: number
): Promise<{ response: CustomResponseSingle }> {

  const { data: response, headers } = await api.get(`supplier/${supplierId}`)
  return { response }
}
export async function getSuppliersApi(
  api: AxiosInstance,
  searchFilter: SupplierSearchFilter
): Promise<{ response: CustomResponseCollection }> {
  const { data: response, headers } = await api.get('supplier/getSuppliersList', {
    params: searchFilter,
  })
  return { response }
}
