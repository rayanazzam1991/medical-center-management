import messages from '@intlify/vite-plugin-vue-i18n/messages';
import { createI18n, DefaultLocaleMessageSchema } from "vue-i18n";
import { defaultEmployee, Employee } from '../../Employee/employee';
import { defaultTicket, Ticket } from '../Ticket/ticket';
import { Customer, defaultCustomer } from '../../CRM/Customer/customer';


const i18n = createI18n<[DefaultLocaleMessageSchema], 'ar' | 'en'>({
    locale: 'ar',
    fallbackLocale: 'en',
    messages: messages
})
export interface WaitingList {
    provider: Employee
    waiting_list: EmployeeWaitingList[]
}
export interface ServiceCard {
    customer: Customer
    provider: Employee
    turn_number: number
}

export interface EmployeeWaitingList {
    id: number
    turn_number: number
    ticket: Ticket
}

export interface TicketServicesNotesHelper {
    requested_service_id: number
    note?: string
}

export interface WaitingListSearchFilter {
    provider_id?: number
    department_id?: number
    room_id?: number
}
export interface ServiceCardsListSearchFilter {
    customer_name?: string
    provider_name?: string
    page?: number
    per_page?: number
    order_by?: string
    order?: string
}


export const defaultWaitingList: WaitingList = {
    provider: defaultEmployee,
    waiting_list: []
}
export const defaultServiceCard: ServiceCard = {
    provider: defaultEmployee,
    customer: defaultCustomer,
    turn_number: 0
}
export const defaultWaitingListSearchFilter: WaitingListSearchFilter = {
    provider_id: undefined,
    department_id: undefined,
    room_id: undefined

}
export interface WaitingListByTicket {
    id: number
    turn_number: number
    ticket: Ticket
    current_provider: Employee
    created_at: string
}
export const defaultWaitingListByTicket: WaitingListByTicket = {
    id: 0,
    turn_number: 0,
    ticket: defaultTicket,
    current_provider: defaultEmployee,
    created_at: ' '

}

