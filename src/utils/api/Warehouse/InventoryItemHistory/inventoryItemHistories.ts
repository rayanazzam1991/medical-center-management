import { AxiosInstance } from "axios"
import { addQuantity, ChangeItemHistoryStatus, inventoryItemHistory, InventoryItemHistorySearchFilter, withdrawQuantity } from "../../../../models/Warehouse/ItemHistory/inventoryItemHistory"
import { CustomResponseCollection, CustomResponseSingle } from "/@src/utils/response"

export async function addQuantityApi(
    api: AxiosInstance,
    addquantity: addQuantity
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.post(`inventoryItemHistory/addQuantity`, addquantity)

    return { response }
}

export async function withdrawQuantityApi(
    api: AxiosInstance,
    withdrawquantity: withdrawQuantity
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.post(`inventoryItemHistory/withdrawQuantity`, withdrawquantity)

    return { response }
}
export async function getInventoryMovementsListApi(
    api: AxiosInstance,
    searchFilter: InventoryItemHistorySearchFilter
): Promise<{ response: CustomResponseCollection }> {
    const { data: response, headers } = await api.get('inventoryItemHistory/getInventoryMovementsList', {
        params: searchFilter,
    })
    return { response }
}
export async function changeItemHistoryStatusApi(
    api: AxiosInstance,
    itemHistory: ChangeItemHistoryStatus
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.put(
        `inventoryItemHistory/changeItemHistoryStatus/${itemHistory.id}`,
        itemHistory
    )
    return { response }
}
export async function getItemHistoryApi(
    api: AxiosInstance,
    itemId: number,
    searchFilter: InventoryItemHistorySearchFilter
): Promise<{ response: CustomResponseCollection }> {
    const { data: response, headers } = await api.get(`inventoryItemHistory/getItemHistory/${itemId}`, {
        params: searchFilter,
    })
    return { response }
}