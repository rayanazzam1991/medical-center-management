import { CreateTicket, defaultTicket, Ticket, TicketSearchFilter, UpdateTicket } from "/@src/models/Sales/Ticket/ticket"
import { useTicket } from "/@src/stores/Sales/Ticket/ticketStore"
import { defaultPagination, Pagination } from "/@src/utils/response"


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
export async function moveTicketToNextWaitingList(ticketId: number) {
    const ticketResponse = useTicket()
    await ticketResponse.moveTicketToNextWaitingListStore(ticketId)
    let success: boolean = ticketResponse.success ?? false
    let error_code: string = ticketResponse.error_code ?? ''
    let message: string = ticketResponse.message ?? ''
    return { success, error_code, message }

}


export async function getTicketsList(searchFilter: TicketSearchFilter) {
  const ticketResponse = useTicket()
  await ticketResponse.getTicketsListStore(searchFilter)
  let tickets: Ticket[] = ticketResponse.tickets
  let success: boolean = ticketResponse.success ?? false
  let error_code: string = ticketResponse.error_code ?? ''
  let pagination: Pagination = ticketResponse.pagination ?? defaultPagination
  let message: string = ticketResponse.message ?? ''
  return { success, error_code, message, tickets, pagination }

}
export async function getPendingTicketsList(searchFilter: TicketSearchFilter) {
  const ticketResponse = useTicket()
  await ticketResponse.getPendingTicketsListStore(searchFilter)
  let tickets: Ticket[] = ticketResponse.tickets
  let success: boolean = ticketResponse.success ?? false
  let error_code: string = ticketResponse.error_code ?? ''
  let pagination: Pagination = ticketResponse.pagination ?? defaultPagination
  let message: string = ticketResponse.message ?? ''
  return { success, error_code, message, tickets, pagination }

}
export async function closeTicket(ticketId: number) {
  const ticketResponse = useTicket()
  await ticketResponse.closeTicketStore(ticketId)
  var success: boolean = ticketResponse.success ?? false
  var error_code: string = ticketResponse.error_code ?? ''
  var message: string = ticketResponse.message ?? ''
  return { success, error_code, message }
}
