import { AxiosInstance } from "axios"
import { CustomResponseCollection, CustomResponseSingle } from "/@src/utils/response"
import { CancelReservation, CreateReservation, ReservationCalendarSearchFilter, ReservationSearchFilter, TodayCustomerReservationData } from "/@src/models/Sales/Reservation/reservation"

export async function getReservationCalendarApi(
    api: AxiosInstance,
    filter: ReservationCalendarSearchFilter
): Promise<{ response: CustomResponseCollection }> {
    const { data: response, headers } = await api.get('reservation/getReservationCalendar', { params: filter })

    return { response }
}
export async function getReservationsListApi(
    api: AxiosInstance,
    filter: ReservationSearchFilter
): Promise<{ response: CustomResponseCollection }> {
    const { data: response, headers } = await api.get('reservation/getReservationsList', { params: filter })

    return { response }
}
export async function createReservationApi(
    api: AxiosInstance,
    reservation: CreateReservation
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.post('reservation', reservation)

    return { response }
}
export async function cancelReservationApi(
    api: AxiosInstance,
    reservationId: number,
    cancelReservationData: CancelReservation
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.put(`reservation/${reservationId}/cancelReservation`, cancelReservationData)

    return { response }
}
export async function deactivateReservationApi(
    api: AxiosInstance,
    reservationId: number
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.get(`reservation/${reservationId}/deactivateReservation`)

    return { response }
}
export async function getTodayCustomerReservationApi(
    api: AxiosInstance,
    getTodayCustomerReservationData: TodayCustomerReservationData
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.get(`reservation/getTodayCustomerReservation`, { params: getTodayCustomerReservationData })

    return { response }
}
