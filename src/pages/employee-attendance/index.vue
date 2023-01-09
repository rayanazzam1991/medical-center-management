<script setup lang="ts">
import { useHead } from '@vueuse/head';
import AttendanceTableCellCard from '/@src/components/OurComponents/HR/Attendance/AttendanceTableCellCard.vue';
import { useNotyf } from '/@src/composable/useNotyf';
import { defaultEmployeeSchedule, defaultEmployeeScheduleSearchFilter, defaultSchedule, defaultUpdateSchedule, EmployeeSchedule, EmployeeScheduleSearchFilter, Schedule, UpdateSchedule } from '../../models/HR/Attendance/EmployeeSchedule/employeeSchedule';
import { getEmployeesAttendance, getEmployeesSchedule, updateEmployeeSchedule } from '/@src/services/Employee/employeeService';
import { getSettingsFromStorage } from '/@src/services/Others/Setting/settingService';
import { useEmployee } from '/@src/stores/Employee/employeeStore';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { defaultPagination } from '/@src/utils/response';
import sleep from '/@src/utils/sleep';
import { getDaysNamePerMonth, getDaysPerMonth, getWeekDays } from '/@src/services/HR/Attendance/Date/dateService';
import { Notyf } from 'notyf';
import { Attendance, defaultAttendance, defaultEmployeeAttendance, defaultEmployeeAttendanceSearchFilter, EmployeeAttendance, EmployeeAttendanceSearchFilter } from '/@src/models/HR/Attendance/EmployeeAttendance/employeeAttendance';
import { DaysNamePerMonth, DaysPerMonth } from '/@src/models/HR/Attendance/Date/date';
import { AttendanceConsts } from '/@src/models/HR/Attendance/EmployeeAttendance/employeeAttendance';

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Employees Attendance')
useHead({
    title: 'Employees Attendance',
})
const notif = useNotyf() as Notyf
const searchFilter = ref(defaultEmployeeAttendanceSearchFilter)
const employeesAttendanceList = ref<Array<EmployeeAttendance>>([])
const paginationVar = ref(defaultPagination)
const router = useRouter()
const employeeStore = useEmployee()
const default_per_page = ref(1)
const keyIncrement = ref(0)
const tableCellPopup = ref(false)
const selectedCell = ref<Attendance>(defaultAttendance)
const selectedEmployee = ref<EmployeeAttendance>(defaultEmployeeAttendance)
const daysPerMonth = ref<DaysPerMonth[]>([])
const daysNamePerMonth = ref<DaysNamePerMonth[]>([])
const selectedStartTime = ref({ hour: '00', minute: '00' })
const selectedEndTime = ref({ hour: '00', minute: '00' })
const keyIncement = ref(0)
const loading = ref({ update: false, delete: false , fetch: false })
const currentYear = new Date().getFullYear()
const currentMonth = new Date().getMonth() + 1 < 10 ? "0" + (new Date().getMonth() + 1).toString() : (new Date().getMonth() + 1).toString()

const selectedYear = ref(currentYear)
const selectedMonth = ref(currentMonth)
const selectedMonthDays = ref(28)
const daysPerMonthResult = await getDaysPerMonth(currentYear);
daysPerMonth.value = daysPerMonthResult.daysPerMonth
const originalDaysPerMonth = daysPerMonthResult.daysPerMonth.find((month) => month.month == Number(currentMonth))?.number_of_days
const daysNamePerMonthResult = await getDaysNamePerMonth(currentYear, Number(currentMonth));
daysNamePerMonth.value = daysNamePerMonthResult.daysName
const originalDaysName = daysNamePerMonthResult.daysName
selectedMonthDays.value = daysPerMonth.value.find((month) => month.month == Number(selectedMonth.value))?.number_of_days ?? 28
onMounted(async () => {

    const { employeesAttendance, pagination } = await getEmployeesAttendance(searchFilter.value)
    employeesAttendanceList.value = employeesAttendance
    paginationVar.value = pagination
    keyIncrement.value = keyIncrement.value + 1
    default_per_page.value = pagination.per_page


});

const search = async (newSearchFilter: EmployeeAttendanceSearchFilter, daysPerMonth: number) => {
    loading.value.fetch = true
    if (newSearchFilter.attendance_from != undefined) {

        const dateSpliter = newSearchFilter.attendance_from?.split('-') ?? '01'
        selectedMonthDays.value = daysPerMonth
        const daysNamePerMonthResult = await getDaysNamePerMonth(Number(dateSpliter[0]), Number(dateSpliter[1]));
        daysNamePerMonth.value = daysNamePerMonthResult.daysName
    }
    const { employeesAttendance, pagination } = await getEmployeesAttendance(newSearchFilter)

    employeesAttendanceList.value = employeesAttendance
    paginationVar.value = pagination
    searchFilter.value = newSearchFilter
    loading.value.fetch = false

}

const resetFilter = async (newSearchFilter: EmployeeAttendanceSearchFilter) => {
    loading.value.fetch = true

    searchFilter.value = newSearchFilter
    selectedMonthDays.value = originalDaysPerMonth ?? 28
    daysNamePerMonth.value = originalDaysName
    await search(searchFilter.value, selectedMonthDays.value)
    loading.value.fetch = false

}

const getEmployeesAttendancePerPage = async (pageNum: number) => {

    loading.value.fetch = true
    searchFilter.value.page = pageNum
    await search(searchFilter.value, selectedMonthDays.value)
    loading.value.fetch = false

}
const employeeSort = async (value: string) => {
    loading.value.fetch = true

    if (value != undefined) {
        const [sortField, sortOrder] = value.split(':') as [string, 'desc' | 'asc']

        searchFilter.value.order_by = sortField
        searchFilter.value.order = sortOrder
    }
    else {
        searchFilter.value.order = undefined
        searchFilter.value.order_by = undefined
    }
    await search(searchFilter.value, selectedMonthDays.value)
    loading.value.fetch = false


}
// const formatTime = () => {
//     if (selectedCell.value.start_time) {
//         const [hour, minute, second] = selectedCell.value.start_time.split(':')
//         selectedStartTime.value = { hour: Number(hour) < 10 && Number(hour) > 0 ? hour.substring(1) : hour, minute: Number(minute) < 10 && Number(minute) > 0 ? minute.substring(1) : minute }

