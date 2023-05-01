<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "permissions": [
            "reservation_list"
        ]
    }
}
</route>     
<script setup lang="ts">
import { useHead } from '@vueuse/head';
import ReservationTableCell from '/@src/components/OurComponents/Sales/Reservation/ReservationTableCell.vue';
import { useNotyf } from '/@src/composable/useNotyf';
import { getEmployeesList } from '/@src/services/Employee/employeeService';
import { getSettingsFromStorage } from '/@src/services/Others/Setting/settingService';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { getCurrentWeekStartAndEnd, getWeekDays } from '/@src/services/HR/Attendance/Date/dateService';
import { Notyf } from 'notyf';
import { useI18n } from 'vue-i18n';
import { useDarkmode } from '/@src/stores/darkmode';
import { ReservationCalendar, ReservationCalendarSearchFilter, defaultReservationCalendarSearchFilter, defaultReservationCalendar, defaultReservationCalendarDay, defaultCreateReservation, ReservationCalendarReservation, defaultReservationCalendarReservation, defaultCancelReservation } from '/@src/models/Sales/Reservation/reservation';
import { getReservationCalendar, createReservation, deactivateReservation, cancelReservation } from '/@src/services/Sales/Reservation/reservationService';
import { ReservationConsts } from '/@src/models/Sales/Reservation/reservation';
import { Employee, EmployeeSearchFilter, EmployeeService, defaultEmployee } from '/@src/models/Employee/employee';
import { ReservationCalendarDay } from '/@src/models/Sales/Reservation/reservation';
import { UserStatusConsts } from '/@src/models/Others/UserStatus/userStatus';
import { Customer, CustomerSearchFilter } from '/@src/models/CRM/Customer/customer';
import { getCustomersList } from '/@src/services/CRM/Customer/customerService';
import { Service, ServiceWithProvider, defaultServiceWithProvider } from '/@src/models/Others/Service/service';
import { getServicesWithProviders } from '/@src/services/Others/Service/serviceService';
import { ServiceProvider, defaultServiceProvider } from '/@src/models/Sales/ServiceProvider/serviceProvider';
import { checkPermission } from '/@src/composable/checkPermission';
import { Permissions } from '/@src/utils/consts/rolesPermissions';

const { t } = useI18n()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle(t('reservation.calendar.table.title'))
useHead({
    title: t('reservation.calendar.table.title'),
})
const notif = useNotyf() as Notyf
const searchFilter = ref<ReservationCalendarSearchFilter>(defaultReservationCalendarSearchFilter)
const reservationCalendarList = ref<Array<ReservationCalendar>>([])
const route = useRoute()
const keyIncrement = ref(0)
const keyIncrement2 = ref(0)
const keyIncrement3 = ref(0)
const addReservationPopup = ref(false)
const reservationDetailsPopup = ref(false)
const cancelReservationPopup = ref(false)
const employeeId = ref(0)
const title = ref(t('reservation.calendar.table.header_title'))
const defaultStartDateYear = ref()
const defaultStartDateMonth = ref()
const defaultStartDateDay = ref()
const defaultEndDateYear = ref()
const defaultEndDateMonth = ref()
const defaultEndDateDay = ref()
const selectedServiceProvider = ref(defaultServiceProvider)
const selectedServiceWithProviders = ref(defaultServiceWithProvider)
const servicesWithProviders = ref<ServiceWithProvider[]>([]);
const selectedReservationCalendar = ref<ReservationCalendar>(defaultReservationCalendar)
const selectedReservationCalendarDay = ref<ReservationCalendarDay>(defaultReservationCalendarDay)
const selectedReservation = ref<ReservationCalendarReservation>(defaultReservationCalendarReservation)
const createReservationData = ref(defaultCreateReservation)
const cancelReservationData = ref(defaultCancelReservation)
const selectedServiceDuration = ref(0)
const selectedServicePrice = ref(0)
const createReservationTimeTo = ref('00:00')
const isFirstTime = ref(true)
searchFilter.value.employee_id = employeeId.value ?? 0
const loading = ref({ fetch: false, add: false, cancel: false, deactivate: false, header: false })

