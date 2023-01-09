import { AxiosInstance } from "axios"
import { addQuantity, ChangeItemHistoryStatus, itemHistory, ItemHistorySearchFilter, withdrawQuantity } from "/@src/models/Warehouse/ItemHistory/itemHistory"
import { CustomResponseCollection, CustomResponseSingle } from "/@src/utils/response"

export async function addQuantityApi(
    api: AxiosInstance,
    addquantity: addQuantity
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.post(`itemHistory/addQuantity`, addquantity)

    return { response }
}

export async function withdrawQuantityApi(
    api: AxiosInstance,
    withdrawquantity: withdrawQuantity
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.post(`itemHistory/withdrawQuantity`, withdrawquantity)

    return { response }
}
export async function getItemHistoriesApi(
    api: AxiosInstance,
    searchFilter: ItemHistorySearchFilter
): Promise<{ response: CustomResponseCollection }> {
    const { data: response, headers } = await api.get('itemHistory/getItemHistoriesList', {
        params: searchFilter,
    })
    return { response }
}
export async function changeItemHistoryStatusApi(
    api: AxiosInstance,
    itemHistory: ChangeItemHistoryStatus
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.put(
        `itemHistory/changeItemHistoryStatus/${itemHistory.id}`,
        itemHistory
    )
    return { response }
}
export async function getItemHistoryApi(
    api: AxiosInstance,
    itemId: number,
    searchFilter: ItemHistorySearchFilter
): Promise<{ response: CustomResponseCollection }> {
    const { data: response, headers } = await api.get(`itemHistory/getItemHistory/${itemId}`, {
        params: searchFilter,
    })
    return { response }
}