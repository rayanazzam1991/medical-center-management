import { AxiosInstance } from "axios"
import { addQuantity, itemHistory } from "/@src/models/Warehouse/ItemHistory/itemHistory"
import { CustomResponseCollection, CustomResponseSingle } from "/@src/utils/response"

export async function addQuantityApi(
    api: AxiosInstance,
    addquantity: addQuantity
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.post(`itemHistory/addQuantity`, addquantity)

    return { response }
}