//     }
//     if (selectedCell.value.end_time) {
//         const [hour, minute, second] = selectedCell.value.end_time.split(':')
//         selectedEndTime.value = { hour: Number(hour) < 10 && Number(hour) > 0 ? hour.substring(1) : hour, minute: Number(minute) < 10 && Number(minute) > 0 ? minute.substring(1) : minute }
//     }
// }

// const updateSchedule = async () => {
//     let formatedStartTimeMinute;
//     let formatedStartTimeHour;
//     let formatedEndTimeMinute;
//     let formatedEndTimeHour;
//     if (Number(selectedStartTime.value.minute) < 10 && Number(selectedStartTime.value.minute) > 0)
//         formatedStartTimeMinute = '0' + selectedStartTime.value.minute
//     else
//         formatedStartTimeMinute = selectedStartTime.value.minute

//     if (Number(selectedStartTime.value.hour) < 10 && Number(selectedStartTime.value.hour) > 0)
//         formatedStartTimeHour = '0' + selectedStartTime.value.hour
//     else
//         formatedStartTimeHour = selectedStartTime.value.hour
//     if (Number(selectedEndTime.value.minute) < 10 && Number(selectedEndTime.value.minute) > 0)
//         formatedEndTimeMinute = '0' + selectedEndTime.value.minute
//     else
//         formatedEndTimeMinute = selectedEndTime.value.minute

//     if (Number(selectedEndTime.value.hour) < 10 && Number(selectedEndTime.value.hour) > 0)
//         formatedEndTimeHour = '0' + selectedEndTime.value.hour
//     else
//         formatedEndTimeHour = selectedEndTime.value.hour

//     if (Number(formatedStartTimeHour) > Number(formatedEndTimeHour)) {
//         await sleep(200);

//         // @ts-ignore
//         notif.error(`Start time cant be after end time`)

//         return
//     }

//     else if (Number(formatedStartTimeHour) == Number(formatedEndTimeHour)) {
//         if (Number(formatedStartTimeMinute) >= Number(formatedEndTimeMinute)) {
//             await sleep(200);

//             // @ts-ignore
//             notif.error(`Start time cant be after end time`)

//             return
//         }
//     }


//     const updateStartTime = formatedStartTimeHour + ':' + formatedStartTimeMinute
//     const updateEndTime = formatedEndTimeHour + ':' + formatedEndTimeMinute
//     updateScheduleVar.value.end_time = updateEndTime
//     updateScheduleVar.value.start_time = updateStartTime
//     updateScheduleVar.value.is_vacation = false
//     if (selectedEmployee.value.id != undefined) {
//         loading.value.update = true
//         const { message, success } = await updateEmployeeSchedule(selectedEmployee.value.id, selectedCell.value.id, updateScheduleVar.value)
//         if (success) {

//             search(searchFilter.value)
//             // @ts-ignore
//             notif.dismissAll()
//             await sleep(200);

//             // @ts-ignore
//             notif.success(`${selectedEmployee.value.user.first_name} ${selectedEmployee.value.user.last_name} schedule was edited successfully`)
//         } else {
//             await sleep(200);
//             // @ts-ignore
//             notif.error(message)
//         }
//         keyIncement.value++
//         loading.value.update = false

//         tableCellPopup.value = false
//         await search(searchFilter.value)

//     }
// }
// const deleteSchedule = async () => {
//     const updateStartTime = "00:00:00"
//     const updateEndTime = "00:00:00"

//     updateScheduleVar.value.end_time = updateEndTime
//     updateScheduleVar.value.start_time = updateStartTime
//     updateScheduleVar.value.is_vacation = true
//     if (selectedEmployee.value.id != undefined) {
//         loading.value.delete = true
//         const { message, success } = await updateEmployeeSchedule(selectedEmployee.value.id, selectedCell.value.id, updateScheduleVar.value)
//         if (success) {

//             search(searchFilter.value)
//             // @ts-ignore
//             notif.dismissAll()
//             await sleep(200);

//             // @ts-ignore
//             notif.success(`${selectedEmployee.value.user.first_name} ${selectedEmployee.value.user.last_name} schedule was edited successfully`)
//         } else {
//             await sleep(200);
//             // @ts-ignore
//             notif.error(message)
//         }
//         keyIncement.value++
//         loading.value.delete = false
//         tableCellPopup.value = false
//         await search(searchFilter.value)

//     }
// }


