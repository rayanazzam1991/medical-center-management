import { useCustomerGroup } from "/@src/stores/Others/CustomerGroup/customerGroupStore"
import { CustomerGroup } from "/@src/utils/api/Others/CustomerGroup"

export async function editCustomerGroup  (customerGroupData : CustomerGroup)  {
    const customerGroup =  useCustomerGroup()
    await customerGroup.editCustomerGroupStore(customerGroupData)
    

}