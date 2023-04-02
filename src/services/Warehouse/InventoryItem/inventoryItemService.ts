import { MediaConsts, Media } from "/@src/models/Others/Media/media"
import { CreateUpdateUser } from "/@src/models/Others/User/user"
import { CreateInventoryItem, defaultInventoryItem, InventoryByItem, InventoryByItemSearchFilter, InventoryItem } from "/@src/models/Warehouse/InventoryItem/inventoryItem"
import { useInventoryItem } from "/@src/stores/Warehouse/InventoryItem/inventoryItemStore"
import { defaultPagination, Pagination } from "/@src/utils/response"

export async function fromMainInventory(
    inventoryItemData: CreateInventoryItem,
) {
    const inventoryItemResponse = useInventoryItem()
    let inventoryItem: InventoryItem = await inventoryItemResponse.fromMainInventoryStore(inventoryItemData) ?? defaultInventoryItem
    let success: boolean = inventoryItemResponse.success ?? false
    let error_code: string = inventoryItemResponse.error_code ?? ''
    let message: string = inventoryItemResponse.message ?? ''
    return { success, error_code, message, inventoryItem }
}

export async function toMainInventory(
    inventoryItemData: CreateInventoryItem,
) {
    const inventoryItemResponse = useInventoryItem()
    let inventoryItem: InventoryItem = await inventoryItemResponse.toMainInventoryStore(inventoryItemData) ?? defaultInventoryItem
    let success: boolean = inventoryItemResponse.success ?? false
    let error_code: string = inventoryItemResponse.error_code ?? ''
    let message: string = inventoryItemResponse.message ?? ''
    return { success, error_code, message, inventoryItem }
}
export async function getInventoriesListByItem(
    itemId: number,
    filter: InventoryByItemSearchFilter
) {
    const inventoryItemResponse = useInventoryItem()
    let inventoriesItem: InventoryByItem[] = await inventoryItemResponse.getInventoriesListByItemStore(itemId, filter) ?? []
    let pagination: Pagination = inventoryItemResponse.pagination ?? defaultPagination
    let success: boolean = inventoryItemResponse.success ?? false
    let error_code: string = inventoryItemResponse.error_code ?? ''
    let message: string = inventoryItemResponse.message ?? ''
    return { success, error_code, message, inventoriesItem, pagination }
}
export function resetInventoryByItemSearchFilter() {
    const blankSearchFilter: InventoryByItemSearchFilter = {
        inventory_name: undefined,
        order: undefined,
        order_by: undefined,
        page: undefined,
        per_page: undefined,
        quantity: undefined
    }

    return blankSearchFilter

}