const columns28 = {

    "users.name": {
        align: 'center',

        label: 'Employee Name',
        renderHeader: () =>
            h(
                AttendanceTableCellCard, {
                isHeader: true,
                isMainHeader: true,
                radius: 'none',
                headerTitle: 'Employee Name',
            }

            ),
        // grow: true,
        renderRow: (row: any) =>
            h(
                AttendanceTableCellCard, {
                title: row?.user?.first_name + ' ' + row?.user?.last_name,
                subtitle: `${row?.user?.phone_number}`,
                titleSize: 'medium',
                clickable: false,
                color: 'primary',
                onClick: () => {
                    router.push({ path: `/employee/${row?.id}` })

                }
            }

            ),
        searchable: true,

    },
    "first": {
        align: 'center',

        // label: `${daysNamePerMonth.value[0].day} ${daysNamePerMonth.value[0].day_name} `,
        grow: false,
        renderHeader: () =>
            h(
                AttendanceTableCellCard, {
                isHeader: true,
                radius: 'none',
                headerTitle: `${daysNamePerMonth.value[0].day} ${daysNamePerMonth.value[0].day_name} `,
            }

            ),

        renderRow: (row: any) =>
            h(
                AttendanceTableCellCard, {
                clickable: true,
                title: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-01`) ? AttendanceConsts.getAttendanceStatusIcon(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-01`).status) : '-',
                titleSize: 'small',
                statusColor: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-01`) ? AttendanceConsts.getAttendanceStatusColor(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-01`).status) : 'grey',
                color: 'disabled',
                onClick: () => {

                    if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-01`)) {
                        keyIncement.value++
                        selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-01`)
                        selectedEmployee.value = row
                        tableCellPopup.value = true
                    }

                }
            }

            ),

    },
    "second": {
        align: 'center',

        grow: false,
        renderHeader: () =>
            h(
                AttendanceTableCellCard, {
                isHeader: true,
                radius: 'none',
                headerTitle: `${daysNamePerMonth.value[1].day} ${daysNamePerMonth.value[1].day_name} `,
            }

            ),

        renderRow: (row: any) =>
            h(
                AttendanceTableCellCard, {
                clickable: true,
                title: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-02`) ? AttendanceConsts.getAttendanceStatusIcon(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-02`).status) : '-',
                titleSize: 'small',
                color: 'disabled',
                statusColor: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-02`) ? AttendanceConsts.getAttendanceStatusColor(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-02`).status) : 'grey',
                onClick: () => {
                    if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-02`)) {
                        keyIncement.value++
                        selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-02`)
                        selectedEmployee.value = row
                        tableCellPopup.value = true
                    }

                }
            }

            ),

    },
    "third": {
        align: 'center',

        grow: false,
        renderHeader: () =>
            h(
                AttendanceTableCellCard, {
                isHeader: true,
                radius: 'none',
                headerTitle: `${daysNamePerMonth.value[2].day} ${daysNamePerMonth.value[2].day_name} `,
            }

            ),


        renderRow: (row: any) =>
            h(
                AttendanceTableCellCard, {
                clickable: true,
                title: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-03`) ? AttendanceConsts.getAttendanceStatusIcon(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-03`).status) : '-',
                titleSize: 'small',
                color: 'disabled',
                statusColor: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-03`) ? AttendanceConsts.getAttendanceStatusColor(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-03`).status) : 'grey',

                onClick: () => {
                    if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-03`)) {
                        keyIncement.value++
                        selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-03`)
                        selectedEmployee.value = row
                        tableCellPopup.value = true
                    }

                }
            }

            ),

    },
    "fourth": {
        align: 'center',

        grow: false,
        renderHeader: () =>
            h(
                AttendanceTableCellCard, {
                isHeader: true,
                radius: 'none',
                headerTitle: `${daysNamePerMonth.value[3].day} ${daysNamePerMonth.value[3].day_name} `,
            }

            ),


        renderRow: (row: any) =>
            h(
                AttendanceTableCellCard, {
                clickable: true,
                title: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-04`) ? AttendanceConsts.getAttendanceStatusIcon(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-04`).status) : '-',
                titleSize: 'small',
                color: 'disabled',
                statusColor: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-04`) ? AttendanceConsts.getAttendanceStatusColor(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-04`).status) : 'grey',

                onClick: () => {
                    if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-04`)) {
                        keyIncement.value++
                        selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-04`)
                        selectedEmployee.value = row
                        tableCellPopup.value = true
                    }

                }
            }

            ),



    },
    "fifth": {
        align: 'center',

        grow: false,
        renderHeader: () =>
            h(
                AttendanceTableCellCard, {
                isHeader: true,
                radius: 'none',
                headerTitle: `${daysNamePerMonth.value[4].day} ${daysNamePerMonth.value[4].day_name} `,
            }

            ),


        renderRow: (row: any) =>
            h(
                AttendanceTableCellCard, {
                clickable: true,
                title: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-05`) ? AttendanceConsts.getAttendanceStatusIcon(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-05`).status) : '-',
                titleSize: 'small',
                color: 'disabled',
                statusColor: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-05`) ? AttendanceConsts.getAttendanceStatusColor(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-05`).status) : 'grey',

                onClick: () => {
                    if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-05`)) {
                        keyIncement.value++
                        selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-05`)
                        selectedEmployee.value = row
                        tableCellPopup.value = true
                    }

                }
            }

            ),

    },
    "sixth": {
        align: 'center',

        grow: false,
        renderHeader: () =>
            h(
                AttendanceTableCellCard, {
                isHeader: true,
                radius: 'none',
                headerTitle: `${daysNamePerMonth.value[5].day} ${daysNamePerMonth.value[5].day_name} `,
            }

            ),


        renderRow: (row: any) =>
            h(
                AttendanceTableCellCard, {
                clickable: true,
                title: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-06`) ? AttendanceConsts.getAttendanceStatusIcon(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-06`).status) : '-',
                titleSize: 'small',
                color: 'disabled',
                statusColor: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-06`) ? AttendanceConsts.getAttendanceStatusColor(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-06`).status) : 'grey',

                onClick: () => {
                    if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-06`)) {
                        keyIncement.value++
                        selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-06`)
                        selectedEmployee.value = row
                        tableCellPopup.value = true
                    }

                }
            }

            ),

    },
    "seventh": {
        align: 'center',

        grow: false,
        renderHeader: () =>
            h(
                AttendanceTableCellCard, {
                isHeader: true,
                radius: 'none',
                headerTitle: `${daysNamePerMonth.value[6].day} ${daysNamePerMonth.value[6].day_name} `,
            }

            ),


        renderRow: (row: any) =>
            h(
                AttendanceTableCellCard, {
                clickable: true,
                title: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-07`) ? AttendanceConsts.getAttendanceStatusIcon(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-07`).status) : '-',
                titleSize: 'small',
                statusColor: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-07`) ? AttendanceConsts.getAttendanceStatusColor(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-07`).status) : 'grey',

                color: 'disabled',
                onClick: () => {
                    if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-07`)) {
                        keyIncement.value++
                        selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-07`)
                        selectedEmployee.value = row
                        tableCellPopup.value = true
                    }

                }
            }

            ),

    },
    "eighth": {
        align: 'center',

        grow: false,
        renderHeader: () =>
            h(
                AttendanceTableCellCard, {
                isHeader: true,
                radius: 'none',
                headerTitle: `${daysNamePerMonth.value[7].day} ${daysNamePerMonth.value[7].day_name} `,
            }

            ),


        renderRow: (row: any) =>
            h(
                AttendanceTableCellCard, {
                clickable: true,
                title: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-08`) ? AttendanceConsts.getAttendanceStatusIcon(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-08`).status) : '-',
                titleSize: 'small',
                statusColor: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-08`) ? AttendanceConsts.getAttendanceStatusColor(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-08`).status) : 'grey',

                color: 'disabled',
                onClick: () => {
                    if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-08`)) {
                        keyIncement.value++
                        selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-08`)
                        selectedEmployee.value = row
                        tableCellPopup.value = true
                    }

                }
            }

            ),

    },
    "ninth": {
        align: 'center',

        grow: false,
        renderHeader: () =>
            h(
                AttendanceTableCellCard, {
                isHeader: true,
                radius: 'none',
                headerTitle: `${daysNamePerMonth.value[8].day} ${daysNamePerMonth.value[8].day_name} `,
            }

            ),


        renderRow: (row: any) =>
            h(
                AttendanceTableCellCard, {
                clickable: true,
                title: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-09`) ? AttendanceConsts.getAttendanceStatusIcon(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-09`).status) : '-',
                titleSize: 'small',
                statusColor: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-09`) ? AttendanceConsts.getAttendanceStatusColor(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-09`).status) : 'grey',

                color: 'disabled',
                onClick: () => {
                    if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-09`)) {
                        keyIncement.value++
                        selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-09`)
                        selectedEmployee.value = row
                        tableCellPopup.value = true
                    }

                }
            }

            ),

    },
    "tenth": {
        align: 'center',
        grow: false,
        renderHeader: () =>
            h(
                AttendanceTableCellCard, {
                isHeader: true,
                radius: 'none',
                headerTitle: `${daysNamePerMonth.value[9].day} ${daysNamePerMonth.value[9].day_name} `,
            }

            ),


        renderRow: (row: any) =>
            h(
                AttendanceTableCellCard, {
                clickable: true,
                title: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-10`) ? AttendanceConsts.getAttendanceStatusIcon(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-10`).status) : '-',
                titleSize: 'small',
                statusColor: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-10`) ? AttendanceConsts.getAttendanceStatusColor(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-10`).status) : 'grey',

                color: 'disabled',
                onClick: () => {
                    if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-10`)) {
                        keyIncement.value++
                        selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-10`)
                        selectedEmployee.value = row
                        tableCellPopup.value = true
                    }

                }
            }

            ),

    },
    "d11": {
        align: 'center',

        grow: false,
        renderHeader: () =>
            h(
                AttendanceTableCellCard, {
                isHeader: true,
                radius: 'none',
                headerTitle: `${daysNamePerMonth.value[10].day} ${daysNamePerMonth.value[10].day_name} `,
            }

            ),


        renderRow: (row: any) =>
            h(
                AttendanceTableCellCard, {
                clickable: true,
                title: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-11`) ? AttendanceConsts.getAttendanceStatusIcon(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-11`).status) : '-',
                titleSize: 'small',
                color: 'disabled',
                statusColor: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-11`) ? AttendanceConsts.getAttendanceStatusColor(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-11`).status) : 'grey',

                onClick: () => {
                    if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-11`)) {
                        keyIncement.value++
                        selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-11`)
                        selectedEmployee.value = row
                        tableCellPopup.value = true
                    }

                }
            }

            ),

    },
    "d12": {
        align: 'center',

        grow: false,
        renderHeader: () =>
            h(
                AttendanceTableCellCard, {
                isHeader: true,
                radius: 'none',
                headerTitle: `${daysNamePerMonth.value[11].day} ${daysNamePerMonth.value[11].day_name} `,
            }

            ),


        renderRow: (row: any) =>
            h(
                AttendanceTableCellCard, {
                clickable: true,
                title: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-12`) ? AttendanceConsts.getAttendanceStatusIcon(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-12`).status) : '-',
                titleSize: 'small',
                statusColor: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-12`) ? AttendanceConsts.getAttendanceStatusColor(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-12`).status) : 'grey',

                color: 'disabled',
                onClick: () => {
                    if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-12`)) {
                        keyIncement.value++
                        selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-12`)
                        selectedEmployee.value = row
                        tableCellPopup.value = true
                    }

                }
            }

            ),

    },
    "d13": {
        align: 'center',
        grow: false,
        renderHeader: () =>
            h(
                AttendanceTableCellCard, {
                isHeader: true,
                radius: 'none',
                headerTitle: `${daysNamePerMonth.value[12].day} ${daysNamePerMonth.value[12].day_name} `,
            }

            ),


        renderRow: (row: any) =>
            h(
                AttendanceTableCellCard, {
                clickable: true,
                title: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-13`) ? AttendanceConsts.getAttendanceStatusIcon(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-13`).status) : '-',
                titleSize: 'small',
                statusColor: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-13`) ? AttendanceConsts.getAttendanceStatusColor(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-13`).status) : 'grey',

                color: 'disabled',
                onClick: () => {
                    if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-13`)) {
                        keyIncement.value++
                        selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-13`)
                        selectedEmployee.value = row
                        tableCellPopup.value = true
                    }

                }
            }

            ),

    },
    "d14": {
        align: 'center',

        grow: false,
        renderHeader: () =>
            h(
                AttendanceTableCellCard, {
                isHeader: true,
                radius: 'none',
                headerTitle: `${daysNamePerMonth.value[13].day} ${daysNamePerMonth.value[13].day_name} `,
            }

            ),


        renderRow: (row: any) =>
            h(
                AttendanceTableCellCard, {
                clickable: true,
                title: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-14`) ? AttendanceConsts.getAttendanceStatusIcon(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-14`).status) : '-',
                titleSize: 'small',
                color: 'disabled',
                statusColor: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-14`) ? AttendanceConsts.getAttendanceStatusColor(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-14`).status) : 'grey',

                onClick: () => {
                    if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-14`)) {
                        keyIncement.value++
                        selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-14`)
                        selectedEmployee.value = row
                        tableCellPopup.value = true
                    }

                }
            }

            ),

    },
    "d15": {
        align: 'center',

        grow: false,
        renderHeader: () =>
            h(
                AttendanceTableCellCard, {
                isHeader: true,
                radius: 'none',
                headerTitle: `${daysNamePerMonth.value[15 - 1].day} ${daysNamePerMonth.value[15 - 1].day_name} `,
            }

            ),


        renderRow: (row: any) =>
            h(
                AttendanceTableCellCard, {
                clickable: true,
                title: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-15`) ? AttendanceConsts.getAttendanceStatusIcon(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-15`).status) : '-',
                titleSize: 'small',
                statusColor: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-15`) ? AttendanceConsts.getAttendanceStatusColor(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-15`).status) : 'grey',

                color: 'disabled',
                onClick: () => {
                    if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-15`)) {
                        keyIncement.value++
                        selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-15`)
                        selectedEmployee.value = row
                        tableCellPopup.value = true
                    }

                }
            }

            ),

    },
    "d16": {
        align: 'center',
        grow: false,
        renderHeader: () =>
            h(
                AttendanceTableCellCard, {
                isHeader: true,
                radius: 'none',
                headerTitle: `${daysNamePerMonth.value[16 - 1].day} ${daysNamePerMonth.value[16 - 1].day_name} `,
            }

            ),


        renderRow: (row: any) =>
            h(
                AttendanceTableCellCard, {
                clickable: true,
                title: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-16`) ? AttendanceConsts.getAttendanceStatusIcon(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-16`).status) : '-',
                titleSize: 'small',
                statusColor: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-16`) ? AttendanceConsts.getAttendanceStatusColor(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-16`).status) : 'grey',

                color: 'disabled',
                onClick: () => {
                    if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-16`)) {
                        keyIncement.value++
                        selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-16`)
                        selectedEmployee.value = row
                        tableCellPopup.value = true
                    }

                }
            }

            ),

    },
    "d17": {
        align: 'center',
        grow: false,
        renderHeader: () =>
            h(
                AttendanceTableCellCard, {
                isHeader: true,
                radius: 'none',
                headerTitle: `${daysNamePerMonth.value[17 - 1].day} ${daysNamePerMonth.value[17 - 1].day_name} `,
            }

            ),


        renderRow: (row: any) =>
            h(
                AttendanceTableCellCard, {
                clickable: true,
                title: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-17`) ? AttendanceConsts.getAttendanceStatusIcon(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-17`).status) : '-',
                titleSize: 'small',
                statusColor: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-17`) ? AttendanceConsts.getAttendanceStatusColor(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-17`).status) : 'grey',

                color: 'disabled',
                onClick: () => {
                    if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-17`)) {
                        keyIncement.value++
                        selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-17`)
                        selectedEmployee.value = row
                        tableCellPopup.value = true
                    }

                }
            }

            ),

    },
    "d18": {
        align: 'center',
        grow: false,
        renderHeader: () =>
            h(
                AttendanceTableCellCard, {
                isHeader: true,
                radius: 'none',
                headerTitle: `${daysNamePerMonth.value[18 - 1].day} ${daysNamePerMonth.value[18 - 1].day_name} `,
            }

            ),


        renderRow: (row: any) =>
            h(
                AttendanceTableCellCard, {
                clickable: true,
                title: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-18`) ? AttendanceConsts.getAttendanceStatusIcon(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-18`).status) : '-',
                titleSize: 'small',
                statusColor: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-18`) ? AttendanceConsts.getAttendanceStatusColor(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-18`).status) : 'grey',

                color: 'disabled',
                onClick: () => {
                    if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-18`)) {
                        keyIncement.value++
                        selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-18`)
                        selectedEmployee.value = row
                        tableCellPopup.value = true
                    }

                }
            }

            ),

    },
    "d19": {
        align: 'center',
        grow: false,
        renderHeader: () =>
            h(
                AttendanceTableCellCard, {
                isHeader: true,
                radius: 'none',
                headerTitle: `${daysNamePerMonth.value[19 - 1].day} ${daysNamePerMonth.value[19 - 1].day_name} `,
            }

            ),


        renderRow: (row: any) =>
            h(
                AttendanceTableCellCard, {
                clickable: true,
                title: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-19`) ? AttendanceConsts.getAttendanceStatusIcon(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-19`).status) : '-',
                titleSize: 'small',
                statusColor: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-19`) ? AttendanceConsts.getAttendanceStatusColor(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-19`).status) : 'grey',

                color: 'disabled',
                onClick: () => {
                    if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-19`)) {
                        keyIncement.value++
                        selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-19`)
                        selectedEmployee.value = row
                        tableCellPopup.value = true
                    }

                }
            }

            ),

    },
    "d20": {
        align: 'center',
        grow: false,
        renderHeader: () =>
            h(
                AttendanceTableCellCard, {
                isHeader: true,
                radius: 'none',
                headerTitle: `${daysNamePerMonth.value[20 - 1].day} ${daysNamePerMonth.value[20 - 1].day_name} `,
            }

            ),


        renderRow: (row: any) =>
            h(
                AttendanceTableCellCard, {
                clickable: true,
                title: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-20`) ? AttendanceConsts.getAttendanceStatusIcon(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-20`).status) : '-',
                titleSize: 'small',
                statusColor: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-20`) ? AttendanceConsts.getAttendanceStatusColor(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-20`).status) : 'grey',

                color: 'disabled',
                onClick: () => {
                    if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-20`)) {
                        keyIncement.value++
                        selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-20`)
                        selectedEmployee.value = row
                        tableCellPopup.value = true
                    }

                }
            }

            ),

    },
    "d21": {
        align: 'center',
        grow: false,
        renderHeader: () =>
            h(
                AttendanceTableCellCard, {
                isHeader: true,
                radius: 'none',
                headerTitle: `${daysNamePerMonth.value[21 - 1].day} ${daysNamePerMonth.value[21 - 1].day_name} `,
            }

            ),


        renderRow: (row: any) =>
            h(
                AttendanceTableCellCard, {
                clickable: true,
                title: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-21`) ? AttendanceConsts.getAttendanceStatusIcon(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-21`).status) : '-',
                titleSize: 'small',
                statusColor: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-21`) ? AttendanceConsts.getAttendanceStatusColor(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-21`).status) : 'grey',

                color: 'disabled',
                onClick: () => {
                    if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-21`)) {
                        keyIncement.value++
                        selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-21`)
                        selectedEmployee.value = row
                        tableCellPopup.value = true
                    }

                }
            }

            ),

    },
    "d22": {
        align: 'center',
        grow: false,
        renderHeader: () =>
            h(
                AttendanceTableCellCard, {
                isHeader: true,
                radius: 'none',
                headerTitle: `${daysNamePerMonth.value[22 - 1].day} ${daysNamePerMonth.value[22 - 1].day_name} `,
            }

            ),


        renderRow: (row: any) =>
            h(
                AttendanceTableCellCard, {
                clickable: true,
                title: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-22`) ? AttendanceConsts.getAttendanceStatusIcon(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-22`).status) : '-',
                titleSize: 'small',
                statusColor: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-22`) ? AttendanceConsts.getAttendanceStatusColor(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-22`).status) : 'grey',

                color: 'disabled',
                onClick: () => {
                    if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-22`)) {
                        keyIncement.value++
                        selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-22`)
                        selectedEmployee.value = row
                        tableCellPopup.value = true
                    }

                }
            }

            ),

    },
    "d23": {
        align: 'center',
        grow: false,
        renderHeader: () =>
            h(
                AttendanceTableCellCard, {
                isHeader: true,
                radius: 'none',
                headerTitle: `${daysNamePerMonth.value[23 - 1].day} ${daysNamePerMonth.value[23 - 1].day_name} `,
            }

            ),


        renderRow: (row: any) =>
            h(
                AttendanceTableCellCard, {
                clickable: true,
                title: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-23`) ? AttendanceConsts.getAttendanceStatusIcon(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-23`).status) : '-',
                titleSize: 'small',
                statusColor: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-23`) ? AttendanceConsts.getAttendanceStatusColor(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-23`).status) : 'grey',

                color: 'disabled',
                onClick: () => {
                    if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-23`)) {
                        keyIncement.value++
                        selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-23`)
                        selectedEmployee.value = row
                        tableCellPopup.value = true
                    }

                }
            }

            ),

    },
    "d24": {
        align: 'center',
        grow: false,
        renderHeader: () =>
            h(
                AttendanceTableCellCard, {
                isHeader: true,
                radius: 'none',
                headerTitle: `${daysNamePerMonth.value[24 - 1].day} ${daysNamePerMonth.value[24 - 1].day_name} `,
            }

            ),


        renderRow: (row: any) =>
            h(
                AttendanceTableCellCard, {
                clickable: true,
                title: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-24`) ? AttendanceConsts.getAttendanceStatusIcon(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-24`).status) : '-',
                titleSize: 'small',
                color: 'disabled',
                statusColor: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-24`) ? AttendanceConsts.getAttendanceStatusColor(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-24`).status) : 'grey',

                onClick: () => {
                    if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-24`)) {
                        keyIncement.value++
                        selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-24`)
                        selectedEmployee.value = row
                        tableCellPopup.value = true
                    }

                }
            }

            ),

    },
    "d25": {
        align: 'center',
        grow: false,
        renderHeader: () =>
            h(
                AttendanceTableCellCard, {
                isHeader: true,
                radius: 'none',
                headerTitle: `${daysNamePerMonth.value[25 - 1].day} ${daysNamePerMonth.value[25 - 1].day_name} `,
            }

            ),


        renderRow: (row: any) =>
            h(
                AttendanceTableCellCard, {
                clickable: true,
                title: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-25`) ? AttendanceConsts.getAttendanceStatusIcon(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-25`).status) : '-',
                titleSize: 'small',
                statusColor: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-25`) ? AttendanceConsts.getAttendanceStatusColor(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-25`).status) : 'grey',

                color: 'disabled',
                onClick: () => {
                    if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-25`)) {
                        keyIncement.value++
                        selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-25`)
                        selectedEmployee.value = row
                        tableCellPopup.value = true
                    }

                }
            }

            ),

    },
    "d26": {
        align: 'center',
        grow: false,
        renderHeader: () =>
            h(
                AttendanceTableCellCard, {
                isHeader: true,
                radius: 'none',
                headerTitle: `${daysNamePerMonth.value[26 - 1].day} ${daysNamePerMonth.value[26 - 1].day_name} `,
            }

            ),


        renderRow: (row: any) =>
            h(
                AttendanceTableCellCard, {
                clickable: true,
                title: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-26`) ? AttendanceConsts.getAttendanceStatusIcon(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-26`).status) : '-',
                titleSize: 'small',
                statusColor: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-26`) ? AttendanceConsts.getAttendanceStatusColor(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-26`).status) : 'grey',

                color: 'disabled',
                onClick: () => {
                    if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-26`)) {
                        keyIncement.value++
                        selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-26`)
                        selectedEmployee.value = row
                        tableCellPopup.value = true
                    }

                }
            }

            ),

    },
    "d27": {
        align: 'center',
        grow: false,
        renderHeader: () =>
            h(
                AttendanceTableCellCard, {
                isHeader: true,
                radius: 'none',
                headerTitle: `${daysNamePerMonth.value[27 - 1].day} ${daysNamePerMonth.value[27 - 1].day_name} `,
            }

            ),


        renderRow: (row: any) =>
            h(
                AttendanceTableCellCard, {
                clickable: true,
                title: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-27`) ? AttendanceConsts.getAttendanceStatusIcon(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-27`).status) : '-',
                titleSize: 'small',
                statusColor: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-27`) ? AttendanceConsts.getAttendanceStatusColor(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-27`).status) : 'grey',

                color: 'disabled',
                onClick: () => {
                    if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-27`)) {
                        keyIncement.value++
                        selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-27`)
                        selectedEmployee.value = row
                        tableCellPopup.value = true
                    }

                }
            }

            ),

    },
    "d28": {
        align: 'center',
        grow: false,
        renderHeader: () =>
            h(
                AttendanceTableCellCard, {
                isHeader: true,
                radius: 'none',
                headerTitle: `${daysNamePerMonth.value[28 - 1].day} ${daysNamePerMonth.value[28 - 1].day_name} `,
            }

            ),


        renderRow: (row: any) =>
            h(
                AttendanceTableCellCard, {
                clickable: true,
                title: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-28`) ? AttendanceConsts.getAttendanceStatusIcon(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-28`).status) : '-',
                titleSize: 'small',
                statusColor: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-28`) ? AttendanceConsts.getAttendanceStatusColor(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-28`).status) : 'grey',

                color: 'disabled',
                onClick: () => {
                    if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-28`)) {
                        keyIncement.value++
                        selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-28`)
                        selectedEmployee.value = row
                        tableCellPopup.value = true
                    }

                }
            }

            ),

    },
}

