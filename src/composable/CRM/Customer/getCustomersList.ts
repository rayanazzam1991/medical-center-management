import { useCustomer } from "/@src/stores/CRM/Customer/customerStore"
import { Customer, CustomerSearchFilter } from "/@src/utils/api/CRM/Customer"
import { Pagination } from "/@src/utils/response"

export async function getCustomersList(searchFilter: CustomerSearchFilter) {
  const customer = useCustomer()
  await customer.getCustomersStore(searchFilter)

  var customers: Customer[] = customer.customers
  var pagination: Pagination = customer.pagination
  return { customers, pagination }
}
