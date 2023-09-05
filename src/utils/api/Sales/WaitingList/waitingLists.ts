import { AxiosInstance } from "axios"
import { ServiceCardsListSearchFilter, WaitingListSearchFilter } from "/@src/models/Sales/WaitingList/waitingList"
import { CustomResponseCollection, CustomResponseSingle } from "/@src/utils/response"

export async function getWaitingListsListApi(
    api: AxiosInstance,
    filter: WaitingListSearchFilter
): Promise<{ response: CustomResponseCollection }> {
    const { data: response, headers } = await api.get('waitingList/getWaitingListsList', { params: filter })

    return { response }
}

export async function getWaitingListByProviderIdApi(
    api: AxiosInstance,
    providerId: number
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.get(`waitingList/getWaitingListByProviderId/${providerId}`)

    return { response }
}
export async function serveNextTicketInProviderWaitingListApi(
    api: AxiosInstance,
    providerId: number
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.post(`waitingList/serveNextTicketInProviderWaitingList/${providerId}`)

    return { response }
}

export async function getWaitingListByTicketIdApi(
    api: AxiosInstance,
    ticketId: number
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.get(`waitingList/getWaitingListByTicketId/${ticketId}`)

    return { response }
}

export async function getServiceCardsListApi(
    api: AxiosInstance,
    filter: ServiceCardsListSearchFilter
): Promise<{ response: CustomResponseCollection }> {
    const { data: response, headers } = await api.get(`waitingList/getServiceCardsList`, { params: filter })

    return { response }
}

export async function sendAlertToProviderApi(
    api: AxiosInstance,
    providerId: number
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.get(`waitingList/sendAlertToProvider/${providerId}`)

    return { response }
}

