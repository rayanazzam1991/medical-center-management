<script lang="ts">
import { EmployeeSearchFilter } from '/@src/models/Employee/employee'
import { UserStatus, defaultUserStatusSearchFilter } from '/@src/models/Others/UserStatus/userStatus'
import { getUserStatusesList } from '/@src/services/Others/UserStatus/userstatusService'
import { defaultPagination } from '/@src/utils/response'
import { defaultEmployeeAttendanceSearchFilter, EmployeeAttendanceSearchFilter } from '/@src/models/HR/Attendance/EmployeeAttendance/employeeAttendance'
import { AttendanceConsts } from '/@src/models/HR/Attendance/EmployeeAttendance/employeeAttendance';
import { DateConsts, DaysPerMonth } from '/@src/models/HR/Attendance/Date/date'
import { getDaysPerMonth } from '/@src/services/HR/Attendance/Date/dateService'
import sleep from '/@src/utils/sleep'



export default defineComponent({
    props: {
        title: {
            type: String,
            default: '',
        },
        pagination: {
            default: defaultPagination,
        },
        default_per_page: {
            type: Number,
            default: 1,
        },
        selected_month: {
            type: String,
            default: '1',

        },
        selected_year: {
            type: String,
            default: '2023',
        },
        days_per_month: {
            type: Number,
            default: 28
        },
        current_year: {
            type: String,
            default: '1',

        },
        current_month: {
            type: String,
            default: '2023',
        },


    },


    setup(props, context) {
        const onOpen = () => {
            searchFilterPop.value = !searchFilterPop.value
            quickSearchField.value = ''
            context.emit('onOpen', searchFilterPop.value)
        }
        const popUpTrigger = (value: boolean) => {
            searchFilterPop.value = value
        }
        const selectedMonthDays = ref(28)

        const selectedYear = ref()
        const selectedMonth = ref()
        const daysPerMonth = ref()
        selectedMonth.value = props.selected_month
        selectedYear.value = props.selected_year
        const currentYear = props.current_year
        const currentMonth = props.current_month
        daysPerMonth.value = props.days_per_month

        const default_per_page = props.default_per_page
        const pagination = props.pagination
        const searchFilterPop = ref(false)
        const quickSearchField = ref('')
        const perPage = ref(pagination.per_page)
        const searchFilter = ref(defaultEmployeeAttendanceSearchFilter)
        const is_reseted = ref(false)
        const months = DateConsts.MONTHS
        const keyIncrement = ref(0)
        const quickSearch = async () => {
            if (quickSearchField.value != '') {

                searchFilter.value.name = quickSearchField.value
                if (isNumber(quickSearchField.value)) {
                    searchFilter.value.phone_number = Number(quickSearchField.value)
                }
                else {
                    searchFilter.value.phone_number = undefined
                }
                searchFilter.value.quick_search = true
            } else {
                searchFilter.value.phone_number = undefined
                searchFilter.value.name = undefined
                searchFilter.value.quick_search = undefined
            }
            searchFilter.value.per_page = perPage.value
            const { daysPerMonth } = await getDaysPerMonth(selectedYear.value)
            selectedMonthDays.value = daysPerMonth.find((month) => month.month == selectedMonth.value)?.number_of_days ?? 28
            searchFilter.value.per_page = perPage.value
            searchFilter.value.attendance_from = `${selectedYear.value}-${selectedMonth.value}-01`
            searchFilter.value.attendance_to = `${selectedYear.value}-${selectedMonth.value}-${selectedMonthDays.value}`
            await search()
        }
        function isNumber(str: string): boolean {
            if (typeof str !== 'string') {
                return false;
            }

            if (str.trim() === '') {
                return false;
            }

            return !Number.isNaN(Number(str));
        }

        const search = async () => {
            searchFilter.value.per_page = perPage.value
            searchFilter.value.page = 1
            const daysPerMonth = selectedMonthDays.value
            context.emit('search', searchFilter.value, daysPerMonth)
        }
        const search_filter = (value: EmployeeAttendanceSearchFilter) => {
            searchFilter.value = value
            searchFilter.value.per_page = perPage.value
            context.emit('search', searchFilter.value)
        }

        const resetFilter = () => {
            searchFilter.value.name = undefined
            searchFilter.value.phone_number = undefined
            searchFilter.value.position_id = undefined
            searchFilter.value.attendance_from = undefined
            searchFilter.value.attendance_to = undefined
            searchFilter.value.user_status_id = undefined
            searchFilter.value.department_id = undefined
            searchFilter.value.quick_search = undefined
            quickSearchField.value = ''
            selectedYear.value = currentYear
            selectedMonth.value = currentMonth
            is_reseted.value = true
            keyIncrement.value++
            context.emit('resetFilter', searchFilter.value)

        }
        const resetFilter_popup = () => {
            searchFilter.value.name = undefined
            searchFilter.value.phone_number = undefined
            searchFilter.value.position_id = undefined
            searchFilter.value.attendance_from = undefined
            searchFilter.value.attendance_to = undefined
            searchFilter.value.user_status_id = undefined
            searchFilter.value.department_id = undefined
            context.emit('resetFilter', searchFilter.value)

        }
        const statusesList = ref<UserStatus[]>([])
        onMounted(async () => {
            const { userstatuses } = await getUserStatusesList(defaultUserStatusSearchFilter)
            statusesList.value = userstatuses
        })
        return { AttendanceConsts, months, selectedMonth, selectedYear, keyIncrement, quickSearch, quickSearchField, is_reseted, default_per_page, onOpen, resetFilter_popup, search_filter, popUpTrigger, statusesList, resetFilter, search, searchFilterPop, perPage, pagination }
    },
})
</script>

