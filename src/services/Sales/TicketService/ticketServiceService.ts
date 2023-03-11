import { defaultTicketService, TicketService, TicketServiceSearchFilter } from "/@src/models/Sales/TicketService/ticketService"
import { useTicketService } from "/@src/stores/Sales/TicketService/ticketServiceStore"
import { Pagination } from "/@src/utils/response"

export async function serveTicketService(ticketServiceId: number, ticketServiceNote: string | undefined) {
    const response = useTicketService()
    await response.serveTicketServiceStore(ticketServiceId, ticketServiceNote)
    let success: boolean = response.success ?? false
    let error_code: string = response.error_code ?? ''
    let message: string = response.message ?? ''

    return { success, error_code, message }

}

export async function getTicketService(ticketServiceId: number) {
    const response = useTicketService()
    let ticket_service: TicketService = await response.getTicketServiceStore(ticketServiceId) ?? defaultTicketService
    let success: boolean = response.success ?? false
    let error_code: string = response.error_code ?? ''
    let message: string = response.message ?? ''

    return { success, error_code, message, ticket_service }

}

export async function getTicktServicesList(searchFilter: TicketServiceSearchFilter) {
    const response = useTicketService()
    let ticket_services: TicketService[] = await response.getTicktServicesListStore(searchFilter) ?? []
    let pagination: Pagination = response.pagination
    let success: boolean = response.success ?? false
    let error_code: string = response.error_code ?? ''
    let message: string = response.message ?? ''

    return { ticket_services, pagination, success, error_code, message }

}

