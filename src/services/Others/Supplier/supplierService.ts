import { useSupplier } from "/@src/stores/Others/Supplier/supplierStore";
import { Pagination } from '/@src/utils/response'
import { Supplier, SupplierSearchFilter, CreateSupplier, defaultSupplier, UpdateSupplier } from '/@src/models/Others/Supplier/supplier'


export async function addSupplier(supplierData: CreateSupplier) {
  const supplierResponse = useSupplier()
  var supplier: Supplier = await supplierResponse.addSupplierStore(supplierData) ?? defaultSupplier
  var success: boolean = supplierResponse.success ?? false
  var error_code: string = supplierResponse.error_code ?? ''
  var message: string = supplierResponse.message ?? ''
  return { success, error_code, message, supplier }

}
export async function editSupplier(supplierData: UpdateSupplier) {
  const supplierResponse = useSupplier()
  await supplierResponse.editSupplierStore(supplierData)
  var success: boolean = supplierResponse.success ?? false
  var error_code: string = supplierResponse.error_code ?? ''
  var message: string = supplierResponse.message ?? ''
  return { success, error_code, message }

}

export async function getSupplier(supplierId: number) {
  const supplierResponse = useSupplier()
  var supplier: Supplier = await supplierResponse.getSupplierStore(supplierId) ?? defaultSupplier
  var success: boolean = supplierResponse.success ?? false
  var error_code: string = supplierResponse.error_code ?? ''
  var message: string = supplierResponse.message ?? ''
  return { success, error_code, message, supplier }

}

export async function getSuppliersList(searchFilter: SupplierSearchFilter) {
  const supplierResponse = useSupplier()
  await supplierResponse.getSuppliersStore(searchFilter)
  var suppliers: Supplier[] = supplierResponse.suppliers
  var pagination: Pagination = supplierResponse.pagination
  var success: boolean = supplierResponse.success ?? false
  var error_code: string = supplierResponse.error_code ?? ''
  var message: string = supplierResponse.message ?? ''
  return { success, error_code, message, suppliers, pagination }
}
