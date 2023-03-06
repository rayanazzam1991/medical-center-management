import messages from "@intlify/vite-plugin-vue-i18n/messages"
import { createI18n, DefaultLocaleMessageSchema } from "vue-i18n"
import { Employee } from "../../Employee/employee"
import { Service } from "../../Others/Service/service"

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
}

export interface CreateTicketService {
    service_provider_id: number
    sell_price: number
}
export interface CreateTicketServiceHelper {
    service_id: number
    service_provider_id: number
    sell_price: number
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


}

export { TicketServiceConsts }