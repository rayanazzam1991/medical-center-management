import { AxiosInstance } from "axios"
import { CreateTicket, UpdateTicket } from "/@src/models/Sales/Ticket/ticket"
import { CustomResponseCollection, CustomResponseSingle } from "/@src/utils/response"

export async function serveTicketServiceApi(
    api: AxiosInstance,
    ticketServiceId: number , 
    ticketServiceNote : string | undefined
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.put(`ticketService/markTicketServiceAsServed/${ticketServiceId}`, { "note" : ticketServiceNote})

    return { response }
}
