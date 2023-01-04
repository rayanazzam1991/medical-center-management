import { addQuantity, defaultItemHistory, itemHistory } from "/@src/models/Warehouse/ItemHistory/itemHistory"
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
    var media: Media[] = await contractorResponse.addItemHistoryFileStore(fd) ?? []
    var success: boolean = contractorResponse.success ?? false
    var error_code: string = contractorResponse.error_code ?? ''
    var message: string = contractorResponse.message ?? ''
    return { success, error_code, message, media }
}

