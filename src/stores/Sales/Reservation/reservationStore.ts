import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { Pagination, defaultPagination } from "/@src/utils/response"
import { CancelReservation, CreateReservation, Reservation, ReservationCalendar, ReservationCalendarSearchFilter, ReservationSearchFilter } from "/@src/models/Sales/Reservation/reservation"
import { cancelReservationApi, createReservationApi, deactivateReservationApi, getReservationCalendarApi, getReservationsListApi } from "/@src/utils/api/Sales/Reservation"


export const useReservation = defineStore('reservation', () => {
    const api = useApi()
    const loading = ref(false)
    const success = ref<boolean>()
    const error_code = ref<string>()
    const message = ref<string>()
    const reservationsList = ref<Reservation[]>([])
    const reservationCalendar = ref<ReservationCalendar[]>([])
    const pagination = ref<Pagination>(defaultPagination)

    async function getReservationCalendarStore(filter: ReservationCalendarSearchFilter) {
        if (loading.value) return

        loading.value = true

        try {
            const returnedResponse = await getReservationCalendarApi(api, filter)
            success.value = returnedResponse.response.success
            error_code.value = returnedResponse.response.error_code
            message.value = returnedResponse.response.message
            reservationCalendar.value = returnedResponse.response.data
        } catch (error: any) {
            success.value = error?.response.data.success
            error_code.value = error?.response.data.error_code
            message.value = error?.response.data.message
        }
        finally {
            loading.value = false
        }
    }
    async function getReservationsListStore(searchFilter: ReservationSearchFilter) {
        if (loading.value) return

        loading.value = true

        try {
            const returnedResponse = await getReservationsListApi(api, searchFilter)
            pagination.value = returnedResponse.response.pagination
            success.value = returnedResponse.response.success
            error_code.value = returnedResponse.response.error_code
            message.value = returnedResponse.response.message
            reservationsList.value = returnedResponse.response.data
        }
        catch (error: any) {
            success.value = error?.response.data.success
            error_code.value = error?.response.data.error_code
            message.value = error?.response.data.message

        }
        finally {
            loading.value = false
        }
    }

    async function createReservationStore(reservation: CreateReservation) {
        if (loading.value) return

        loading.value = true

        try {
            const returnedResponse = await createReservationApi(api, reservation)
            success.value = returnedResponse.response.success
            error_code.value = returnedResponse.response.error_code
            message.value = returnedResponse.response.message
        } catch (error: any) {
            success.value = error?.response.data.success
            error_code.value = error?.response.data.error_code
            message.value = error?.response.data.message
        }
        finally {
            loading.value = false
        }
    }
    async function deactivateReservationStore(reservationId: number) {
        if (loading.value) return
        loading.value = true

        try {
            const returnedResponse = await deactivateReservationApi(api, reservationId)
            success.value = returnedResponse.response.success
            error_code.value = returnedResponse.response.error_code
            message.value = returnedResponse.response.message
        } catch (error: any) {
            success.value = error?.response.data.success
            error_code.value = error?.response.data.error_code
            message.value = error?.response.data.message
        }
        finally {
            loading.value = false
        }
    }
    async function cancelReservationStore(reservationId: number, cancelReservationData: CancelReservation) {
        if (loading.value) return
        loading.value = true

        try {
            const returnedResponse = await cancelReservationApi(api, reservationId, cancelReservationData)
            success.value = returnedResponse.response.success
            error_code.value = returnedResponse.response.error_code
            message.value = returnedResponse.response.message
        } catch (error: any) {
            success.value = error?.response.data.success
            error_code.value = error?.response.data.error_code
            message.value = error?.response.data.message
        }
        finally {
            loading.value = false
        }
    }


    return {
        success,
        error_code,
        message,
        loading,
        pagination,
        reservationCalendar,
        reservationsList,
        getReservationCalendarStore,
        createReservationStore,
        deactivateReservationStore,
        cancelReservationStore,
        getReservationsListStore
    } as const
})

/**
 * Pinia supports Hot Module replacement so you can edit your stores and
 * interact with them directly in your app without reloading the page.
 *
 * @see https://pinia.esm.dev/cookbook/hot-module-replacement.html
 * @see https://vitejs.dev/guide/api-hmr.html
 */
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useReservation, import.meta.hot))
}