const columns29Sub = {
    "d29": {
        align: 'center',
        grow: false,
        renderHeader: () =>
            h(
                AttendanceTableCellCard, {
                isHeader: true,
                radius: 'none',
                headerTitle: daysNamePerMonth.value[29 - 1] ? `${daysNamePerMonth.value[29 - 1]?.day} ${daysNamePerMonth.value[29 - 1]?.day_name} ` : '',
            }

            ),


        renderRow: (row: any) =>
            h(
                AttendanceTableCellCard, {
                clickable: true,
                title: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-29`) ? AttendanceConsts.getAttendanceStatusIcon(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-29`).status) : '-',
                titleSize: 'small',
                statusColor: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-29`) ? AttendanceConsts.getAttendanceStatusColor(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-29`).status) : 'grey',

                color: 'disabled',
                onClick: () => {
                    if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-29`)) {
                        keyIncement.value++
                        selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-29`)
                        selectedEmployee.value = row
                        tableCellPopup.value = true
                    }

                }
            }

            ),

    },
}

const columns30Sub = {
    "d29": {
        align: 'center',
        grow: false,
        renderHeader: () =>
            h(
                AttendanceTableCellCard, {
                isHeader: true,
                radius: 'none',
                headerTitle: daysNamePerMonth.value[29 - 1] ? `${daysNamePerMonth.value[29 - 1]?.day} ${daysNamePerMonth.value[29 - 1]?.day_name} ` : '',
            }

            ),


        renderRow: (row: any) =>
            h(
                AttendanceTableCellCard, {
                clickable: true,
                title: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-29`) ? AttendanceConsts.getAttendanceStatusIcon(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-29`).status) : '-',
                titleSize: 'small',
                statusColor: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-29`) ? AttendanceConsts.getAttendanceStatusColor(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-29`).status) : 'grey',

                color: 'disabled',
                onClick: () => {
                    if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-29`)) {
                        keyIncement.value++
                        selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-29`)
                        selectedEmployee.value = row
                        tableCellPopup.value = true
                    }

                }
            }

            ),

    },
    "d30": {
        align: 'center',
        grow: false,
        renderHeader: () =>
            h(
                AttendanceTableCellCard, {
                isHeader: true,
                radius: 'none',
                headerTitle: daysNamePerMonth.value[30 - 1] ? `${daysNamePerMonth.value[30 - 1]?.day} ${daysNamePerMonth.value[30 - 1]?.day_name} ` : '',
            }

            ),


        renderRow: (row: any) =>
            h(
                AttendanceTableCellCard, {
                clickable: true,
                title: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-30`) ? AttendanceConsts.getAttendanceStatusIcon(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-30`).status) : '-',
                titleSize: 'small',
                statusColor: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-30`) ? AttendanceConsts.getAttendanceStatusColor(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-30`).status) : 'grey',

                color: 'disabled',
                onClick: () => {
                    if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-30`)) {
                        keyIncement.value++
                        selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-30`)
                        selectedEmployee.value = row
                        tableCellPopup.value = true
                    }

                }
            }

            ),

    },
}


