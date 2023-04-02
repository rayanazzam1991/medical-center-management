import { addQuantity, ChangeItemHistoryStatus, defaultInventoryItemHistory, inventoryItemHistory, InventoryItemHistoryConsts, InventoryItemHistorySearchFilter, withdrawQuantity } from "../../../models/Warehouse/ItemHistory/inventoryItemHistory"
import { useinventoryItemHistory } from "../../../stores/Warehouse/ItemHistory/inventoryItemHistoryStore"
import { Pagination } from "/@src/utils/response"
import { MediaConsts, Media } from "/@src/models/Others/Media/media"
import { Employee } from "/@src/models/Employee/employee"
import { Customer } from "/@src/models/CRM/Customer/customer"
import { Supplier } from "/@src/models/Others/Supplier/supplier"



export async function addQuantityService(addQuantityData: addQuantity) {
    const addQuantityResponse = useinventoryItemHistory()
    let addQuantity: inventoryItemHistory = await addQuantityResponse.addQuantityStore(addQuantityData) ?? defaultInventoryItemHistory
    let success: boolean = addQuantityResponse.success ?? false
    let error_code: string = addQuantityResponse.error_code ?? ''
    let message: string = addQuantityResponse.message ?? ''
    return { success, error_code, message, addQuantity }

}
export async function addItemHistoryFile(itemHistory_id: unknown, fd: FormData) {
    const contractorResponse = useinventoryItemHistory()
    const is_featured: unknown = false
    fd.append('model_id', itemHistory_id as string)
    fd.append('model_type', MediaConsts.INVENTORY_ITEM_HISTORY_MODEL_ROUTE)
    fd.append('is_featured', String(is_featured))
    let media: Media[] = await contractorResponse.addItemHistoryFileStore(fd) ?? []
    let success: boolean = contractorResponse.success ?? false
    let error_code: string = contractorResponse.error_code ?? ''
    let message: string = contractorResponse.message ?? ''
    return { success, error_code, message, media }
}
export async function withdrawQuantityService(withdrawQuantityData: withdrawQuantity) {
    const withdrawQuantityResponse = useinventoryItemHistory()
    let withdrawQuantity: inventoryItemHistory = await withdrawQuantityResponse.withdrawQuantityStore(withdrawQuantityData) ?? defaultInventoryItemHistory
    let success: boolean = withdrawQuantityResponse.success ?? false
    let error_code: string = withdrawQuantityResponse.error_code ?? ''
    let message: string = withdrawQuantityResponse.message ?? ''
    return { success, error_code, message, withdrawQuantity }

}
export async function getInventoryMovementsList(searchFilter: InventoryItemHistorySearchFilter) {
    const itemHistory = useinventoryItemHistory()
    await itemHistory.getInventoryMovementsListStore(searchFilter)
    let itemHistories: inventoryItemHistory[] = itemHistory.inventoryItemHistories
    let pagination: Pagination = itemHistory.pagination
    return { itemHistories, pagination }
}
export async function getItemHistory(itemId: number, searchFilter: InventoryItemHistorySearchFilter) {
    const itemHistory = useinventoryItemHistory()
    await itemHistory.getItemHistoryStore(itemId, searchFilter)
    let itemHistories: inventoryItemHistory[] = itemHistory.inventoryItemHistories
    let pagination: Pagination = itemHistory.pagination
    return { itemHistories, pagination }
}
export async function changeItemHistoryStatus(itemHistoryData: ChangeItemHistoryStatus) {
    const itemResponse = useinventoryItemHistory()
    await itemResponse.changeItemHistoryStatusStore(itemHistoryData)
    let success: boolean = itemResponse.success ?? false
    let error_code: string = itemResponse.error_code ?? ''
    let message: string = itemResponse.message ?? ''
    return { success, error_code, message }
}
export function getFromName(data: inventoryItemHistory) {
    if (data.type == InventoryItemHistoryConsts.INTERNAL_TYPE_HISTORY) {
        return data?.from_inventory ?? '-'
    } else if (data.action == InventoryItemHistoryConsts.WITHDRAW_QUANTITY) {
        return data?.from_inventory ?? '-'
    } else if (data.action == InventoryItemHistoryConsts.SELL_QUANTITY) {
        return data?.from_inventory ?? '-'
    } else if (data.action == InventoryItemHistoryConsts.ADD_QUANTITY) {
        let supplierCauser = data?.causer as Supplier
        return supplierCauser?.name ?? '-'
    } else return '-'
}
export function getToName(data: inventoryItemHistory) {
    if (data.type == InventoryItemHistoryConsts.INTERNAL_TYPE_HISTORY) {
        return data?.to_inventory ?? '-'
    } else if (data.action == InventoryItemHistoryConsts.WITHDRAW_QUANTITY) {
        let employeeCauser = data.causer as Employee
        return employeeCauser?.user?.first_name + ' ' + employeeCauser?.user?.last_name ?? '-'
    } else if (data.action == InventoryItemHistoryConsts.SELL_QUANTITY) {
        let customerCauser = data.causer as Customer
        return customerCauser?.user?.first_name + ' ' + customerCauser?.user?.last_name ?? '-'
    } else if (data.action == InventoryItemHistoryConsts.ADD_QUANTITY) {
        return data?.to_inventory ?? '-'
    } else return '-'
}
export function resetInventoryItemHistorySearchFilter() {
    const blankSearchFilter: InventoryItemHistorySearchFilter = {
        order: undefined,
        order_by: undefined,
        page: undefined,
        per_page: undefined,
        status: undefined,
        action: undefined,
        action_by: undefined,
        date_between: undefined,
        from: undefined,
        from_inventory: undefined,
        item_id: undefined,
        to: undefined,
        to_inventory: undefined,
        type: undefined,
        supplier_name: undefined
    }

    return blankSearchFilter

}
