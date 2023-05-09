<script lang="ts">
import { defaultUserStatusSearchFilter, UserStatus, UserStatusConsts } from '/@src/models/Others/UserStatus/userStatus'
import { getUserStatusesList } from '/@src/services/Others/UserStatus/userstatusService'
import { defaultPagination } from '/@src/utils/response'
import {
    AttendanceConsts,
    defaultEmployeeAttendanceSearchFilter,
    EmployeeAttendanceSearchFilter
} from '/@src/models/HR/Attendance/EmployeeAttendance/employeeAttendance'
import { DateConsts } from '/@src/models/HR/Attendance/Date/date'
import { getDaysPerMonth } from '/@src/services/HR/Attendance/Date/dateService'
import { useI18n } from 'vue-i18n'
import { isNumber } from '/@src/composable/helpers/isNumberCheck'
import Datepicker from '@vuepic/vue-datepicker';
import { useDarkmode } from '/@src/stores/darkmode';
import { defaultReservationCalendarSearchFilter, ReservationConsts } from '/@src/models/Sales/Reservation/reservation'
import { getSettingsFromStorage } from '/@src/services/Others/Setting/settingService'
import { EmployeeSearchFilter } from '/@src/models/Employee/employee'
import { getEmployeesList } from '/@src/services/Employee/employeeService'
import { Employee } from '/@src/models/Employee/employee'
import { defaultServiceWithProvider, ServiceWithProvider } from '/@src/models/Others/Service/service'
import { defaultServiceProvider } from '/@src/models/Sales/ServiceProvider/serviceProvider'

