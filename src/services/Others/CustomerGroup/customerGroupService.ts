import { useCustomerGroup } from "/@src/stores/Others/CustomerGroup/customerGroupStore"
import { CustomerGroup } from "/@src/utils/api/Others/CustomerGroup"


export async function addCustomerGroup  (customerGroupData : CustomerGroup)  {
    const customerGroup =  useCustomerGroup()
    return await customerGroup.addCustomerGroupStore(customerGroupData)
}

export async function deleteCustomerGroup  (customerGroupId : number)  {
    const customerGroup =  useCustomerGroup()
    await customerGroup.deleteCustomerGroupStore(customerGroupId)
}

export async function editCustomerGroup  (customerGroupData : CustomerGroup)  {
    const customerGroup =  useCustomerGroup()
    await customerGroup.editCustomerGroupStore(customerGroupData)
}

export async function getCustomerGroup  (customerGroupId : number)  {
    const customerGroup =  useCustomerGroup()
    return await customerGroup.getCustomerGroupStore(customerGroupId)
}

export async function getCustomerGroupsList  (searchFilter : CustomerGroupSearchFilter)  {
    const customerGroup =  useCustomerGroup()
    await customerGroup.getCustomerGroupsStore(searchFilter)
    var customerGroups : CustomerGroup[] = customerGroup.customerGroups
    var pagination : Pagination = customerGroup.pagination
    return { customerGroups , pagination }
}