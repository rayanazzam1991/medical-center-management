import { AxiosInstance } from "axios"
import { CreateTicket, UpdateTicket } from "/@src/models/Sales/Ticket/ticket"
import { CreateTicketService, TicketServiceSearchFilter } from "/@src/models/Sales/TicketService/ticketService"
import { CustomResponseCollection, CustomResponseSingle } from "/@src/utils/response"

export async function serveTicketServiceApi(
    api: AxiosInstance,
    ticketServiceId: number,
    ticketServiceNote: string | undefined
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.put(`ticketService/markTicketServiceAsServed/${ticketServiceId}`, { "note": ticketServiceNote })

    return { response }
}
export async function getTicktServiceApi(
    api: AxiosInstance,
    ticketServiceId: number,
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.get(`ticketService/${ticketServiceId}`)

    return { response }
}

export async function getTicktServicesListApi(
    api: AxiosInstance,
    searchFilter: TicketServiceSearchFilter
): Promise<{ response: CustomResponseCollection }> {
    const { data: response, headers } = await api.get('ticketService/getTicketsServicesList', {
        params: searchFilter,
    })
    return { response }
}

export async function createTicketServiceApi(
    api: AxiosInstance,
    data: CreateTicketService
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.post('ticketService', data)
    return { response }
}

export async function deleteTicketServiceApi(
    api: AxiosInstance,
    ticketServiceId: number
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.delete(`ticketService/${ticketServiceId}`)
    return { response }
}

