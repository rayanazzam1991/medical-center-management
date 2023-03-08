import { AxiosInstance } from "axios"
import { CreateTicket, UpdateTicket } from "/@src/models/Sales/Ticket/ticket"
import { CustomResponseCollection, CustomResponseSingle } from "/@src/utils/response"

export async function createTicketApi(
    api: AxiosInstance,
    ticket: CreateTicket
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.post('ticket', ticket)

    return { response }
}
export async function updateTicketApi(
    api: AxiosInstance,
    ticketId: number,
    ticket: UpdateTicket
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.put(`ticket/${ticketId}`, ticket)

    return { response }
}



export async function getTicketApi(
    api: AxiosInstance,
    ticketId: number
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.get(`ticket/${ticketId}`)

    return { response }
}