const columns31Sub = {
    "d29": {
        align: 'center',
        grow: false,
        renderHeader: () =>
            h(
                AttendanceTableCellCard, {
                isHeader: true,
                radius: 'none',
                headerTitle: daysNamePerMonth.value[29 - 1] ? `${daysNamePerMonth.value[29 - 1]?.day} ${daysNamePerMonth.value[29 - 1]?.day_name} ` : '',
            }

            ),


        renderRow: (row: any) =>
            h(
                AttendanceTableCellCard, {
                clickable: true,
                title: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-29`) ? AttendanceConsts.getAttendanceStatusIcon(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-29`).status) : '-',
                titleSize: 'small',
                statusColor: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-29`) ? AttendanceConsts.getAttendanceStatusColor(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-29`).status) : 'grey',

                color: 'disabled',
                onClick: () => {
                    if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-29`)) {
                        keyIncement.value++
                        selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-29`)
                        selectedEmployee.value = row
                        tableCellPopup.value = true
                    }

                }
            }

            ),

    },
    "d30": {
        align: 'center',
        grow: false,
        renderHeader: () =>
            h(
                AttendanceTableCellCard, {
                isHeader: true,
                radius: 'none',
                headerTitle: daysNamePerMonth.value[30 - 1] ? `${daysNamePerMonth.value[30 - 1]?.day} ${daysNamePerMonth.value[30 - 1]?.day_name} ` : '',
            }

            ),


        renderRow: (row: any) =>
            h(
                AttendanceTableCellCard, {
                clickable: true,
                title: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-30`) ? AttendanceConsts.getAttendanceStatusIcon(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-30`).status) : '-',
                titleSize: 'small',
                statusColor: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-30`) ? AttendanceConsts.getAttendanceStatusColor(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-30`).status) : 'grey',

                color: 'disabled',
                onClick: () => {
                    if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-30`)) {
                        keyIncement.value++
                        selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-30`)
                        selectedEmployee.value = row
                        tableCellPopup.value = true
                    }

                }
            }

            ),

    },
    "d31": {
        align: 'center',
        grow: false,
        renderHeader: () =>
            h(
                AttendanceTableCellCard, {
                isHeader: true,
                radius: 'none',
                headerTitle: daysNamePerMonth.value[31 - 1] ? `${daysNamePerMonth.value[31 - 1]?.day} ${daysNamePerMonth.value[31 - 1]?.day_name} ` : '',
            }

            ),


        renderRow: (row: any) =>
            h(
                AttendanceTableCellCard, {
                clickable: true,
                title: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-31`) ? AttendanceConsts.getAttendanceStatusIcon(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-31`).status) : '-',
                titleSize: 'small',
                statusColor: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-31 `) ? AttendanceConsts.getAttendanceStatusColor(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-31   `).status) : 'grey',

                color: 'disabled',
                onClick: () => {
                    if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-31`)) {
                        keyIncement.value++
                        selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-31`)
                        selectedEmployee.value = row
                        tableCellPopup.value = true
                    }

                }
            }

            ),

    },
}

