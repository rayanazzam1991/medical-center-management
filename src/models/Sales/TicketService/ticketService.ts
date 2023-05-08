import messages from "@intlify/vite-plugin-vue-i18n/messages"
import { createI18n, DefaultLocaleMessageSchema } from "vue-i18n"
import { defaultEmployee, Employee } from "../../Employee/employee"
import { defaultService, Service } from "../../Others/Service/service"
import { Ticket } from "../Ticket/ticket"

const i18n = createI18n<[DefaultLocaleMessageSchema], 'ar' | 'en'>({
    locale: 'ar',
    fallbackLocale: 'en',
    messages: messages
})

export interface TicketService {
    id: number
    service_provider_id: number
    service: Service
    provider: Employee
    sell_price: number
    status: number
    note: string
    ticket?: Ticket
    created_at: string
    updated_at: string
}
export interface CreateTicketService {
    ticket_id: number
    service_provider_id: number
    sell_price: number
}

export interface CreateUpdateTicketService {
    service_provider_id: number
    sell_price: number
}
export interface CreateTicketServiceHelper {
    service_id: number
    service_provider_id: number
    sell_price: number
    editable: boolean
}

export interface TicketServiceSearchFilter {

    created_at_from?: string
    note?: string
    created_at_to?: string
    department_id?: number
    room_id?: number
    customer_id?: number
    provider_id?: number
    service_id?: number
    status?: number
    page?: number
    per_page?: number
    order_by?: string
    order?: string
}

export const defaultTicketServiceSearchFilter = <TicketServiceSearchFilter>{}
export const defaultTicketService: TicketService = {
    created_at: '',
    id: 0,
    note: '',
    provider: defaultEmployee,
    sell_price: 0,
    service: defaultService,
    service_provider_id: 0,
    status: 1,
    updated_at: '',
    ticket: undefined
}
export const defaultCreateTicketService: CreateTicketService = {
    sell_price: 0,
    service_provider_id: 0,
    ticket_id: 0
}

class TicketServiceConsts {
    static readonly NOT_SERVED = 1;
    static readonly SERVED = 2;

    public static getStatusName(status: number) {
        if (status == this.NOT_SERVED)
            return i18n.global.t('ticket_service_statuses.not_served')
        if (status == this.SERVED)
            return i18n.global.t('ticket_service_statuses.served')
        else return '';
    }

    public static getStatusColor(status: number) {
        if (status == this.NOT_SERVED)
            return 'warning'
        if (status == this.SERVED)
            return 'success'
        else return undefined;
    }


}

export { TicketServiceConsts }