onMounted(async () => {
    loading.value.header = true
    const { current_week_start_and_end_date } = await getCurrentWeekStartAndEnd()
    const [yearStart, monthStart, dayStart] = current_week_start_and_end_date.start_date_of_week.split('-').map(Number);
    const [yearEnd, monthEnd, dayEnd] = current_week_start_and_end_date.end_date_of_week.split('-').map(Number);
    searchFilter.value.date_from = current_week_start_and_end_date.start_date_of_week
    searchFilter.value.date_to = current_week_start_and_end_date.end_date_of_week
    defaultStartDateYear.value = yearStart
    defaultStartDateMonth.value = monthStart
    defaultStartDateDay.value = dayStart
    defaultEndDateYear.value = yearEnd
    defaultEndDateMonth.value = monthEnd
    defaultEndDateDay.value = dayEnd
    const { services } = await getServicesWithProviders()
    servicesWithProviders.value = services
    loading.value.header = true
    keyIncrement.value++
    isFirstTime.value = false
})



const search = async (newSearchFilter: ReservationCalendarSearchFilter, serviceWithProvider: ServiceWithProvider, serviceProvider: ServiceProvider) => {
    loading.value.fetch = true
    const { reservations_calendar } = await getReservationCalendar(newSearchFilter)
    employeeId.value = newSearchFilter.employee_id

    selectedServiceProvider.value = serviceProvider
    selectedServiceWithProviders.value = serviceWithProvider
    reservationCalendarList.value = reservations_calendar
    createReservationData.value.service_provider_id = serviceProvider.id
    keyIncrement.value++
    searchFilter.value = newSearchFilter
    loading.value.fetch = false
}

const resetFilter = async (newSearchFilter: ReservationCalendarSearchFilter) => {
    searchFilter.value = newSearchFilter
    await search(searchFilter.value, selectedServiceWithProviders.value, selectedServiceProvider.value)
}
const clearServiceProvider = () => {
    reservationCalendarList.value = []

}
const updateTimeTo = () => {
    const settings = getSettingsFromStorage()
    const reservationTimeSlot = Number(settings.find((setting) => setting.key == 'reservations_time_slot')?.value ?? '1')
    if (selectedServiceWithProviders.value.duration_minutes) {
        let timeSlotNumber = Math.floor(selectedServiceWithProviders.value.duration_minutes / reservationTimeSlot)
        if ((selectedServiceWithProviders.value.duration_minutes % reservationTimeSlot) != 0) {
            timeSlotNumber = timeSlotNumber + 1
        }

        let date: Date = new Date('1970-01-01T' + selectedReservationCalendar.value.time_from + 'Z')
        date.setMinutes(date.getMinutes() + (timeSlotNumber * reservationTimeSlot));
        createReservationTimeTo.value = date.toISOString().substr(11, 5);
    }


}
const formatCreateReservationDate = () => {
    let [daySplit, monthSplit, yearSplit] = selectedReservationCalendarDay.value.date.split('/').map(Number)
    let date: Date = new Date(yearSplit, monthSplit - 1, daySplit)
    let formattedDateTemp: string = date.toLocaleDateString()
    const [month, day, year] = formattedDateTemp.split('/')
    const formattedDateFinal = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    return formattedDateFinal
}

const addReservation = async () => {
    if (createReservationData.value.customer_id == 0) {
        notif.error({ message: t('toast.error.reservation.customer_is_required'), duration: 3000 })
        return
    }
    loading.value.add = true
    createReservationData.value.date = formatCreateReservationDate()
    createReservationData.value.time_from = selectedReservationCalendar.value.time_from
    createReservationData.value.time_to = createReservationTimeTo.value
    createReservationData.value.service_provider_id = selectedServiceProvider.value.id
    const { success, message } = await createReservation(createReservationData.value)
    if (success) {
        notif.success(t('toast.success.add'))
        await search(searchFilter.value, selectedServiceWithProviders.value, selectedServiceProvider.value)
        addReservationPopup.value = false
    } else {
        notif.error({ message: message, duration: 3000 })
    }
    loading.value.add = false
}
const resetAddReservation = () => {
    createReservationData.value.customer_id = 0
    createReservationData.value.date = ''
    createReservationData.value.service_provider_id = 0
    createReservationData.value.time_from = ''
    createReservationData.value.time_to = ''
    selectedServiceDuration.value = 0
    createReservationTimeTo.value = '00:00'

}
const deactivateReservationFunction = async () => {
    loading.value.deactivate = true
    const { success, message } = await deactivateReservation(selectedReservation.value.id)
    if (success) {
        notif.success(t('toast.success.deactivate_reservation'))
        await search(searchFilter.value, selectedServiceWithProviders.value, selectedServiceProvider.value)
        reservationDetailsPopup.value = false
    } else {
        notif.error({ message: message, duration: 3000 })
    }
    loading.value.deactivate = false
}
const cancelReservationFunction = async () => {
    if (cancelReservationData.value.cancellation_reason && cancelReservationData.value.cancellation_reason?.length > 255) {
        notif.error({ message: t('toast.error.reservation.cancellation_reason_too_long'), duration: 3000 })
        return
    }
    loading.value.cancel = true
    const { success, message } = await cancelReservation(selectedReservation.value.id, cancelReservationData.value)
    if (success) {
        notif.success(t('toast.success.cancel_reservation'))
        await search(searchFilter.value, selectedServiceWithProviders.value, selectedServiceProvider.value)
        cancelReservationPopup.value = false
    } else {
        notif.error({ message: message, duration: 3000 })
    }
    loading.value.cancel = false
}
const onCancelReservation = () => {
    cancelReservationData.value.cancellation_reason = undefined
    cancelReservationPopup.value = true
    reservationDetailsPopup.value = false
}