let columns31 = {};
Object.assign(columns31, columns28, columns31Sub)
let columns30 = {};
Object.assign(columns30, columns28, columns30Sub)
let columns29 = {};
Object.assign(columns29, columns28, columns29Sub) 
</script>

<template>
    <EmployeeAttendanceTableHeader :key="keyIncrement" :title="viewWrapper.pageTitle" @search="search"
        :pagination="paginationVar" :default_per_page="default_per_page" @resetFilter="resetFilter"
        :selected_month="selectedMonth" :selected_year="selectedYear.toString()" :days_per_month="selectedMonthDays" />
    <VFlexTableWrapper
        :columns="selectedMonthDays == 31 ? columns31 : selectedMonthDays == 30 ? columns30 : selectedMonthDays == 29 ? columns29 : columns28"
        :data="employeesAttendanceList" :limit="searchFilter.per_page" @update:sort="employeeSort">

        <VFlexTable clickable>
            <template #body>
                <div v-if="employeeStore?.loading || loading.fetch" class="flex-list-inner">
                    <div v-for="key in paginationVar.per_page" :key="key" class="flex-table-item">
                        <VFlexTableCell>
                            <VPlaceload />
                        </VFlexTableCell>

                    </div>
                </div>
                <div v-else-if="employeesAttendanceList.length === 0" class="flex-list-inner">
                    <VPlaceholderSection title="No matches" subtitle="There is no data that match your search."
                        class="my-6">
                    </VPlaceholderSection>
                </div>

            </template>
        </VFlexTable>
        <VFlexPagination v-if="(employeesAttendanceList.length != 0 && paginationVar.max_page != 1)"
            :current-page="paginationVar.page" class="mt-6" :item-per-page="paginationVar.per_page"
            :total-items="paginationVar.total" :max-links-displayed="3" no-router
            @update:current-page="getEmployeesAttendancePerPage" />
        <h6 v-if="employeesAttendanceList.length != 0 && !employeeStore?.loading">Showing {{
            paginationVar.page !=
                paginationVar.max_page
                ?
                (1 + ((paginationVar.page - 1) * paginationVar.count)) : paginationVar.page == 1 ? 1 : paginationVar.total
        }}
            to {{
                paginationVar.page !=
                    paginationVar.max_page ?
                    paginationVar.page *
                    paginationVar.per_page : paginationVar.total
            }} of {{ paginationVar.total }} entries</h6>

        <VPlaceloadText v-if="employeeStore?.loading" :lines="1" last-line-width="20%" class="mx-2" />
    </VFlexTableWrapper>
    <VModal :key="keyIncement" title="Attendance Details" :open="tableCellPopup" actions="right"
        @close="tableCellPopup = false">
        <template #content>
            <div class="is-flex is-justify-content-space-between">
                <div>
                    <h2 class="is-size-5 has-text-primary mb-0">{{ selectedEmployee.user.first_name }} {{
                        selectedEmployee.user.last_name
                    }}</h2>
                    <h4 class="mb-3 is-size-6"><span class=""> {{ selectedEmployee.position.name }}</span></h4>
                    <h2 class="is-size-5 mb-3">Date: <span class="has-text-primary"> {{ daysNamePerMonth.find((day)=> day.day == Number(selectedCell.date.split('-')[2]))?.day_name }} {{ selectedCell.date }}</span></h2>
                    <h2 class="is-size-5 mb-3">Status: <span class="has-text-primary">{{ AttendanceConsts.getAttendanceStatusName(selectedCell.status) }}</span></h2>
                </div>
                <div>
                    <VButton color="primary" raised @click="">Mark Attendance</VButton>
                </div>
            </div>

            <div class="form-fieldset">
                <div class="columns is-multiline">
                    <div class="column is-12">
                        <VCard elevated>
                            <h3 class="title is-6 mb-2">Check In</h3>
                            <p> {{ selectedCell.check_in != undefined ? selectedCell.check_in : 'No Data' }} </p>
                        </VCard>
                        <VCard elevated class="mt-2">
                            <h3 class="title is-6 mb-2">Check Out</h3>
                            <p> {{ selectedCell.check_out != undefined ? selectedCell.check_out : 'No Data' }} </p>
                        </VCard>
                    </div>
                </div>
            </div>

        </template>
        <template #action="{ close }">
            <VLoader size="small" :active="loading.delete">
                <VButton v-if="selectedCell.status == AttendanceConsts.PENDING_ABSENCE ||
                selectedCell.status == AttendanceConsts.PENDING_PARTIAL_ABSENCE ||
                selectedCell.status == AttendanceConsts.JUSTIFIED_ABSENCE ||
                selectedCell.status == AttendanceConsts.JUSTIFIED_PARTIAL_ABSENCE ||
                selectedCell.status == AttendanceConsts.UNJUSTIFIED_PARTIAL_ABSENCE ||
                selectedCell.status == AttendanceConsts.UNJUTIFIED_ABSENCE" class="mr-2" color="danger" outlined
                    @click="">
                    Unjustify Attendance</VButton>
            </VLoader>
            <VLoader size="small" :active="loading.delete">
                <VButton v-if="selectedCell.status == AttendanceConsts.PENDING_ABSENCE ||
                selectedCell.status == AttendanceConsts.PENDING_PARTIAL_ABSENCE ||
                selectedCell.status == AttendanceConsts.JUSTIFIED_ABSENCE ||
                selectedCell.status == AttendanceConsts.JUSTIFIED_PARTIAL_ABSENCE ||
                selectedCell.status == AttendanceConsts.UNJUSTIFIED_PARTIAL_ABSENCE ||
                selectedCell.status == AttendanceConsts.UNJUTIFIED_ABSENCE" class="mr-2" color="primary" outlined
                    @click="">
                    Justify Attendance</VButton>
            </VLoader>
        </template>
    </VModal>

</template>
<style scoped lang="scss">
.is-clickable {
    cursor: default !important;
}
</style>