export default defineComponent({
    props: {
        service_provider: {
            default: defaultServiceProvider,
        },
        service: {
            default: defaultServiceWithProvider
        },
        default_start_date_year: {
            type: Number,
            default: 0
        },
        default_start_date_month: {
            type: Number,
            default: 0
        },
        default_start_date_day: {
            type: Number,
            default: 1
        },
        default_end_date_year: {
            type: Number,
            default: 0
        },
        default_end_date_month: {
            type: Number,
            default: 0
        },
        default_end_date_day: {
            type: Number,
            default: 1
        },
        is_first_time: {
            type: Boolean,
            default: true
        },
        start_date: {
            type: String,
            default: ''
        },
        end_date: {
            type: String,
            default: ''
        },
        servicesWithProviders: {
            type: Array<ServiceWithProvider>,
            default: []
        }


    },
    setup(props, context) {
        const dark = useDarkmode();
        const loading = ref(false)
        const settings = getSettingsFromStorage()
        const start_of_week = DateConsts.getDayOfWeekNumber(settings.find((setting) => setting.key == 'start_of_week')?.value ?? '') as 0 | 1 | 2 | 3 | 4 | 5 | 6
        const firstDayOfWeek = new Date(props.default_start_date_year, props.default_start_date_month - 1, props.default_start_date_day)
        const lastDayOfWeek = new Date(props.default_end_date_year, props.default_end_date_month - 1, props.default_end_date_day)
        const date = ref();

        if (props.is_first_time) {
            loading.value = true
            const firstDayOfWeek = new Date(props.default_start_date_year, props.default_start_date_month - 1, props.default_start_date_day)
            const lastDayOfWeek = new Date(props.default_end_date_year, props.default_end_date_month - 1, props.default_end_date_day)
            date.value = [firstDayOfWeek, lastDayOfWeek]
        }
        else {
            const startDate = new Date(props.start_date)
            const endDate = new Date(props.end_date)
            date.value = [startDate, endDate]
        }

        const { t, locale } = useI18n()
        const iconArrow = locale.value == "ar" ? { left: "lnir lnir-chevron-right", right: "lnir lnir-chevron-left" } : { left: "lnir lnir-chevron-left", right: "lnir lnir-chevron-right" }
        const iconArrowForNote = locale.value == "ar" ? { left: "fas fa-long-arrow-alt-right", right: "fas fa-long-arrow-alt-left" } : { left: "fas fa-long-arrow-alt-left", right: "fas fa-long-arrow-alt-right" }
        const searchFilter = ref(defaultReservationCalendarSearchFilter)
        const searchServiceId = ref(0)
        const searchServiceProviderId = ref(0)
        const searchServiceProviderIdField = ref(0)
        searchServiceProviderId.value = props.service_provider.id
        searchServiceProviderIdField.value = props.service_provider.id
        searchServiceId.value = props.service.id
        searchFilter.value.employee_id = props.service_provider.provider.id ?? 0
        const keyIncrement = ref(0)
        const search = async (forEmployee: boolean) => {
            if (searchServiceProviderIdField.value == searchServiceProviderId.value && forEmployee)
                return
            if (searchServiceProviderIdField.value == 0) {
                clearServiceProvider()
            }
            else {
                searchServiceProviderId.value = searchServiceProviderIdField.value
                const date_from_not_formatted = new Date(date.value[0])
                const date_to_not_formatted = new Date(date.value[1])
                const localeDateFrom = date_from_not_formatted.toLocaleString()
                const localeDateTo = date_to_not_formatted.toLocaleString()
                const [monthFrom, dayFrom, yearFrom] = localeDateFrom.split(',')[0].split('/');
                const formattedDateFrom = `${yearFrom}-${monthFrom.padStart(2, '0')}-${dayFrom.padStart(2, '0')}`;
                const [monthTo, dayTo, yearTo] = localeDateTo.split(',')[0].split('/');
                const formattedDateTo = `${yearTo}-${monthTo.padStart(2, '0')}-${dayTo.padStart(2, '0')}`;
                const selectedService = props.servicesWithProviders.find((service) => service.id == searchServiceId.value)
                const selectedServiceProvider = selectedService?.providers.find((provider) => provider.id == searchServiceProviderId.value)
                const selectedEmployee = selectedServiceProvider?.provider
                searchFilter.value.date_from = formattedDateFrom
                searchFilter.value.date_to = formattedDateTo
                searchFilter.value.employee_id = selectedEmployee?.id ?? 0
                context.emit('search', searchFilter.value, selectedService, selectedServiceProvider)
            }

        }
        const clearServiceProvider = () => {
            searchServiceProviderId.value = 0
            searchServiceProviderIdField.value = 0
            context.emit('clearServiceProvider')

        }
        const resetFilter = () => {
            date.value = [firstDayOfWeek, lastDayOfWeek];
            const [firstMonth, firstDay, firstYear] = firstDayOfWeek.toLocaleDateString().split('/')
            const [lastMonth, lastDay, lastYear] = lastDayOfWeek.toLocaleDateString().split('/')
            const formattedFirst = `${firstYear}-${firstMonth.padStart(2, '0')}-${firstDay.padStart(2, '0')}`;
            const formattedLast = `${lastYear}-${lastMonth.padStart(2, '0')}-${lastDay.padStart(2, '0')}`;
            searchFilter.value.date_from = formattedFirst
            searchFilter.value.date_to = formattedLast
            keyIncrement.value++
            context.emit('resetFilter', searchFilter.value)

        }
        return {
            dark,
            iconArrow,
            start_of_week,
            iconArrowForNote,
            searchServiceProviderId,
            searchServiceProviderIdField,
            searchServiceId,
            locale,
            t,
            ReservationConsts,
            UserStatusConsts,
            DateConsts,
            keyIncrement,
            resetFilter,
            getEmployeesList,
            clearServiceProvider,
            search,
            date,
            loading
        }

    },
    components: { Datepicker },
})
</script>

