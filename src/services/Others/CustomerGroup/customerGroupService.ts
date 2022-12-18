import { CustomerGroup, CustomerGroupSearchFilter, defaultCustomerGroup } from "/@src/models/Others/CustomerGroup/customerGroup"
import { useCustomerGroup } from "/@src/stores/Others/CustomerGroup/customerGroupStore"
import { Pagination } from "/@src/utils/response"

export async function addCustomerGroup(customerGroupData: CustomerGroup) {
    const customerGroupResponse = useCustomerGroup()
    var customerGroup: CustomerGroup = await customerGroupResponse.addCustomerGroupStore(customerGroupData) ?? defaultCustomerGroup
    var success: boolean = customerGroupResponse.success ?? false
    var error_code: string = customerGroupResponse.error_code ?? ''
    var message: string = customerGroupResponse.message ?? ''
    return { success, error_code, message, customerGroup }
}

export async function deleteCustomerGroup(customerGroupId: number) {
    const customerGroupResponse = useCustomerGroup()
    await customerGroupResponse.deleteCustomerGroupStore(customerGroupId)
    var success: boolean = customerGroupResponse.success ?? false
    var error_code: string = customerGroupResponse.error_code ?? ''
    var message: string = customerGroupResponse.message ?? ''
    return { success, error_code, message }
}

export async function editCustomerGroup(customerGroupData: CustomerGroup) {
    const customerGroupResponse = useCustomerGroup()
    await customerGroupResponse.editCustomerGroupStore(customerGroupData)
    var success: boolean = customerGroupResponse.success ?? false
    var error_code: string = customerGroupResponse.error_code ?? ''
    var message: string = customerGroupResponse.message ?? ''
    return { success, error_code, message }
}

export async function getCustomerGroup(customerGroupId: number) {
    const customerGroupResponse = useCustomerGroup()
    var customerGroup: CustomerGroup = await customerGroupResponse.getCustomerGroupStore(customerGroupId) ?? defaultCustomerGroup
    var success: boolean = customerGroupResponse.success ?? false
    var error_code: string = customerGroupResponse.error_code ?? ''
    var message: string = customerGroupResponse.message ?? ''
    return { success, error_code, message, customerGroup }

}

export async function getCustomerGroupsList(searchFilter: CustomerGroupSearchFilter) {
    const customerGroupResponse = useCustomerGroup()
    await customerGroupResponse.getCustomerGroupsStore(searchFilter)
    var customerGroups: CustomerGroup[] = customerGroupResponse.customerGroups
    var pagination: Pagination = customerGroupResponse.pagination

    var success: boolean = customerGroupResponse.success ?? false
    var error_code: string = customerGroupResponse.error_code ?? ''
    var message: string = customerGroupResponse.message ?? ''
    return { success, error_code, message, customerGroups, pagination }
}