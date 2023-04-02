import { BaseConsts } from "/@src/utils/consts/base"
import ar from '/@src/locales/ar.json';
import messages from '@intlify/vite-plugin-vue-i18n/messages';
import { createI18n, DefaultLocaleMessageSchema } from "vue-i18n";
import { Customer, defaultCustomer } from "../../CRM/Customer/customer";
import { Currency, defaultCurrency } from "../../Accounting/Currency/currency";
import { Account, defaultAccount } from "../../Accounting/Account/account";
import { defaultUser, User } from "../../Others/User/user";
import { CreateUpdateTicketService, defaultTicketService, TicketService } from "../TicketService/ticketService";


const i18n = createI18n<[DefaultLocaleMessageSchema], 'ar' | 'en'>({
    locale: 'ar',
    fallbackLocale: 'en',
    messages: messages
})


export interface CreateReminder {
    customer_id: number
    ticket_service_id?: number
    note: string
    date: string
    time: string
}
export interface Reminder {
    id: number
    customer: Customer
    service?: TicketService
    note: string
    time: string
    date: string
    status: number
}

export const defaultCreateReminder: CreateReminder = {
    customer_id: 0,
    ticket_service_id: undefined,
    note: '',
    date: '',
    time: '',
}

export const defaultReminder: Reminder = {
    customer: defaultCustomer,
    service: defaultTicketService,
    id: 0,
    note: '',
    date: '',
    time: '',
    status: 1
}
export interface ReminderSearchFilter {
    customer_id?: number
    page?: number
    per_page?: number
    order_by?: string
    order?: string
}
export interface ChangeReminderStatus {
    id?: number
    status?: number
}
export const defaultChangeReminderStatus: ChangeReminderStatus = {
    id: undefined,
    status: undefined
}

export const defaultReminderSearchFilter = <ReminderSearchFilter>{}



class ReminderConsts {

    static readonly ACTIVE = 1;
    static readonly INACTIVE = 2;
    static readonly DONE = 3;

    public static getStatusName(status: number) {
        if (status == this.ACTIVE)
            return i18n.global.t('reminder_statuses.active')
        if (status == this.INACTIVE)
            return i18n.global.t('reminder_statuses.inactive')
        if (status == this.DONE)
            return i18n.global.t('reminder_statuses.done')
        else return '';
    }
    public static getStatusColor(status: number) {
        if (status == this.ACTIVE)
            return 'success'
        if (status == this.INACTIVE)
            return 'danger'
        if (status == this.DONE)
            return 'info'
        else return undefined;
    }


}

export { ReminderConsts }
