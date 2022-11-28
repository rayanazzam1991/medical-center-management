import { useCustomerGroup } from "/@src/stores/Others/CustomerGroup/customerGroupStore"


export async function getCustomerGroup  (customerGroupId : number)  {
    const customerGroup =  useCustomerGroup()
    return await customerGroup.getCustomerGroupStore(customerGroupId)
    

}