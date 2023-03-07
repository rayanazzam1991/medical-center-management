import { BaseConsts } from "/@src/utils/consts/base"
import ar from '/@src/locales/ar.json';
import messages from '@intlify/vite-plugin-vue-i18n/messages';
import { createI18n, DefaultLocaleMessageSchema } from "vue-i18n";
import { Customer, defaultCustomer } from "../../CRM/Customer/customer";
import { Currency, defaultCurrency } from "../../Accounting/Currency/currency";
import { Account, defaultAccount } from "../../Accounting/Account/account";
import { defaultUser, User } from "../../Others/User/user";
import { CreateUpdateTicketService, TicketService } from "../TicketService/ticketService";


const i18n = createI18n<[DefaultLocaleMessageSchema], 'ar' | 'en'>({
    locale: 'ar',
    fallbackLocale: 'en',
    messages: messages
})
export interface Ticket {
    id: number
    customer: Customer
    total_amount: number
    currency: Currency
    currency_rate: number
    paid_amount: number
    remaining_amount: number
    cash_account: Account
    status: number
    created_at: string
    created_by: User
    requested_services: TicketService[]
}


export interface CreateTicket {
    customer_id: number
    total_amount: number
    cash_account_id: number
    currency_id: number
    currency_rate: number
    paid_amount: number
    remaining_amount: number
    requested_services: CreateUpdateTicketService[]
}
export interface UpdateTicket {
    total_amount: number
    cash_account_id: number
    currency_rate: number
    paid_amount: number
    remaining_amount: number
    requested_services: CreateUpdateTicketService[]
}

export const defaultCreateTicket: CreateTicket = {
    customer_id: 0,
    total_amount: 0,
    cash_account_id: 0,
    currency_id: 0,
    currency_rate: 1,
    paid_amount: 0,
    remaining_amount: 0,
    requested_services: []

}
export const defaultTicket: Ticket = {
    cash_account: defaultAccount,
    created_at: '',
    created_by: defaultUser,
    currency: defaultCurrency,
    currency_rate: 1,
    customer: defaultCustomer,
    id: 0,
    paid_amount: 0,
    remaining_amount: 0,
    requested_services: [],
    status: 1,
    total_amount: 0


}


class TicketConsts {

    static readonly WAITING = 1;
    static readonly SERVING = 2;
    static readonly SERVICES_ARE_DONE = 2;
    static readonly CLOSED = 2;

    public static getStatusName(status: number) {
        if (status == this.WAITING)
            return i18n.global.t('ticket_statuses.waiting')
        if (status == this.SERVING)
            return i18n.global.t('ticket_statuses.serving')
        if (status == this.SERVICES_ARE_DONE)
            return i18n.global.t('ticket_statuses.services_are_done')
        if (status == this.CLOSED)
            return i18n.global.t('ticket_statuses.closed')
        else return '';
    }


}

export { TicketConsts }