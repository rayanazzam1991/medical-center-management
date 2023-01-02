import { AxiosInstance } from "axios"
import { Item, ItemSearchFilter, ChangeItemStatus, CreateUpdateItem } from "/@src/models/Warehouse/Item/item"
import { CustomResponseCollection, CustomResponseSingle } from "/@src/utils/response"

export async function changeItemStatusApi(
    api: AxiosInstance,
    item: ChangeItemStatus
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.put(
        `item/changeItemStatus/${item.id}`,
        item
    )
    return { response }
}
export async function addItemApi(
    api: AxiosInstance,
    item: CreateUpdateItem
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.post(`item`, item)

    return { response }
}
export async function editItemApi(
    api: AxiosInstance,
    item: CreateUpdateItem
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.put(`item/${item.id}`, item)
    return { response }
}
export async function getItemApi(
    api: AxiosInstance,
    itemId: number
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.get(`item/${itemId}`)

    return { response }
}
export async function getItemsApi(
    api: AxiosInstance,
    searchFilter: ItemSearchFilter
): Promise<{ response: CustomResponseCollection }> {
    const { data: response, headers } = await api.get('item/getItemsList', {
        params: searchFilter,
    })
    return { response }
}
