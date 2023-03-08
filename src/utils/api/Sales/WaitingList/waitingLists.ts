import { AxiosInstance } from "axios"
import { WaitingListSearchFilter } from "/@src/models/Sales/WaitingList/waitingList"
import { CustomResponseCollection } from "/@src/utils/response"

export async function getWaitingListsListApi(
    api: AxiosInstance,
    filter: WaitingListSearchFilter
): Promise<{ response: CustomResponseCollection }> {
    const { data: response, headers } = await api.get('waitingList/getWaitingListsList', { params: filter })

    return { response }
}
