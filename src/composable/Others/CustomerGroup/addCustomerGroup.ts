import { useCustomerGroup } from "/@src/stores/Others/CustomerGroup/customerGroupStore"
import { CustomerGroup } from "/@src/utils/api/Others/CustomerGroup"


export async function addCustomerGroup  (customerGroupData : CustomerGroup)  {

    const customerGroup =  useCustomerGroup()
    return await customerGroup.addCustomerGroupStore(customerGroupData)
    
    

}