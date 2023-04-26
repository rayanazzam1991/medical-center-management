import messages from "@intlify/vite-plugin-vue-i18n/messages"
import { createI18n, DefaultLocaleMessageSchema } from "vue-i18n"
import { Customer, defaultCustomer } from "../../CRM/Customer/customer"
import { defaultServiceProvider, ServiceProvider } from "../ServiceProvider/serviceProvider"
import { defaultUser, User } from "../../Others/User/user"
const i18n = createI18n<[DefaultLocaleMessageSchema], 'ar' | 'en'>({
    locale: 'ar',
    fallbackLocale: 'en',
    messages: messages
})


export interface ReservationCalendarSearchFilter {
    employee_id: number
    date_from: string
    date_to: string
}
export interface ReservationSearchFilter {
    customer_name?: string
    provider_name?: string
    service_name?: string
    cancellation_reason?: string
    status?: number
    page?: number
    per_page?: number
    order_by?: string
    order?: string
}
export interface Reservation {
    id: number
    customer: Customer
    service_provider: ServiceProvider
    date: string
    time_from: string
    time_to: string
    status: number
    cancellation_reason?: string
    created_at: string
    created_by: User
    can_decativate_cancel?: boolean
}


export interface ReservationCalendarReservation {
    id: number
    customer: Customer
    service_provider: ServiceProvider
    date: string
    time_from: string
    time_to: string
    status: number
    created_at: string
    can_decativate_cancel?: boolean
}

export interface ReservationCalendarDay {
    day_of_week: string
    date: string
    is_vacation_or_out_of_schedule: boolean
    is_past: boolean
    is_another_reservation: boolean
    can_reserve: boolean
    reservation?: ReservationCalendarReservation
}

export interface ReservationCalendar {
    time_from: string
    time_to: string
    days: ReservationCalendarDay[]
}
export interface CreateReservation {
    customer_id: number
    service_provider_id: number
    date: string
    time_from: string
    time_to: string
}
export interface CancelReservation {
    cancellation_reason?: string
}

export const defaultReservation: Reservation = {
    created_at: '',
    created_by: defaultUser,
    customer: defaultCustomer,
    date: '',
    id: 0,
    service_provider: defaultServiceProvider,
    status: 1,
    cancellation_reason: undefined,
    time_from: '',
    time_to: '',
    can_decativate_cancel: undefined
}
export const defaultReservationCalendar = <ReservationCalendar>{
    time_from: "",
    time_to: "",
    days: []
}
export const defaultReservationCalendarDay = <ReservationCalendarDay>{
    can_reserve: true,
    date: '',
    day_of_week: '',
    is_another_reservation: true,
    is_past: true,
    is_vacation_or_out_of_schedule: true,
    reservation: undefined,
}
export const defaultCreateReservation = <CreateReservation>{
    customer_id: 0,
    service_provider_id: 0,
    date: '',
    time_from: '',
    time_to: ''
}
export const defaultReservationCalendarReservation = <ReservationCalendarReservation>{
    created_at: '',
    customer: defaultCustomer,
    date: '',
    id: 0,
    service_provider: defaultServiceProvider,
    status: 1,
    time_from: '',
    time_to: '',
    can_decativate_cancel: undefined
}
export const defaultCancelReservation: CancelReservation = {
    cancellation_reason: undefined

}
export const defaultReservationSearchFilter = <ReservationSearchFilter>{}
export const defaultReservationCalendarSearchFilter = <ReservationCalendarSearchFilter>{}

class ReservationConsts {

    static readonly ACTIVE = 1;
    static readonly INACTIVE = 2;
    static readonly CANCELLED = 3;
    static readonly PAST = 4;

    public static getStatusName(status: number) {
        if (status == this.ACTIVE)
            return i18n.global.t('reservation_statuses.active')
        if (status == this.INACTIVE)
            return i18n.global.t('reservation_statuses.inactive')
        if (status == this.CANCELLED)
            return i18n.global.t('reservation_statuses.cancelled')
        if (status == this.PAST)
            return i18n.global.t('reservation_statuses.past')
        else return '';
    }
    public static getStatusColor(status: number) {
        if (status == this.ACTIVE)
            return 'primary'
        if (status == this.PAST)
            return 'warning'
        if (status == this.CANCELLED)
            return 'purple'
        if (status == this.INACTIVE)
            return 'danger'
        else return undefined;
    }


    public static getReservationIcon(is_vacation_or_out_of_schedule: boolean, is_past: boolean, is_another_reservation: boolean, can_reserve: boolean) {
        if (can_reserve)
            return 'fas fa-plus'
        if (is_another_reservation)
            return undefined
        if (is_past)
            return 'fas fa-archive'
        if (is_vacation_or_out_of_schedule)
            return 'fas fa-times'
        else return undefined;
    }
    public static getReservationColor(is_vacation_or_out_of_schedule: boolean, is_past: boolean, is_another_reservation: boolean, can_reserve: boolean, status: number | undefined) {
        if (can_reserve)
            return 'white'
        if (status == this.ACTIVE)
            return 'primary'
        if (status == this.PAST)
            return 'warning'
        if (is_past)
            return 'disabled'
        if (is_vacation_or_out_of_schedule)
            return 'disabled'
        else return 'white';
    }


}

export { ReservationConsts }
