import { AxiosInstance } from "axios"
import { CreateInventoryItem, InventoryByItemSearchFilter } from "/@src/models/Warehouse/InventoryItem/inventoryItem"
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
export async function getInventoriesListByItemApi(
    api: AxiosInstance,
    itemId: number,
    filter: InventoryByItemSearchFilter
): Promise<{ response: CustomResponseCollection }> {
    const { data: response, headers } = await api.get(
        `inventoryItem/getInventoriesListByItem/${itemId}`, { params: filter }
    )
    return { response }
}
