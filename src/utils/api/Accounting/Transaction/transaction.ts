import { AxiosInstance } from "axios"
import { CreateRecords } from "/@src/models/Accounting/Transaction/record"
import { CustomResponseSingle } from "/@src/utils/response"


export async function createRecordsApi(
    api: AxiosInstance,
    records:CreateRecords
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.post('transaction/createRecords',records)
    return { response }
}