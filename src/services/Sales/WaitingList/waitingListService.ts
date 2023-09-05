import { defaultWaitingList, defaultWaitingListByTicket, ServiceCard, ServiceCardsListSearchFilter, WaitingList, WaitingListByTicket, WaitingListSearchFilter } from "/@src/models/Sales/WaitingList/waitingList"
import { useWaitingList } from "/@src/stores/Sales/WaitingList/waitingListStore"
import { Pagination } from "/@src/utils/response"



export async function getWaitingLists(searchFilter: WaitingListSearchFilter) {
    const response = useWaitingList()
    let waiting_lists: WaitingList[] = await response.getWaitingListsStore(searchFilter) ?? []
    let success: boolean = response.success ?? false
    let error_code: string = response.error_code ?? ''
    let message: string = response.message ?? ''

    return { waiting_lists, success, error_code, message }

}
export async function getWaitingListByProvider(providerId: number) {
    const response = useWaitingList()
    let waiting_list: WaitingList = await response.getWaitingListByProviderStore(providerId) ?? defaultWaitingList
    let success: boolean = response.success ?? false
    let error_code: string = response.error_code ?? ''
    let message: string = response.message ?? ''

    return { waiting_list, success, error_code, message }

}
export async function serveNextTicketInProviderWaitingList(providerId: number) {
    const response = useWaitingList()
    await response.serveNextTicketInProviderWaitingListStore(providerId)
    let success: boolean = response.success ?? false
    let error_code: string = response.error_code ?? ''
    let message: string = response.message ?? ''

    return { success, error_code, message }

}
export async function getWaitingListByTicketId(ticketId: number) {
    const response = useWaitingList()
    let waiting_list_by_ticket: WaitingListByTicket = await response.getWaitingListByTicketIdStore(ticketId) ?? defaultWaitingListByTicket
    let success: boolean = response.success ?? false
    let error_code: string = response.error_code ?? ''
    let message: string = response.message ?? ''

    return { waiting_list_by_ticket, success, error_code, message }

}

export async function getServiceCardsList(searchFilter: ServiceCardsListSearchFilter) {
    const response = useWaitingList()
    await response.getServiceCardsListStore(searchFilter)
    let service_cards: ServiceCard[] = response.serviceCardsList
    let pagination: Pagination = response.pagination
    let success: boolean = response.success ?? false
    let error_code: string = response.error_code ?? ''
    let message: string = response.message ?? ''

    return { service_cards, pagination, success, error_code, message }
}
export async function sendAlertToProvider(providerId: number) {
    const response = useWaitingList()
    await response.sendAlertToProviderStore(providerId)
    let success: boolean = response.success ?? false
    let error_code: string = response.error_code ?? ''
    let message: string = response.message ?? ''

    return { success, error_code, message }
}



export function resetServiceCardsListSearchFilter() {
    const blankSearchFilter: ServiceCardsListSearchFilter = {
        customer_name: undefined,
        order: undefined,
        order_by: undefined,
        page: undefined,
        per_page: undefined,
        provider_name: undefined,
    }

    return blankSearchFilter

}

