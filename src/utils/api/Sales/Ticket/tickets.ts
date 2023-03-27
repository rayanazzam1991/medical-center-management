import { AxiosInstance } from "axios"
import { ConfirmPaymentTicket, CreateTicket, TicketSearchFilter, UpdateTicket } from "/@src/models/Sales/Ticket/ticket"
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
export async function confirmPaymentTicketApi(
  api: AxiosInstance,
  ticketId: number,
  ticket: ConfirmPaymentTicket
): Promise<{ response: CustomResponseSingle }> {
const { data: response, headers } = await api.put(`ticket/confirmPaymentTicket/${ticketId}`, ticket)

return { response }
}
export async function getTicketApi(
  api: AxiosInstance,
  ticketId: number
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.get(`ticket/${ticketId}`)

  return { response }
}
export async function moveTicketToNextWaitingListApi(
    api: AxiosInstance,
    ticketId: number
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.post(`ticket/moveTicketToNextWaitingList/${ticketId}`)

    return { response }
}

export async function getTicketsListApi(
  api: AxiosInstance,
  searchFilter: TicketSearchFilter
): Promise<{ response: CustomResponseCollection }> {
  const { data: response, headers } = await api.get(`ticket/getTicketsList`, {
    params: searchFilter
  })
  return { response }
}
export async function getPendingTicketsListApi(
  api: AxiosInstance,
  searchFilter: TicketSearchFilter
): Promise<{ response: CustomResponseCollection }> {
  const { data: response, headers } = await api.get(`ticket/getPendingTicketsList`, {
    params: searchFilter
  })
  return { response }
}


export async function closeTicketApi(
  api: AxiosInstance,
  ticketId: number
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.put(
    `ticket/closeTicket/${ticketId}`
  )
  return { response }
}
