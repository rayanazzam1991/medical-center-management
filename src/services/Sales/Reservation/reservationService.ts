import { CancelReservation, CreateReservation, Reservation, ReservationCalendarSearchFilter, ReservationSearchFilter, TodayCustomerReservationData } from "/@src/models/Sales/Reservation/reservation"
import { useReservation } from "/@src/stores/Sales/Reservation/reservationStore"
import { Pagination } from "/@src/utils/response"


export async function getReservationCalendar(filter: ReservationCalendarSearchFilter) {
    const reponse = useReservation()
    await reponse.getReservationCalendarStore(filter)
    const success: boolean = reponse.success ?? false
    const error_code: string = reponse.error_code ?? ''
    const message: string = reponse.message ?? ''
    const reservations_calendar = reponse.reservationCalendar
    return { success, error_code, message, reservations_calendar }

}
export async function createReservation(reservation: CreateReservation) {
    const reponse = useReservation()
    await reponse.createReservationStore(reservation)
    const success: boolean = reponse.success ?? false
    const error_code: string = reponse.error_code ?? ''
    const message: string = reponse.message ?? ''
    return { success, error_code, message }

}
export async function cancelReservation(reservationId: number, cancelReservationData: CancelReservation) {
    const reponse = useReservation()
    await reponse.cancelReservationStore(reservationId, cancelReservationData)
    const success: boolean = reponse.success ?? false
    const error_code: string = reponse.error_code ?? ''
    const message: string = reponse.message ?? ''
    return { success, error_code, message }

}
export async function deactivateReservation(reservationId: number) {
    const reponse = useReservation()
    await reponse.deactivateReservationStore(reservationId)
    const success: boolean = reponse.success ?? false
    const error_code: string = reponse.error_code ?? ''
    const message: string = reponse.message ?? ''
    return { success, error_code, message }

}
export async function getReservationsList(searchFilter: ReservationSearchFilter) {
    const reponse = useReservation()
    await reponse.getReservationsListStore(searchFilter)
    let reservations: Reservation[] = reponse.reservationsList
    let pagination: Pagination = reponse.pagination
    let success: boolean = reponse.success ?? false
    let error_code: string = reponse.error_code ?? ''
    let message: string = reponse.message ?? ''

    return { reservations, pagination, success, error_code, message }

}
export async function getTodayCustomerReservation(data: TodayCustomerReservationData) {
    const reponse = useReservation()
    await reponse.getTodayCustomerReservationStore(data)
    let reservations: Reservation[] = reponse.todayCustomerReservation
    let success: boolean = reponse.success ?? false
    let error_code: string = reponse.error_code ?? ''
    let message: string = reponse.message ?? ''

    return { reservations, success, error_code, message }

}
