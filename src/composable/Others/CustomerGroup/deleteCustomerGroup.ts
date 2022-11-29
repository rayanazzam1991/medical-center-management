import { useCustomerGroup } from "/@src/stores/Others/CustomerGroup/customerGroupStore"


export async function deleteCustomerGroup  (customerGroupId : number)  {
    const customerGroup =  useCustomerGroup()
    await customerGroup.deleteCustomerGroupStore(customerGroupId)
    

}