import { addQuantity, defaultItemHistory, itemHistory } from "/@src/models/Warehouse/ItemHistory/itemHistory"
import { useitemHistory } from "/@src/stores/Warehouse/ItemHistory/itemHistoryStore"
import { Pagination } from "/@src/utils/response"


export async function addQuantityService(addQuantityData: addQuantity) {
    const addQuantityResponse = useitemHistory()
    let addQuantity: itemHistory = await addQuantityResponse.addQuantityStore(addQuantityData) ?? defaultItemHistory
    let success: boolean = addQuantityResponse.success ?? false
    let error_code: string = addQuantityResponse.error_code ?? ''
    let message: string = addQuantityResponse.message ?? ''
    return { success, error_code, message, addQuantity }

}