const columns = {
    "time": {
        align: 'center',
        label: t('reservation.calendar.table.columns.time'),
        grow: false,
        renderRow: (row: ReservationCalendar) =>
            h(
                ReservationTableCell, {
                time_title: row?.time_from + ' - ' + row?.time_to,
                titleSize: 'normal',
                color: 'white',
                is_main_card: true,
                clickable: false
            }
            ),

    },
    first_day: {
        align: 'center',
        renderHeader: () =>
            h("span", reservationCalendarList.value.length != 0 ? t(`dates.days.${reservationCalendarList.value[0]?.days[0].day_of_week.toLowerCase()}`) + ' ' + reservationCalendarList.value[0]?.days[0].date.substr(0, reservationCalendarList.value[0]?.days[0].date.lastIndexOf('/')) : '-'
            ),
        grow: false,
        renderRow: (row: ReservationCalendar) =>
            h(
                ReservationTableCell, {
                clickable: (row.days[0].reservation || row.days[0].can_reserve) ? true : false,
                titleSize: row.days[0].reservation ? 'normal' : 'medium',
                customer_name: row.days[0].reservation ? row.days[0].reservation.customer.user.first_name + ' ' + row.days[0].reservation.customer.user.last_name : undefined,
                service_name: row.days[0].reservation ? row.days[0].reservation.service_provider.service?.name : undefined,
                is_reserved: row.days[0].reservation ? true : false,
                icon: ReservationConsts.getReservationIcon(row.days[0].is_vacation_or_out_of_schedule, row.days[0].is_past, row.days[0].is_another_reservation, row.days[0].can_reserve),
                color: ReservationConsts.getReservationColor(row.days[0].is_vacation_or_out_of_schedule, row.days[0].is_past, row.days[0].is_another_reservation, row.days[0].can_reserve, row.days[0].reservation?.status),
                onClick: () => {
                    if (row.days[0].can_reserve) {
                        resetAddReservation()
                        addReservationPopup.value = true
                        selectedReservationCalendar.value = row
                        selectedReservationCalendarDay.value = row.days[0]
                        updateTimeTo()
                        keyIncrement2.value++
                    } else if (row.days[0].reservation) {
                        reservationDetailsPopup.value = true
                        selectedReservation.value = row.days[0].reservation
                        selectedReservationCalendarDay.value = row.days[0]
                        keyIncrement3.value++
                    }
                }
            }
            ),

    },
    second_day: {
        align: 'center',
        renderHeader: () =>
            h("span", reservationCalendarList.value.length != 0 ? t(`dates.days.${reservationCalendarList.value[0]?.days[1].day_of_week.toLowerCase()}`) + ' ' + reservationCalendarList.value[0]?.days[1].date.substr(0, reservationCalendarList.value[1]?.days[1].date.lastIndexOf('/')) : '-'
            ),
        grow: false,
        renderRow: (row: ReservationCalendar) =>
            h(
                ReservationTableCell, {
                clickable: row.days[1].reservation || row.days[1].can_reserve ? true : false,
                titleSize: row.days[1].reservation ? 'normal' : 'medium',
                customer_name: row.days[1].reservation ? row.days[1].reservation.customer.user.first_name + ' ' + row.days[1].reservation.customer.user.last_name : undefined,
                service_name: row.days[1].reservation ? row.days[1].reservation.service_provider.service?.name : undefined,
                is_reserved: row.days[1].reservation ? true : false,
                icon: ReservationConsts.getReservationIcon(row.days[1].is_vacation_or_out_of_schedule, row.days[1].is_past, row.days[1].is_another_reservation, row.days[1].can_reserve),
                color: ReservationConsts.getReservationColor(row.days[1].is_vacation_or_out_of_schedule, row.days[1].is_past, row.days[1].is_another_reservation, row.days[1].can_reserve, row.days[1].reservation?.status),
                onClick: () => {
                    if (row.days[1].can_reserve) {
                        if (checkPermission(Permissions.RESERVATION_CREATE)) {
                            resetAddReservation()
                            addReservationPopup.value = true
                            selectedReservationCalendar.value = row
                            selectedReservationCalendarDay.value = row.days[1]
                            updateTimeTo()
                            keyIncrement2.value++
                        } else {
                            notif.error({ message: t('toast.error.no_permission'), duration: 3000 })
                        }
                    } else if (row.days[1].reservation) {
                        if (checkPermission(Permissions.RESERVATION_SHOW)) {
                            reservationDetailsPopup.value = true
                            selectedReservation.value = row.days[1].reservation
                            selectedReservationCalendarDay.value = row.days[1]
                            keyIncrement3.value++
                        } else {
                            notif.error({ message: t('toast.error.no_permission'), duration: 3000 })
                        }
                    }
                }

            }
            ),

    },
    third_day: {
        align: 'center',
        renderHeader: () =>
            h("span", reservationCalendarList.value.length != 0 ? t(`dates.days.${reservationCalendarList.value[0]?.days[2].day_of_week.toLowerCase()}`) + ' ' + reservationCalendarList.value[0]?.days[2].date.substr(0, reservationCalendarList.value[2]?.days[2].date.lastIndexOf('/')) : '-'
            ),
        grow: false,
        renderRow: (row: ReservationCalendar) =>
            h(
                ReservationTableCell, {
                clickable: row.days[2].reservation || row.days[2].can_reserve ? true : false,
                titleSize: row.days[2].reservation ? 'normal' : 'medium',
                customer_name: row.days[2].reservation ? row.days[2].reservation.customer.user.first_name + ' ' + row.days[2].reservation.customer.user.last_name : undefined,
                service_name: row.days[2].reservation ? row.days[2].reservation.service_provider.service?.name : undefined,
                is_reserved: row.days[2].reservation ? true : false,
                icon: ReservationConsts.getReservationIcon(row.days[2].is_vacation_or_out_of_schedule, row.days[2].is_past, row.days[2].is_another_reservation, row.days[2].can_reserve),
                color: ReservationConsts.getReservationColor(row.days[2].is_vacation_or_out_of_schedule, row.days[2].is_past, row.days[2].is_another_reservation, row.days[2].can_reserve, row.days[2].reservation?.status),
                onClick: () => {
                    if (row.days[2].can_reserve) {
                        if (checkPermission(Permissions.RESERVATION_CREATE)) {
                            resetAddReservation()
                            addReservationPopup.value = true
                            selectedReservationCalendar.value = row
                            selectedReservationCalendarDay.value = row.days[2]
                            updateTimeTo()
                            keyIncrement2.value++
                        } else {
                            notif.error({ message: t('toast.error.no_permission'), duration: 3000 })
                        }
                    } else if (row.days[2].reservation) {
                        if (checkPermission(Permissions.RESERVATION_SHOW)) {
                            reservationDetailsPopup.value = true
                            selectedReservation.value = row.days[2].reservation
                            selectedReservationCalendarDay.value = row.days[2]
                            keyIncrement3.value++
                        } else {
                            notif.error({ message: t('toast.error.no_permission'), duration: 3000 })
                        }
                    }
                }

            }
            ),

    },
    fourth_day: {
        align: 'center',
        renderHeader: () =>
            h("span", reservationCalendarList.value.length != 0 ? t(`dates.days.${reservationCalendarList.value[0]?.days[3].day_of_week.toLowerCase()}`) + ' ' + reservationCalendarList.value[0]?.days[3].date.substr(0, reservationCalendarList.value[3]?.days[3].date.lastIndexOf('/')) : '-'
            ),
        grow: false,
        renderRow: (row: ReservationCalendar) =>
            h(
                ReservationTableCell, {
                clickable: row.days[3].reservation || row.days[3].can_reserve ? true : false,
                titleSize: row.days[3].reservation ? 'normal' : 'medium',
                customer_name: row.days[3].reservation ? row.days[3].reservation.customer.user.first_name + ' ' + row.days[3].reservation.customer.user.last_name : undefined,
                service_name: row.days[3].reservation ? row.days[3].reservation.service_provider.service?.name : undefined,
                is_reserved: row.days[3].reservation ? true : false,
                icon: ReservationConsts.getReservationIcon(row.days[3].is_vacation_or_out_of_schedule, row.days[3].is_past, row.days[3].is_another_reservation, row.days[3].can_reserve),
                color: ReservationConsts.getReservationColor(row.days[3].is_vacation_or_out_of_schedule, row.days[3].is_past, row.days[3].is_another_reservation, row.days[3].can_reserve, row.days[3].reservation?.status),
                onClick: () => {
                    if (row.days[3].can_reserve) {
                        if (checkPermission(Permissions.RESERVATION_CREATE)) {
                            resetAddReservation()
                            addReservationPopup.value = true
                            selectedReservationCalendar.value = row
                            selectedReservationCalendarDay.value = row.days[3]
                            updateTimeTo()
                            keyIncrement2.value++
                        } else {
                            notif.error({ message: t('toast.error.no_permission'), duration: 3000 })
                        }
                    } else if (row.days[3].reservation) {
                        if (checkPermission(Permissions.RESERVATION_SHOW)) {
                            reservationDetailsPopup.value = true
                            selectedReservation.value = row.days[3].reservation
                            selectedReservationCalendarDay.value = row.days[3]
                            keyIncrement3.value++
                        } else {
                            notif.error({ message: t('toast.error.no_permission'), duration: 3000 })
                        }
                    }
                }

            }
            ),

    },
    fifth_day: {
        align: 'center',
        renderHeader: () =>
            h("span", reservationCalendarList.value.length != 0 ? t(`dates.days.${reservationCalendarList.value[0]?.days[4].day_of_week.toLowerCase()}`) + ' ' + reservationCalendarList.value[0]?.days[4].date.substr(0, reservationCalendarList.value[4]?.days[4].date.lastIndexOf('/')) : '-'
            ),
        grow: false,
        renderRow: (row: ReservationCalendar) =>
            h(
                ReservationTableCell, {
                clickable: row.days[4].reservation || row.days[4].can_reserve ? true : false,
                titleSize: row.days[4].reservation ? 'normal' : 'medium',
                customer_name: row.days[4].reservation ? row.days[4].reservation.customer.user.first_name + ' ' + row.days[4].reservation.customer.user.last_name : undefined,
                service_name: row.days[4].reservation ? row.days[4].reservation.service_provider.service?.name : undefined,
                is_reserved: row.days[4].reservation ? true : false,
                icon: ReservationConsts.getReservationIcon(row.days[4].is_vacation_or_out_of_schedule, row.days[4].is_past, row.days[4].is_another_reservation, row.days[4].can_reserve),
                color: ReservationConsts.getReservationColor(row.days[4].is_vacation_or_out_of_schedule, row.days[4].is_past, row.days[4].is_another_reservation, row.days[4].can_reserve, row.days[4].reservation?.status),
                onClick: () => {
                    if (row.days[4].can_reserve) {
                        if (checkPermission(Permissions.RESERVATION_CREATE)) {
                            resetAddReservation()
                            addReservationPopup.value = true
                            selectedReservationCalendar.value = row
                            selectedReservationCalendarDay.value = row.days[4]
                            updateTimeTo()
                            keyIncrement2.value++
                        } else {
                            notif.error({ message: t('toast.error.no_permission'), duration: 3000 })
                        }
                    } else if (row.days[4].reservation) {
                        if (checkPermission(Permissions.RESERVATION_SHOW)) {
                            reservationDetailsPopup.value = true
                            selectedReservation.value = row.days[4].reservation
                            selectedReservationCalendarDay.value = row.days[4]
                            keyIncrement3.value++
                        } else {
                            notif.error({ message: t('toast.error.no_permission'), duration: 3000 })
                        }
                    }
                }

            }
            ),

    },
    sixth_day: {
        align: 'center',
        renderHeader: () =>
            h("span", reservationCalendarList.value.length != 0 ? t(`dates.days.${reservationCalendarList.value[0]?.days[5].day_of_week.toLowerCase()}`) + ' ' + reservationCalendarList.value[0]?.days[5].date.substr(0, reservationCalendarList.value[5]?.days[5].date.lastIndexOf('/')) : '-'
            ),
        grow: false,
        renderRow: (row: ReservationCalendar) =>
            h(
                ReservationTableCell, {
                clickable: row.days[5].reservation || row.days[5].can_reserve ? true : false,
                titleSize: row.days[5].reservation ? 'normal' : 'medium',
                customer_name: row.days[5].reservation ? row.days[5].reservation.customer.user.first_name + ' ' + row.days[5].reservation.customer.user.last_name : undefined,
                service_name: row.days[5].reservation ? row.days[5].reservation.service_provider.service?.name : undefined,
                is_reserved: row.days[5].reservation ? true : false,
                icon: ReservationConsts.getReservationIcon(row.days[5].is_vacation_or_out_of_schedule, row.days[5].is_past, row.days[5].is_another_reservation, row.days[5].can_reserve),
                color: ReservationConsts.getReservationColor(row.days[5].is_vacation_or_out_of_schedule, row.days[5].is_past, row.days[5].is_another_reservation, row.days[5].can_reserve, row.days[5].reservation?.status),
                onClick: () => {
                    if (row.days[5].can_reserve) {
                        if (checkPermission(Permissions.RESERVATION_CREATE)) {
                            resetAddReservation()
                            addReservationPopup.value = true
                            selectedReservationCalendar.value = row
                            selectedReservationCalendarDay.value = row.days[5]
                            updateTimeTo()
                            keyIncrement2.value++
                        } else {
                            notif.error({ message: t('toast.error.no_permission'), duration: 3000 })
                        }
                    } else if (row.days[5].reservation) {
                        if (checkPermission(Permissions.RESERVATION_SHOW)) {
                            reservationDetailsPopup.value = true
                            selectedReservation.value = row.days[5].reservation
                            selectedReservationCalendarDay.value = row.days[5]
                            keyIncrement3.value++
                        } else {
                            notif.error({ message: t('toast.error.no_permission'), duration: 3000 })
                        }
                    }
                }

            }
            ),

    },
    seventh_day: {
        align: 'center',
        renderHeader: () =>
            h("span", reservationCalendarList.value.length != 0 ? t(`dates.days.${reservationCalendarList.value[0]?.days[6].day_of_week.toLowerCase()}`) + ' ' + reservationCalendarList.value[0]?.days[6].date.substr(0, reservationCalendarList.value[6]?.days[6].date.lastIndexOf('/')) : '-'
            ),
        grow: false,
        renderRow: (row: ReservationCalendar) =>
            h(
                ReservationTableCell, {
                clickable: row.days[6].reservation || row.days[6].can_reserve ? true : false,
                titleSize: row.days[6].reservation ? 'normal' : 'medium',
                customer_name: row.days[6].reservation ? row.days[6].reservation.customer.user.first_name + ' ' + row.days[6].reservation.customer.user.last_name : undefined,
                service_name: row.days[6].reservation ? row.days[6].reservation.service_provider.service?.name : undefined,
                is_reserved: row.days[6].reservation ? true : false,
                icon: ReservationConsts.getReservationIcon(row.days[6].is_vacation_or_out_of_schedule, row.days[6].is_past, row.days[6].is_another_reservation, row.days[6].can_reserve),
                color: ReservationConsts.getReservationColor(row.days[6].is_vacation_or_out_of_schedule, row.days[6].is_past, row.days[6].is_another_reservation, row.days[6].can_reserve, row.days[6].reservation?.status),
                can_reserve: row.days[6].is_vacation_or_out_of_schedule,
                onClick: () => {
                    if (row.days[6].can_reserve) {
                        if (checkPermission(Permissions.RESERVATION_CREATE)) {
                            resetAddReservation()
                            addReservationPopup.value = true
                            selectedReservationCalendar.value = row
                            selectedReservationCalendarDay.value = row.days[6]
                            updateTimeTo()
                            keyIncrement2.value++
                        } else {
                            notif.error({ message: t('toast.error.no_permission'), duration: 3000 })
                        }
                    } else if (row.days[6].reservation) {
                        if (checkPermission(Permissions.RESERVATION_SHOW)) {
                            reservationDetailsPopup.value = true
                            selectedReservation.value = row.days[6].reservation
                            selectedReservationCalendarDay.value = row.days[6]
                            keyIncrement3.value++
                        } else {
                            notif.error({ message: t('toast.error.no_permission'), duration: 3000 })
                        }
                    }
                }
            }
            ),

    },
} as const
</script>
    