<template>
    <form class="form-layout">
        <div class="form-outer">
            <div class="form-header stuck-header">
                <div class="is-flex is-justify-content-space-between">
                    <div class="is-flex is-align-items-center">
                        <div class="column date-pricker-width py-4 pr-0">
                            <VField>
                                <VControl>
                                    <div class="select">
                                        <select v-model="searchServiceId" @change="clearServiceProvider">
                                            <option :value="0"> {{ t('reservation.calendar.search_filter.select_service')
                                            }}</option>
                                            <option v-for="service in servicesWithProviders" :value="service.id">
                                                {{ service.name }}
                                            </option>
                                        </select>
                                    </div>

                                </VControl>
                            </VField>
                        </div>
                        <div class="column date-pricker-width px-0 py-4">
                            <VField>
                                <VControl>
                                    <div class="select">
                                        <select v-model="searchServiceProviderIdField" @change="search(true)">
                                            <option :value="0"> {{ t('reservation.calendar.search_filter.select_provider')
                                            }}</option>
                                            <option
                                                v-for="serviceProvider in servicesWithProviders.find((service) => service.id == searchServiceId)?.providers"
                                                :value="serviceProvider.id">
                                                {{ serviceProvider.provider.user.first_name }} {{
                                                    serviceProvider.provider.user.last_name }}
                                            </option>
                                        </select>
                                    </div>
                                </VControl>
                            </VField>
                        </div>

                        <div class="column date-pricker-width">
                            <Datepicker v-model="date" :cancel-text="t('date_picker.cancel')" :locale="locale" week-picker
                                :day-names="DateConsts.WEEK_DAYS_NAMES_ABBR" :clearable="false" :week-start="start_of_week"
                                auto-apply :select-text="t('date_picker.select')" class="date-picker-dircetion"
                                :dark="dark.isDark" @update:model-value="search(false)">
                                <template #arrow-left>
                                    <i :class="iconArrow.left" aria-hidden="true"></i>
                                </template>
                                <template #arrow-right>
                                    <i :class="iconArrow.right" aria-hidden="true"></i>
                                </template>
                            </Datepicker>
                        </div>
                        <VIconButton :raised="false" class="mr-2" color="danger" icon="feather:rotate-ccw"
                            v-on:click="resetFilter" />
                        <div v-if="loading" class="loader is-loading mr-3 w35-h35">
                        </div>

                    </div>

                </div>
                <h6 class="is-size-7 mt-0">
                    <span class="ml-1 has-text-info">{{ t('reservation.calendar.search_filter.note') }} </span>
                    <i class="fas fa-archive" aria-hidden="true"></i>
                    <i class="icon-margin" :class="iconArrowForNote.right" aria-hidden="true"></i>
                    {{ t('reservation.calendar.search_filter.archive') }} &nbsp; | &nbsp;
                    <i class="fas fa-times" aria-hidden="true"></i>
                    <i class="icon-margin" :class="iconArrowForNote.right" aria-hidden="true"></i>
                    {{ t('reservation.calendar.search_filter.vacation_or_out_of_sechdule') }} &nbsp; | &nbsp;
                    <i class="fas fa-plus" aria-hidden="true"></i>
                    <i class="icon-margin" :class="iconArrowForNote.right" aria-hidden="true"></i>
                    {{ t('reservation.calendar.search_filter.add_reservation') }} &nbsp; | &nbsp;
                    <i class="fas fa-square-full has-text-primary" aria-hidden="true"></i>
                    <i class="icon-margin" :class="iconArrowForNote.right" aria-hidden="true"></i>
                    {{ t('reservation.calendar.search_filter.active_reservation') }} &nbsp; | &nbsp;
                    <i class="fas fa-square-full has-text-warning" aria-hidden="true"></i>
                    <i class="icon-margin" :class="iconArrowForNote.right" aria-hidden="true"></i>
                    {{ t('reservation.calendar.search_filter.past_reservation') }}
                </h6>

            </div>
        </div>
    </form>
</template>

<style scoped lang="scss" >
@import '/@src/scss/styles/tableHeader.scss';
@import '@vuepic/vue-datepicker/dist/main.css';
@import '/@src/scss/styles/customDatePicker.scss';

.title {
    font-family: var(--font-alt);
    font-size: 1.25rem;
    margin-top: 1rem;

}

.icon-margin {
    margin-right: 5px !important;
}

.date-pricker-width {
    width: 270px;
}
</style>
