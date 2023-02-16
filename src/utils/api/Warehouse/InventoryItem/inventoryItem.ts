import { AxiosInstance } from "axios"
import { CreateInventoryItem } from "/@src/models/Warehouse/InventoryItem/inventoryItem"
import { CustomResponseSingle, CustomResponseCollection } from "/@src/utils/response"

export async function fromMainInventoryApi(
    api: AxiosInstance,
    inventoryItem: CreateInventoryItem
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.post(`inventoryItem/fromMainInventory`, inventoryItem)
    return { response }
}
export async function toMainInventoryApi(
    api: AxiosInstance,
    inventoryItem: CreateInventoryItem
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.post(
        `inventoryItem/toMainInventory`,
        inventoryItem
    )
    return { response }
}
export async function getInventoryItemsListByInventory(
    api: AxiosInstance,
    inventory_id: number,
    filter: InventoryItemByInventorySearchFilter
): Promise<{ response: CustomResponseCollection }> {
    const { data: response, headers } = await api.get(
        `inventoryItem/getInventoryItemsListByInventory/${inventory_id}`,
        { params: filter }
    )
    return { response }
}