<template>
    <form class="form-layout" v-on:submit.prevent="quickSearch">
        <div class="form-outer">
            <div class="form-header stuck-header">
                <div class="form-header-inner">
                    <div class="left my-4 mx-2 ">
                        <div class="columns is-flex is-align-items-center">
                            <VControl class="mr-2" icon="feather:search">
                                <VInput v-model="quickSearchField" type="text" placeholder="Name/Number..." />
                            </VControl>
                            <VControl class="mr-2">
                                <VSelect v-model="selectedMonth">
                                    <VOption :key="index" v-for="(month, index) in months"
                                        :value="index + 1 < 10 ? '0' + (index + 1).toString() : (index + 1).toString()">
                                        {{
                                            month
                                        }}</VOption>
                                </VSelect>
                            </VControl>
                            <VControl class="mr-2">
                                <VSelect v-model="selectedYear">
                                    <VOption :key="year" v-for="year in (100)" :value="year + 2000">{{ year + 2000 }}
                                    </VOption>
                                </VSelect>
                            </VControl>
                            <VIconButton class="mr-2" v-on:click="quickSearch" icon="feather:search" />
                            <VIconButton class="mr-2" @click.prevent="onOpen" icon="fas fa-filter" />
                            <VIconButton class="mr-2" v-on:click="resetFilter" icon="feather:rotate-ccw" :raised="false"
                                color="danger" />

                        </div>
                    </div>
                    <div class="left my-4 mx-2">
                        <div class="columns is-flex is-align-items-center">
                            <VControl class="mr-2 ">
                                <div class="select">

                                    <select v-model="perPage" @change="search">
                                        <VOption :value="default_per_page * 0.1">{{ default_per_page * 0.1 }}
                                        </VOption>
                                        <VOption :value="default_per_page * 0.5">{{ default_per_page * 0.5 }}
                                        </VOption>
                                        <VOption :value="default_per_page">{{ default_per_page }}
                                        </VOption>
                                        <VOption :value="default_per_page * 2">{{ default_per_page * 2 }}
                                        </VOption>
                                        <VOption :value="default_per_page * 10">{{ default_per_page * 10 }}
                                        </VOption>
                                    </select>
                                </div>
                            </VControl>
                        </div>
                    </div>
                </div>
                <h6 class="is-size-7 mt-2"><span class="has-text-info">Note: </span>
                    <span class="blue"> {{ AttendanceConsts.getAttendanceStatusIcon(AttendanceConsts.ATTEND) }}</span> ➡
                    {{ AttendanceConsts.getAttendanceStatusName(AttendanceConsts.ATTEND) }}  | 
                    <Tippy placement="bottom">
                        {{ AttendanceConsts.getAttendanceStatusIcon(AttendanceConsts.PENDING_ABSENCE) }} ➡
                        Absence  | 
                        <template #content>
                            <p>
                                {{ AttendanceConsts.getAttendanceStatusIcon(AttendanceConsts.PENDING_ABSENCE) }} ➡
                                {{ AttendanceConsts.getAttendanceStatusName(AttendanceConsts.PENDING_ABSENCE) }}
                            </p>
                            <p>
                                <span class="green">{{
                                    AttendanceConsts.getAttendanceStatusIcon(AttendanceConsts.JUSTIFIED_ABSENCE)
                                }}</span> ➡
                                {{ AttendanceConsts.getAttendanceStatusName(AttendanceConsts.JUSTIFIED_ABSENCE) }}
                            </p>
                            <p>
                                <span class="red">{{
                                    AttendanceConsts.getAttendanceStatusIcon(AttendanceConsts.UNJUTIFIED_ABSENCE)
                                }}</span>
                                ➡
                                {{ AttendanceConsts.getAttendanceStatusName(AttendanceConsts.UNJUTIFIED_ABSENCE) }}
                            </p>
                        </template>
                    </Tippy>
                    <Tippy placement="bottom">
                        {{ AttendanceConsts.getAttendanceStatusIcon(AttendanceConsts.PENDING_PARTIAL_ABSENCE) }} ➡
                        Partial Absence  | 
                        <template #content>
                            <p>
                                {{ AttendanceConsts.getAttendanceStatusIcon(AttendanceConsts.PENDING_PARTIAL_ABSENCE) }}
                                ➡
                                {{ AttendanceConsts.getAttendanceStatusName(AttendanceConsts.PENDING_PARTIAL_ABSENCE) }}
                            </p>
                            <p>
                                <span class="green">{{
                                    AttendanceConsts.getAttendanceStatusIcon(AttendanceConsts.JUSTIFIED_PARTIAL_ABSENCE)
                                }}</span> ➡
                                {{
                                    AttendanceConsts.getAttendanceStatusName(AttendanceConsts.JUSTIFIED_PARTIAL_ABSENCE)
                                }}
                            </p>
                            <p>
                                <span class="red">{{
                                    AttendanceConsts.getAttendanceStatusIcon(AttendanceConsts.UNJUSTIFIED_PARTIAL_ABSENCE)
                                }}</span>
                                ➡
                                {{
                                    AttendanceConsts.getAttendanceStatusName(AttendanceConsts.UNJUSTIFIED_PARTIAL_ABSENCE)
                                }}
                            </p>
                        </template>
                    </Tippy>
                    <span class="blue"> {{ AttendanceConsts.getAttendanceStatusIcon(AttendanceConsts.VACATION) }}</span>
                    ➡
                    {{ AttendanceConsts.getAttendanceStatusName(AttendanceConsts.VACATION) }}  | 
                    <span class="yellow">{{
                        AttendanceConsts.getAttendanceStatusIcon(AttendanceConsts.MISSING_CHECK)
                    }}</span> ➡
                    {{ AttendanceConsts.getAttendanceStatusName(AttendanceConsts.MISSING_CHECK) }}


                </h6>

            </div>
        </div>
        <EmployeeAttendanceSearchFilterModal :key="keyIncrement" :search_filter_popup="searchFilterPop"
            @search_filter_popup="popUpTrigger" @search="search_filter" @resetFilter="resetFilter_popup" />
    </form>
</template>

<style scoped  lang="scss">
@import '/@src/scss/styles/tableHeader.scss';

.blue {
    color: rgb(0, 0, 255) !important;
}

.red {
    color: rgb(255, 0, 0) !important;
}

.grey {
    color: grey !important;
}

.yellow {
    color: rgb(255, 208, 0) !important;
}

.green {
    color: rgb(0, 255, 0) !important;
}
</style>
