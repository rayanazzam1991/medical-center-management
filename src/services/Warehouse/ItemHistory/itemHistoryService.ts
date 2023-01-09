import { addQuantity, ChangeItemHistoryStatus, defaultItemHistory, itemHistory, ItemHistorySearchFilter, withdrawQuantity } from "/@src/models/Warehouse/ItemHistory/itemHistory"
import { useitemHistory } from "/@src/stores/Warehouse/ItemHistory/itemHistoryStore"
import { Pagination } from "/@src/utils/response"
import { MediaConsts, Media } from "/@src/models/Others/Media/media"



export async function addQuantityService(addQuantityData: addQuantity) {
    const addQuantityResponse = useitemHistory()
    let addQuantity: itemHistory = await addQuantityResponse.addQuantityStore(addQuantityData) ?? defaultItemHistory
    let success: boolean = addQuantityResponse.success ?? false
    let error_code: string = addQuantityResponse.error_code ?? ''
    let message: string = addQuantityResponse.message ?? ''
    return { success, error_code, message, addQuantity }

}
export async function addItemHistoryFile(itemHistory_id: unknown, fd: FormData) {
    const contractorResponse = useitemHistory()
    const is_featured: unknown = false
    fd.append('model_id', itemHistory_id as string)
    fd.append('model_type', MediaConsts.ItemHistory_MODEL_ROUTE)
    fd.append('is_featured', String(is_featured))
    let media: Media[] = await contractorResponse.addItemHistoryFileStore(fd) ?? []
    let success: boolean = contractorResponse.success ?? false
    let error_code: string = contractorResponse.error_code ?? ''
    let message: string = contractorResponse.message ?? ''
    return { success, error_code, message, media }
}
export async function withdrawQuantityService(withdrawQuantityData: withdrawQuantity) {
    const withdrawQuantityResponse = useitemHistory()
    let withdrawQuantity: itemHistory = await withdrawQuantityResponse.withdrawQuantityStore(withdrawQuantityData) ?? defaultItemHistory
    let success: boolean = withdrawQuantityResponse.success ?? false
    let error_code: string = withdrawQuantityResponse.error_code ?? ''
    let message: string = withdrawQuantityResponse.message ?? ''
    return { success, error_code, message, withdrawQuantity }

}
export async function getItemHistoriesList(searchFilter: ItemHistorySearchFilter) {
    const itemHistory = useitemHistory()
    await itemHistory.getItemHistoriesStore(searchFilter)
    let itemHistories: itemHistory[] = itemHistory.itemHistories
    let pagination: Pagination = itemHistory.pagination
    return { itemHistories, pagination }
}
export async function getItemHistory(itemId: number, searchFilter: ItemHistorySearchFilter) {
    const itemHistory = useitemHistory()
    await itemHistory.getItemHistoryStore(itemId, searchFilter)
    let itemHistories: itemHistory[] = itemHistory.itemHistories
    let pagination: Pagination = itemHistory.pagination
    return { itemHistories, pagination }
}
export async function changeItemHistoryStatus(itemHistoryData: ChangeItemHistoryStatus) {
    const itemResponse = useitemHistory()
    await itemResponse.changeItemHistoryStatusStore(itemHistoryData)
    let success: boolean = itemResponse.success ?? false
    let error_code: string = itemResponse.error_code ?? ''
    let message: string = itemResponse.message ?? ''
    return { success, error_code, message }
}
