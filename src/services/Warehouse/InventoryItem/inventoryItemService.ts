import { MediaConsts, Media } from "/@src/models/Others/Media/media"
import { CreateUpdateUser } from "/@src/models/Others/User/user"
import { CreateInventoryItem, defaultInventoryItem, InventoryItem } from "/@src/models/Warehouse/InventoryItem/inventoryItem"
import { useInventoryItem } from "/@src/stores/Warehouse/InventoryItem/inventoryItemStore"
import { Pagination } from "/@src/utils/response"

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