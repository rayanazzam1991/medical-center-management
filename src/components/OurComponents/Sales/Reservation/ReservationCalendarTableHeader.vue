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

export default defineComponent({
    props: {
        title: {
            type: String,
            default: '',
        },
        employee_id: {
            type: Number,
            default: 0,
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
        employees: {
            type: Array<Employee>,
            default: []
        }


    },
    setup(props, context) {
        const dark = useDarkmode();
        const settings = getSettingsFromStorage()
        const start_of_week = DateConsts.getDayOfWeekNumber(settings.find((setting) => setting.key == 'start_of_week')?.value ?? '') as 0 | 1 | 2 | 3 | 4 | 5 | 6
        const firstDayOfWeek = new Date(props.default_start_date_year, props.default_start_date_month - 1, props.default_start_date_day)
        const lastDayOfWeek = new Date(props.default_end_date_year, props.default_end_date_month - 1, props.default_end_date_day)
        const date = ref();

        if (props.is_first_time) {
            const settings = getSettingsFromStorage()
            const start_of_week = DateConsts.getDayOfWeekNumber(settings.find((setting) => setting.key == 'start_of_week')?.value ?? '') as 0 | 1 | 2 | 3 | 4 | 5 | 6
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
        const searchEmployeeId = ref(0)
        const searchEmployeeIdField = ref(0)
        searchFilter.value.employee_id = props.employee_id
        searchEmployeeId.value = props.employee_id
        searchEmployeeIdField.value = props.employee_id
        const keyIncrement = ref(0)
        const search = async (forEmployee: boolean) => {
            if (searchEmployeeIdField.value == searchEmployeeId.value && forEmployee)
                return
            else {
                searchEmployeeId.value = searchEmployeeIdField.value
                const date_from_not_formatted = new Date(date.value[0])
                const date_to_not_formatted = new Date(date.value[1])
                const localeDateFrom = date_from_not_formatted.toLocaleString()
                const localeDateTo = date_to_not_formatted.toLocaleString()
                const [monthFrom, dayFrom, yearFrom] = localeDateFrom.split(',')[0].split('/');
                const formattedDateFrom = `${yearFrom}-${monthFrom.padStart(2, '0')}-${dayFrom.padStart(2, '0')}`;
                const [monthTo, dayTo, yearTo] = localeDateTo.split(',')[0].split('/');
                const formattedDateTo = `${yearTo}-${monthTo.padStart(2, '0')}-${dayTo.padStart(2, '0')}`;
                searchFilter.value.date_from = formattedDateFrom
                searchFilter.value.date_to = formattedDateTo
                searchFilter.value.employee_id = searchEmployeeId.value
                const selectedEmployee = props.employees.find((employee) => employee.id == searchEmployeeId.value)
                context.emit('search', searchFilter.value, selectedEmployee)
            }

        }
        const resetFilter = () => {
            date.value = [firstDayOfWeek, lastDayOfWeek];
            searchFilter.value.date_from = firstDayOfWeek.toISOString()
            searchFilter.value.date_to = lastDayOfWeek.toISOString()
            searchFilter.value.employee_id = searchEmployeeId.value
            keyIncrement.value++
            context.emit('resetFilter', searchFilter.value)

        }
        return {
            dark,
            iconArrow,
            start_of_week,
            iconArrowForNote,
            searchEmployeeId,
            searchEmployeeIdField,
            locale,
            t,
            ReservationConsts,
            UserStatusConsts,
            DateConsts,
            keyIncrement,
            resetFilter,
            getEmployeesList,
            search,
            date
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

                    <h1 class="title">
                        {{ $props.title }}
                    </h1>
                    <div class="is-flex is-align-items-center">
                        <div class="column date-pricker-width pl-0">
                            <VControl>
                                <Multiselect v-model="searchEmployeeIdField" mode="single"
                                    :placeholder="t('reservation.calendar.search_filter.provider')" :close-on-select="true"
                                    ref="customer_id" @select="search(true)" :filter-results="false" :min-chars="0"
                                    :resolve-on-load="false" :infinite="true" :limit="20" :rtl="true" :max="1"
                                    :clear-on-search="true" :delay="0" :searchable="true" :canClear="false" :options="async (query: any) => {
                                            let employeeSearchFilter = {
                                                user_status_id: UserStatusConsts.ACTIVE,
                                                name: query,
                                                is_service_provider: true
                                            } as EmployeeSearchFilter
                                            //@ts-ignore
                                            const data = await getEmployeesList(employeeSearchFilter)
                                            //@ts-ignore
                                            return data.employees.map((employee: Employee) => {
                                                return { value: employee.id, label: employee.user.first_name + ' ' + employee.user.last_name }
                                            })
                                        }"
                                    @open="(select$: any) => { if (select$.noOptions) { select$.resolveOptions() } }" />
                            </VControl>
                        </div>

                        <div v-if="searchEmployeeId != 0" class="column date-pricker-width">
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
                        <VIconButton v-if="searchEmployeeId != 0" :raised="false" class="mr-2" color="danger"
                            icon="feather:rotate-ccw" v-on:click="resetFilter" />

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
