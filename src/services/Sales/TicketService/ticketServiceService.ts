import { useTicketService } from "/@src/stores/Sales/TicketService/ticketServiceStore"

export async function serveTicketService(ticketServiceId: number , ticketServiceNote : string | undefined) {
    const response = useTicketService()
    await response.serveTicketServiceStore(ticketServiceId, ticketServiceNote)
    let success: boolean = response.success ?? false
    let error_code: string = response.error_code ?? ''
    let message: string = response.message ?? ''

    return { success, error_code, message }

}
