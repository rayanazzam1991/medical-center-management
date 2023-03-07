import { CreateTicket, defaultTicket, Ticket, UpdateTicket } from "/@src/models/Sales/Ticket/ticket"
import { useTicket } from "/@src/stores/Sales/Ticket/ticketStore"


export async function createTicket(ticketData: CreateTicket) {
    const ticketResponse = useTicket()
    let ticket: Ticket = await ticketResponse.createTicketStore(ticketData) ?? defaultTicket
    let success: boolean = ticketResponse.success ?? false
    let error_code: string = ticketResponse.error_code ?? ''
    let message: string = ticketResponse.message ?? ''
    return { success, error_code, message, ticket }

}
export async function updateTicket(ticketId: number, ticketData: UpdateTicket) {
    const ticketResponse = useTicket()
    let ticket: Ticket = await ticketResponse.updateTicketStore(ticketId, ticketData) ?? defaultTicket
    let success: boolean = ticketResponse.success ?? false
    let error_code: string = ticketResponse.error_code ?? ''
    let message: string = ticketResponse.message ?? ''
    return { success, error_code, message, ticket }

}

export async function getTicket(ticketId: number) {
    const ticketResponse = useTicket()
    let ticket: Ticket = await ticketResponse.getTicketStore(ticketId) ?? defaultTicket
    let success: boolean = ticketResponse.success ?? false
    let error_code: string = ticketResponse.error_code ?? ''
    let message: string = ticketResponse.message ?? ''
    return { success, error_code, message, ticket }

}