import { useCustomerGroup } from "/@src/stores/Others/CustomerGroup/customerGroupStore"
import { CustomerGroupSearchFilter, CustomerGroup } from "/@src/utils/api/Others/CustomerGroup"
import { Pagination } from "/@src/utils/response"


export async function getCustomerGroupsList  (searchFilter : CustomerGroupSearchFilter)  {
    const customerGroup =  useCustomerGroup()
    await customerGroup.getCustomerGroupsStore(searchFilter)
    
    var customerGroups : CustomerGroup[] = customerGroup.customerGroups
    var pagination : Pagination = customerGroup.pagination
    return { customerGroups , pagination }

}