<template>
    <ReservationCalendarTableHeader :key="keyIncrement" :title="title" :employee_id="employeeId"
        :default_start_date_day="defaultStartDateDay" :default_start_date_month="defaultStartDateMonth"
        :default_start_date_year="defaultStartDateYear" :default_end_date_day="defaultEndDateDay"
        :default_end_date_month="defaultEndDateMonth" :default_end_date_year="defaultEndDateYear"
        :start_date="searchFilter.date_from" :end_date="searchFilter.date_to" :is_first_time="isFirstTime"
        :service_provider="selectedServiceProvider" :services-with-providers="servicesWithProviders"
        :service="selectedServiceWithProviders" @resetFilter="resetFilter" @search="search"
        @clearServiceProvider="clearServiceProvider" />
    <VFlexTableWrapper :key="keyIncrement" :columns="columns" :data="reservationCalendarList">

        <VFlexTable clickable>
            <template #body>
                <div v-if="loading.fetch" class="flex-list-inner">
                    <div v-for="key in 10" :key="key" class="flex-table-item">
                        <VFlexTableCell>
                            <VPlaceload />
                        </VFlexTableCell>

                    </div>
                </div>
                <div v-else-if="reservationCalendarList.length === 0" class="flex-list-inner">
                    <VPlaceholderSection :title="t('reservation.calendar.table.placeholder.title')" class="my-6">
                    </VPlaceholderSection>
                </div>

            </template>
        </VFlexTable>
    </VFlexTableWrapper>
    <VModal :key="keyIncrement2" :title="t('reservation.calendar.table.add_reservation_modal.title')"
        :open="addReservationPopup" actions="right" @close="addReservationPopup = false">
        <template #content>
            <div class="form-fieldset">
                <div class="columns is-multiline">
                    <div class="column is-12">
                        <VField class="column">
                            <VLabel class="required">{{ t('reservation.calendar.table.add_reservation_modal.customer') }}
                            </VLabel>
                            <VControl>
                                <Multiselect v-model="createReservationData.customer_id" mode="single"
                                    :placeholder="t('reservation.calendar.table.add_reservation_modal.customer')"
                                    :close-on-select="true" ref="customer_id" :filter-results="false" :min-chars="0"
                                    :resolve-on-load="false" :infinite="true" :limit="20" :rtl="true" :max="1"
                                    :clear-on-search="true" :delay="0" :searchable="true" :canClear="false" :options="async (query: any) => {
                                            let customerSearchFilter: CustomerSearchFilter = {
                                                user_status_id: UserStatusConsts.ACTIVE,
                                                name: query,
                                            }
                                            // @ts-ignore
                                            const data = await getCustomersList(customerSearchFilter)
                                            // @ts-ignore
                                            return data.customers.map((customer: Customer) => {
                                                return { value: customer.id, label: customer.user.first_name + ' ' + customer.user.last_name }
                                            })
                                        }"
                                    @open="(select$: any) => { if (select$.noOptions) { select$.resolveOptions() } }" />
                            </VControl>
                        </VField>
                        <div class="column">
                            <p> {{ t('reservation.calendar.table.add_reservation_modal.service') }} :
                                <span class="has-text-primary">
                                    {{ selectedServiceWithProviders.name }}
                                </span>
                            </p>
                            <p class="help is-info mt-3">
                                {{ t('reservation.calendar.table.add_reservation_modal.service_duration') }} :
                                {{ selectedServiceWithProviders.duration_minutes }}
                                {{ t('reservation.calendar.table.add_reservation_modal.minutes') }}
                            </p>
                            <p class="help is-info mt-0">
                                {{ t('reservation.calendar.table.add_reservation_modal.service_price') }} :
                                {{ selectedServiceProvider.price }}
                            </p>

                        </div>
                        <div class="column">
                            <p> {{ t('reservation.calendar.table.add_reservation_modal.date') }} :
                                <span class="has-text-primary">

                                    {{ t(`dates.days.${selectedReservationCalendarDay.day_of_week.toLowerCase()}`) }}
                                    {{ selectedReservationCalendarDay.date }}
                                </span>
                            </p>
                        </div>
                        <div class="column">
                            <p> {{ t('reservation.calendar.table.add_reservation_modal.time') }} :
                                {{ t('reservation.calendar.table.add_reservation_modal.from') }}
                                <span class="has-text-primary">
                                    {{ selectedReservationCalendar.time_from }}
                                </span>
                                {{ t('reservation.calendar.table.add_reservation_modal.to') }}
                                <span class="has-text-primary">
                                    {{ createReservationTimeTo }}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template #action="{ close }">
            <VButton color="primary" :loading="loading.add" raised @click="addReservation()">{{ t('modal.buttons.confirm')
            }}</VButton>
        </template>
    </VModal>
    <VModal :key="keyIncrement3" :title="t('reservation.calendar.table.reservation_details_modal.title')"
        :close-button="selectedReservation.can_decativate_cancel && checkPermission(Permissions.RESERVATION_EDIT) ? false : true"
        :open="reservationDetailsPopup" actions="right" @close="reservationDetailsPopup = false">
        <template #content>
            <div class="form-fieldset">
                <div class="columns is-multiline">
                    <div class="column is-12">
                        <div class="column">
                            <p> {{ t('reservation.calendar.table.reservation_details_modal.customer') }} :
                                <span class="has-text-primary">
                                    {{ selectedReservation.customer.user.first_name }}
                                    {{ selectedReservation.customer.user.last_name }}
                                </span>
                            </p>
                        </div>
                        <div class="column">
                            <p> {{ t('reservation.calendar.table.reservation_details_modal.provider') }} :
                                <span class="has-text-primary">
                                    {{ selectedReservation.service_provider.provider.user.first_name }}
                                    {{ selectedReservation.service_provider.provider.user.last_name }}
                                </span>
                            </p>
                        </div>
                        <div class="column">
                            <p> {{ t('reservation.calendar.table.reservation_details_modal.service') }} :
                                <span class="has-text-primary">
                                    {{ selectedReservation.service_provider.service?.name }}
                                </span>
                            </p>
                        </div>
                        <div class="column">
                            <p> {{ t('reservation.calendar.table.reservation_details_modal.service_price') }} :
                                <span class="has-text-primary">
                                    {{ selectedReservation.service_provider.price }}
                                </span>
                            </p>
                        </div>
                        <div class="column">
                            <p> {{ t('reservation.calendar.table.reservation_details_modal.date') }} :
                                <span class="has-text-primary">

                                    {{ t(`dates.days.${selectedReservationCalendarDay.day_of_week.toLowerCase()}`) }}
                                    {{ selectedReservationCalendarDay.date }}
                                </span>
                            </p>
                        </div>
                        <div class="column">
                            <p> {{ t('reservation.calendar.table.reservation_details_modal.time') }} :
                                {{ t('reservation.calendar.table.reservation_details_modal.from') }}
                                <span class="has-text-primary">
                                    {{ selectedReservation.time_from }}
                                </span>
                                {{ t('reservation.calendar.table.reservation_details_modal.to') }}
                                <span class="has-text-primary">
                                    {{ selectedReservation.time_to }}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template #action="{ close }">
            <VButton v-permission="Permissions.RESERVATION_EDIT" v-if="selectedReservation.can_decativate_cancel"
                :disabled="loading.deactivate" color="danger" raised @click="onCancelReservation">
                {{ t('modal.buttons.cancel_reservation') }}
            </VButton>
            <VIconButton v-permission="Permissions.RESERVATION_EDIT" v-if="selectedReservation.can_decativate_cancel"
                :disabled="loading.cancel" icon="fas fa-trash" color="danger" outlined :loading="loading.deactivate" raised
                @click="deactivateReservationFunction()" />
        </template>
    </VModal>
    <VModal :title="t('reservation.cancel_reservation_modal.title')" :open="cancelReservationPopup" actions="center"
        @close="cancelReservationPopup = false">
        <template #content>
            <VField class="column">
                <VLabel>{{ t('reservation.cancel_reservation_modal.cancellation_reason') }}
                </VLabel>
                <VControl>
                    <VTextarea v-model="cancelReservationData.cancellation_reason" class="is-primary-focus" rows="2"
                        :placeholder="t('reservation.cancel_reservation_modal.cancellation_reason_placeholder')" />
                </VControl>
            </VField>
            <VPlaceholderSection :title="t('reservation.cancel_reservation_modal.caution')"
                :subtitle="t('reservation.cancel_reservation_modal.subtitle')" />
        </template>
        <template #action="{ close }">
            <VButton :loading="loading.cancel" color="primary" raised @click="cancelReservationFunction">{{
                t('modal.buttons.confirm')
            }}</VButton>
        </template>
    </VModal>
</template>
<style  lang="scss">
@import '@vuepic/vue-datepicker/dist/main.css';
@import '/@src/scss/styles/customDatePicker.scss';

.is-clickable {
    cursor: default !important;
}
</style>
    