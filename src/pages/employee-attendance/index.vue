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
import { DateConsts, DaysNamePerMonth, DaysPerMonth } from '/@src/models/HR/Attendance/Date/date';
import { AttendanceConsts, UpdateAttendance } from '/@src/models/HR/Attendance/EmployeeAttendance/employeeAttendance';
import { updateAttendance, justifyAttendance } from '/@src/services/HR/Attendance/EmployeeAttendance/attendanceService';
import { useI18n } from 'vue-i18n';
import { GeneratedSalariesMonth } from '/@src/models/HR/Payroll/GeneratedSalariesMonth/generatedSalariesMonth';
import { getGeneratedMonths } from '/@src/services/HR/Payroll/GeneratedSalariesMonth/generatedSalariesMonthService';
import { useDarkmode } from '/@src/stores/darkmode';
import Datepicker from '@vuepic/vue-datepicker';
import { useDate } from '/@src/stores/HR/Attendance/Date/dateStore';
const viewWrapper = useViewWrapper()
const { t, locale } = useI18n()
viewWrapper.setPageTitle(t('employee_attendance.table.title'))
useHead({
  title: t('employee_attendance.table.title'),
})
const dark = useDarkmode()
const notif = useNotyf() as Notyf
const searchFilter = ref(defaultEmployeeAttendanceSearchFilter)
const employeesAttendanceList = ref<Array<EmployeeAttendance>>([])
const paginationVar = ref(defaultPagination)
const router = useRouter()
const employeeStore = useEmployee()
const default_per_page = ref(1)
const keyIncrement = ref(0)
const tableCellPopup = ref(false)
const markAttendancePopup = ref(false)
const canMarkAttendanceSelectedCell = ref(false)
const selectedCell = ref<Attendance>(defaultAttendance)
const selectedEmployee = ref<EmployeeAttendance>(defaultEmployeeAttendance)
const daysPerMonth = ref<DaysPerMonth[]>([])
const daysNamePerMonth = ref<DaysNamePerMonth[]>([])
const selectedCheckInTime = ref({ hours: '00', minutes: '00' })
const selectedCheckOutTime = ref({ hours: '00', minutes: '00' })
const keyIncement = ref(0)
const loading = ref({ update: false, delete: false, fetch: false })
const currentYear = new Date().getFullYear()
const currentMonth = new Date().getMonth() + 1 < 10 ? "0" + (new Date().getMonth() + 1).toString() : (new Date().getMonth() + 1).toString()
const selectedYear = ref(currentYear)
const selectedMonth = ref(currentMonth)
const selectedMonthDays = ref(28)
const daysPerMonthResult = await getDaysPerMonth(currentYear);
const generatedSalariesMonthsList = ref<GeneratedSalariesMonth[]>([])
daysPerMonth.value = daysPerMonthResult.daysPerMonth
const originalDaysPerMonth = daysPerMonthResult.daysPerMonth.find((month) => month.month == Number(currentMonth))?.number_of_days
const daysNamePerMonthResult = await getDaysNamePerMonth(currentYear, Number(currentMonth));
daysNamePerMonth.value = daysNamePerMonthResult.daysName
const originalDaysName = daysNamePerMonthResult.daysName
selectedMonthDays.value = daysPerMonth.value.find((month) => month.month == Number(selectedMonth.value))?.number_of_days ?? 28
const dateStore = useDate()
onMounted(async () => {

  const { employeesAttendance, pagination } = await getEmployeesAttendance(searchFilter.value)
  employeesAttendanceList.value = employeesAttendance
  paginationVar.value = pagination
  keyIncrement.value = keyIncrement.value + 1
  default_per_page.value = pagination.per_page
  const { generatedSalariesMonths } = await getGeneratedMonths()
  generatedSalariesMonthsList.value = generatedSalariesMonths


});

const search = async (newSearchFilter: EmployeeAttendanceSearchFilter, daysPerMonth: number) => {

  if (dateStore.loading) {
    return;
  }
  loading.value.fetch = true
  if (newSearchFilter.attendance_from != undefined) {

    const dateSpliter = newSearchFilter.attendance_from?.split('-') ?? '01'
    selectedMonthDays.value = daysPerMonth
    const daysNamePerMonthResult = await getDaysNamePerMonth(Number(dateSpliter[0]), Number(dateSpliter[1]));
    daysNamePerMonth.value = daysNamePerMonthResult.daysName

    selectedMonth.value = dateSpliter[1]
    selectedYear.value = Number(dateSpliter[0])
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
  selectedYear.value = currentYear
  selectedMonth.value = currentMonth
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
const formatTime = () => {
  if (selectedCell.value.check_in) {
    const [hour, minute, second] = selectedCell.value.check_in.split(':')
    selectedCheckInTime.value = { hours: Number(hour) < 10 && Number(hour) > 0 ? hour.substring(1) : hour, minutes: Number(minute) < 10 && Number(minute) > 0 ? minute.substring(1) : minute }

  } else {
    selectedCheckInTime.value = { hours: "00", minutes: "00" }

  }
  if (selectedCell.value.check_out) {
    const [hour, minute, second] = selectedCell.value.check_out.split(':')
    selectedCheckOutTime.value = { hours: Number(hour) < 10 && Number(hour) > 0 ? hour.substring(1) : hour, minutes: Number(minute) < 10 && Number(minute) > 0 ? minute.substring(1) : minute }
  } else {
    selectedCheckOutTime.value = { hours: "00", minutes: "00" }

  }
}

const updateEmployeeAttendance = async () => {
  let formatedCheckInMinute;
  let formatedCheckInHour;
  let formatedCheckOutMinute;
  let formatedCheckOutHour;
  if (Number(selectedCheckInTime.value.minutes) < 10 && Number(selectedCheckInTime.value.minutes) > 0)
    formatedCheckInMinute = '0' + selectedCheckInTime.value.minutes
  else
    formatedCheckInMinute = selectedCheckInTime.value.minutes

  if (Number(selectedCheckInTime.value.hours) < 10 && Number(selectedCheckInTime.value.hours) > 0)
    formatedCheckInHour = '0' + selectedCheckInTime.value.hours
  else
    formatedCheckInHour = selectedCheckInTime.value.hours
  if (Number(selectedCheckOutTime.value.minutes) < 10 && Number(selectedCheckOutTime.value.minutes) > 0)
    formatedCheckOutMinute = '0' + selectedCheckOutTime.value.minutes
  else
    formatedCheckOutMinute = selectedCheckOutTime.value.minutes

  if (Number(selectedCheckOutTime.value.hours) < 10 && Number(selectedCheckOutTime.value.hours) > 0)
    formatedCheckOutHour = '0' + selectedCheckOutTime.value.hours
  else
    formatedCheckOutHour = selectedCheckOutTime.value.hours

  if (Number(formatedCheckInHour) > Number(formatedCheckOutHour)) {
    await sleep(200);


    notif.error(t('toast.error.Attendance.time'))

    return
  }

  else if (Number(formatedCheckInHour) == Number(formatedCheckOutHour)) {
    if (Number(formatedCheckInMinute) >= Number(formatedCheckOutMinute)) {
      await sleep(200);

      notif.error(t('toast.error.Attendance.time'))

      return
    }

  }
  if (selectedCell.value.check_in != undefined) {
    const checkInSpliter = selectedCell.value.check_in?.split(':')
    if (Number(formatedCheckInHour) > Number(checkInSpliter[0])) {
      await sleep(200);
      notif.error(t('toast.error.Attendance.check_in'))
      return

    } else if (Number(formatedCheckInHour) == Number(checkInSpliter[0])) {
      if (Number(formatedCheckInMinute) > Number(checkInSpliter[1])) {
        await sleep(200);
        notif.error(t('toast.error.Attendance.check_in'))
        return

      }
    }
  }
  if (selectedCell.value.check_out != undefined) {
    const checkOutSpliter = selectedCell.value.check_out?.split(':')
    if (Number(formatedCheckOutHour) < Number(checkOutSpliter[0])) {
      await sleep(200);
      notif.error(t('toast.error.Attendance.check_out'))
      return

    } else if (Number(formatedCheckOutHour) == Number(checkOutSpliter[0])) {
      if (Number(formatedCheckOutMinute) < Number(checkOutSpliter[1])) {
        await sleep(200);
        notif.error(t('toast.error.Attendance.check_out'))
        return

      }
    }

  }
  const updateCheckIn = formatedCheckInHour + ':' + formatedCheckInMinute + ':00'
  const updateCheckOut = formatedCheckOutHour + ':' + formatedCheckOutMinute + ':00'
  const updateAttendanceVar: UpdateAttendance = { check_in: updateCheckIn, check_out: updateCheckOut }

  loading.value.update = true
  const { message, success, attendance } = await updateAttendance(selectedCell.value.id, updateAttendanceVar)
  if (success) {
    await search(searchFilter.value, selectedMonthDays.value)
    notif.dismissAll()
    await sleep(200);
    notif.success(t('toast.success.edit'))
    selectedCell.value.check_in = attendance.check_in
    selectedCell.value.check_out = attendance.check_out
    selectedCell.value.status = attendance.status
  } else {
    await sleep(200);

    notif.error(message)
  }
  keyIncement.value++
  loading.value.update = false

  markAttendancePopup.value = false








}
const justifyEmployeeAttendance = async (isJustify: boolean) => {
  if (isJustify)
    loading.value.update = true
  else
    loading.value.delete = true

  const { message, success, attendance } = await justifyAttendance(selectedCell.value.id, isJustify)
  if (success) {
    await search(searchFilter.value, selectedMonthDays.value)
    if (isJustify) {
      notif.dismissAll()
      await sleep(200);
      notif.success(t('toast.success.justified'))
    } else {
      notif.dismissAll()
      await sleep(200);
      notif.success(t('toast.success.unjustified'))
    }
    selectedCell.value.status = attendance.status
  } else {
    await sleep(200);
    notif.error(message)
  }
  keyIncement.value++
  loading.value.update = false
  loading.value.delete = false

  tableCellPopup.value = false








}

const canMarkAttendance = () => {
  let canMark = true
  const [sellectedYear, selectedMonth, selectedDay] = selectedCell.value.date.split("-")
  generatedSalariesMonthsList.value.forEach(generatedMonth => {
    let [generatedFromYear, generatedFromMonth, generatedFromDay] = generatedMonth.generated_from.split("-")
    let [generatedToYear, generatedToMonth, generatedToDay] = generatedMonth.generated_to.split("-")
    let generatedFromDate = new Date(Number(generatedFromYear), Number(generatedFromMonth) - 1, Number(generatedFromDay));
    let generatedToDate = new Date(Number(generatedToYear), Number(generatedToMonth) - 1, Number(generatedToDay));
    let selectedDate = new Date(Number(sellectedYear), Number(selectedMonth) - 1, Number(selectedDay));
    if (selectedDate >= generatedFromDate && selectedDate <= generatedToDate) {
      canMark = false;
    }
  });

  return canMark;
}

const columns28 = {

  "users.name": {
    align: 'center',

    label: t('employee_attendance.table.columns.employee_name'),
    renderHeader: () =>
      h(
        AttendanceTableCellCard, {
        isHeader: true,
        isMainHeader: true,
        radius: 'none',
        headerTitle: t('employee_attendance.table.columns.employee_name'),
      }

      ),
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

    grow: false,
    renderHeader: () =>
      h(
        AttendanceTableCellCard, {
        isHeader: true,
        radius: 'none',
        headerTitle: `${daysNamePerMonth.value[0].day} ${t(`dates.days_abbr.${daysNamePerMonth.value[0].day_name.toLowerCase()}`)}`,
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
        onClick: async () => {

          if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-01`)) {
            keyIncement.value++
            selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-01`)
            selectedEmployee.value = row
            tableCellPopup.value = true
            formatTime()
            canMarkAttendanceSelectedCell.value = canMarkAttendance()

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
        headerTitle: `${daysNamePerMonth.value[1].day} ${t(`dates.days_abbr.${daysNamePerMonth.value[1].day_name.toLowerCase()}`)}`,
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
        onClick: async () => {
          if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-02`)) {
            keyIncement.value++
            selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-02`)
            selectedEmployee.value = row
            tableCellPopup.value = true
            formatTime()
            canMarkAttendanceSelectedCell.value = canMarkAttendance()

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
        headerTitle: `${daysNamePerMonth.value[2].day} ${t(`dates.days_abbr.${daysNamePerMonth.value[2].day_name.toLowerCase()}`)}`,
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

        onClick: async () => {
          if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-03`)) {
            keyIncement.value++
            selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-03`)
            selectedEmployee.value = row
            tableCellPopup.value = true
            formatTime()
            canMarkAttendanceSelectedCell.value = canMarkAttendance()

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
        headerTitle: `${daysNamePerMonth.value[3].day} ${t(`dates.days_abbr.${daysNamePerMonth.value[3].day_name.toLowerCase()}`)}`,
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

        onClick: async () => {
          if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-04`)) {
            keyIncement.value++
            selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-04`)
            selectedEmployee.value = row
            tableCellPopup.value = true
            formatTime()
            canMarkAttendanceSelectedCell.value = canMarkAttendance()

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
        headerTitle: `${daysNamePerMonth.value[4].day} ${t(`dates.days_abbr.${daysNamePerMonth.value[4].day_name.toLowerCase()}`)}`,
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

        onClick: async () => {
          if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-05`)) {
            keyIncement.value++
            selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-05`)
            selectedEmployee.value = row
            tableCellPopup.value = true
            formatTime()
            canMarkAttendanceSelectedCell.value = canMarkAttendance()


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
        headerTitle: `${daysNamePerMonth.value[5].day} ${t(`dates.days_abbr.${daysNamePerMonth.value[5].day_name.toLowerCase()}`)}`,
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

        onClick: async () => {
          if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-06`)) {
            keyIncement.value++
            selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-06`)
            selectedEmployee.value = row
            tableCellPopup.value = true
            formatTime()
            canMarkAttendanceSelectedCell.value = canMarkAttendance()

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
        headerTitle: `${daysNamePerMonth.value[6].day} ${t(`dates.days_abbr.${daysNamePerMonth.value[6].day_name.toLowerCase()}`)}`,
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
        onClick: async () => {
          if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-07`)) {
            keyIncement.value++
            selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-07`)
            selectedEmployee.value = row
            tableCellPopup.value = true
            formatTime()
            canMarkAttendanceSelectedCell.value = canMarkAttendance()

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
        headerTitle: `${daysNamePerMonth.value[7].day} ${t(`dates.days_abbr.${daysNamePerMonth.value[7].day_name.toLowerCase()}`)}`,
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
        onClick: async () => {
          if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-08`)) {
            keyIncement.value++
            selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-08`)
            selectedEmployee.value = row
            tableCellPopup.value = true
            formatTime()
            canMarkAttendanceSelectedCell.value = canMarkAttendance()

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
        headerTitle: `${daysNamePerMonth.value[8].day} ${t(`dates.days_abbr.${daysNamePerMonth.value[8].day_name.toLowerCase()}`)}`,
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
        onClick: async () => {
          if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-09`)) {
            keyIncement.value++
            selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-09`)
            selectedEmployee.value = row
            tableCellPopup.value = true
            formatTime()
            canMarkAttendanceSelectedCell.value = canMarkAttendance()


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
        headerTitle: `${daysNamePerMonth.value[9].day} ${t(`dates.days_abbr.${daysNamePerMonth.value[9].day_name.toLowerCase()}`)}`,
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
        onClick: async () => {
          if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-10`)) {
            keyIncement.value++
            selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-10`)
            selectedEmployee.value = row
            tableCellPopup.value = true
            formatTime()
            canMarkAttendanceSelectedCell.value = canMarkAttendance()

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
        headerTitle: `${daysNamePerMonth.value[10].day} ${t(`dates.days_abbr.${daysNamePerMonth.value[10].day_name.toLowerCase()}`)}`,
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

        onClick: async () => {
          if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-11`)) {
            keyIncement.value++
            selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-11`)
            selectedEmployee.value = row
            tableCellPopup.value = true
            formatTime()
            canMarkAttendanceSelectedCell.value = canMarkAttendance()

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
        headerTitle: `${daysNamePerMonth.value[11].day} ${t(`dates.days_abbr.${daysNamePerMonth.value[11].day_name.toLowerCase()}`)}`,
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
        onClick: async () => {
          if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-12`)) {
            keyIncement.value++
            selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-12`)
            selectedEmployee.value = row
            tableCellPopup.value = true
            formatTime()
            canMarkAttendanceSelectedCell.value = canMarkAttendance()

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
        headerTitle: `${daysNamePerMonth.value[12].day} ${t(`dates.days_abbr.${daysNamePerMonth.value[12].day_name.toLowerCase()}`)}`,
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
        onClick: async () => {
          if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-13`)) {
            keyIncement.value++
            selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-13`)
            selectedEmployee.value = row
            tableCellPopup.value = true
            formatTime()
            canMarkAttendanceSelectedCell.value = canMarkAttendance()

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
        headerTitle: `${daysNamePerMonth.value[13].day} ${t(`dates.days_abbr.${daysNamePerMonth.value[13].day_name.toLowerCase()}`)}`,
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

        onClick: async () => {
          if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-14`)) {
            keyIncement.value++
            selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-14`)
            selectedEmployee.value = row
            tableCellPopup.value = true
            formatTime()
            canMarkAttendanceSelectedCell.value = canMarkAttendance()

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
        headerTitle: `${daysNamePerMonth.value[15 - 1].day} ${t(`dates.days_abbr.${daysNamePerMonth.value[15 - 1].day_name.toLowerCase()}`)}`,
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
        onClick: async () => {
          if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-15`)) {
            keyIncement.value++
            selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-15`)
            selectedEmployee.value = row
            tableCellPopup.value = true
            formatTime()
            canMarkAttendanceSelectedCell.value = canMarkAttendance()

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
        headerTitle: `${daysNamePerMonth.value[16 - 1].day} ${t(`dates.days_abbr.${daysNamePerMonth.value[16 - 1].day_name.toLowerCase()}`)}`,
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
        onClick: async () => {
          if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-16`)) {
            keyIncement.value++
            selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-16`)
            selectedEmployee.value = row
            tableCellPopup.value = true
            formatTime()
            canMarkAttendanceSelectedCell.value = canMarkAttendance()

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
        headerTitle: `${daysNamePerMonth.value[17 - 1].day} ${t(`dates.days_abbr.${daysNamePerMonth.value[17 - 1].day_name.toLowerCase()}`)}`,
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
        onClick: async () => {
          if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-17`)) {
            keyIncement.value++
            selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-17`)
            selectedEmployee.value = row
            tableCellPopup.value = true
            formatTime()
            canMarkAttendanceSelectedCell.value = canMarkAttendance()

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
        headerTitle: `${daysNamePerMonth.value[18 - 1].day} ${t(`dates.days_abbr.${daysNamePerMonth.value[18 - 1].day_name.toLowerCase()}`)}`,
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
        onClick: async () => {
          if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-18`)) {
            keyIncement.value++
            selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-18`)
            selectedEmployee.value = row
            tableCellPopup.value = true
            formatTime()
            canMarkAttendanceSelectedCell.value = canMarkAttendance()

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
        headerTitle: `${daysNamePerMonth.value[19 - 1].day} ${t(`dates.days_abbr.${daysNamePerMonth.value[19 - 1].day_name.toLowerCase()}`)}`,
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
        onClick: async () => {
          if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-19`)) {
            keyIncement.value++
            selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-19`)
            selectedEmployee.value = row
            tableCellPopup.value = true
            formatTime()
            canMarkAttendanceSelectedCell.value = canMarkAttendance()

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
        headerTitle: `${daysNamePerMonth.value[20 - 1].day} ${t(`dates.days_abbr.${daysNamePerMonth.value[20 - 1].day_name.toLowerCase()}`)}`,
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
        onClick: async () => {
          if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-20`)) {
            keyIncement.value++
            selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-20`)
            selectedEmployee.value = row
            tableCellPopup.value = true
            formatTime()
            canMarkAttendanceSelectedCell.value = canMarkAttendance()

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
        headerTitle: `${daysNamePerMonth.value[21 - 1].day} ${t(`dates.days_abbr.${daysNamePerMonth.value[21 - 1].day_name.toLowerCase()}`)}`,
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
        onClick: async () => {
          if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-21`)) {
            keyIncement.value++
            selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-21`)
            selectedEmployee.value = row
            tableCellPopup.value = true
            formatTime()
            canMarkAttendanceSelectedCell.value = canMarkAttendance()

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
        headerTitle: `${daysNamePerMonth.value[22 - 1].day} ${t(`dates.days_abbr.${daysNamePerMonth.value[22 - 1].day_name.toLowerCase()}`)}`,
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
        onClick: async () => {
          if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-22`)) {
            keyIncement.value++
            selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-22`)
            selectedEmployee.value = row
            tableCellPopup.value = true
            formatTime()
            canMarkAttendanceSelectedCell.value = canMarkAttendance()

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
        headerTitle: `${daysNamePerMonth.value[23 - 1].day} ${t(`dates.days_abbr.${daysNamePerMonth.value[23 - 1].day_name.toLowerCase()}`)}`,
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
        onClick: async () => {
          if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-23`)) {
            keyIncement.value++
            selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-23`)
            selectedEmployee.value = row
            tableCellPopup.value = true
            formatTime()
            canMarkAttendanceSelectedCell.value = canMarkAttendance()

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
        headerTitle: `${daysNamePerMonth.value[24 - 1].day} ${t(`dates.days_abbr.${daysNamePerMonth.value[24 - 1].day_name.toLowerCase()}`)}`,
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

        onClick: async () => {
          if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-24`)) {
            keyIncement.value++
            selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-24`)
            selectedEmployee.value = row
            tableCellPopup.value = true
            formatTime()
            canMarkAttendanceSelectedCell.value = canMarkAttendance()

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
        headerTitle: `${daysNamePerMonth.value[25 - 1].day} ${t(`dates.days_abbr.${daysNamePerMonth.value[25 - 1].day_name.toLowerCase()}`)}`,
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
        onClick: async () => {
          if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-25`)) {
            keyIncement.value++
            selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-25`)
            selectedEmployee.value = row
            tableCellPopup.value = true
            formatTime()
            canMarkAttendanceSelectedCell.value = canMarkAttendance()

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
        headerTitle: `${daysNamePerMonth.value[26 - 1].day} ${t(`dates.days_abbr.${daysNamePerMonth.value[26 - 1].day_name.toLowerCase()}`)}`,
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
        onClick: async () => {
          if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-26`)) {
            keyIncement.value++
            selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-26`)
            selectedEmployee.value = row
            formatTime()
            canMarkAttendanceSelectedCell.value = canMarkAttendance()
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
        headerTitle: `${daysNamePerMonth.value[27 - 1].day} ${t(`dates.days_abbr.${daysNamePerMonth.value[27 - 1].day_name.toLowerCase()}`)}`,
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
        onClick: async () => {
          if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-27`)) {
            keyIncement.value++
            selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-27`)
            selectedEmployee.value = row
            formatTime()
            canMarkAttendanceSelectedCell.value = canMarkAttendance()
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
        headerTitle: `${daysNamePerMonth.value[28 - 1].day} ${t(`dates.days_abbr.${daysNamePerMonth.value[28 - 1].day_name.toLowerCase()}`)}`,
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
        onClick: async () => {
          if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-28`)) {
            keyIncement.value++
            selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-28`)
            selectedEmployee.value = row
            tableCellPopup.value = true
            formatTime()
            canMarkAttendanceSelectedCell.value = canMarkAttendance()

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
        headerTitle: daysNamePerMonth.value[29 - 1] ? `${daysNamePerMonth.value[29 - 1]?.day} ${t(`dates.days_abbr.${daysNamePerMonth.value[29 - 1].day_name.toLowerCase()}`)}` : '',
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
        onClick: async () => {
          if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-29`)) {
            keyIncement.value++
            selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-29`)
            selectedEmployee.value = row
            tableCellPopup.value = true
            formatTime()
            canMarkAttendanceSelectedCell.value = canMarkAttendance()

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
        headerTitle: daysNamePerMonth.value[29 - 1] ? `${daysNamePerMonth.value[29 - 1]?.day} ${t(`dates.days_abbr.${daysNamePerMonth.value[29 - 1].day_name.toLowerCase()}`)}` : '',
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
        onClick: async () => {
          if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-29`)) {
            keyIncement.value++
            selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-29`)
            selectedEmployee.value = row
            tableCellPopup.value = true
            formatTime()
            canMarkAttendanceSelectedCell.value = canMarkAttendance()

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
        headerTitle: daysNamePerMonth.value[30 - 1] ? `${daysNamePerMonth.value[30 - 1]?.day} ${t(`dates.days_abbr.${daysNamePerMonth.value[30 - 1].day_name.toLowerCase()}`)}` : '',
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
        onClick: async () => {
          if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-30`)) {
            keyIncement.value++
            selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-30`)
            selectedEmployee.value = row
            tableCellPopup.value = true
            formatTime()
            canMarkAttendanceSelectedCell.value = canMarkAttendance()

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
        headerTitle: daysNamePerMonth.value[29 - 1] ? `${daysNamePerMonth.value[29 - 1]?.day} ${t(`dates.days_abbr.${daysNamePerMonth.value[29 - 1].day_name.toLowerCase()}`)}` : '',
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
        onClick: async () => {
          if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-29`)) {
            keyIncement.value++
            selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-29`)
            selectedEmployee.value = row
            tableCellPopup.value = true
            formatTime()
            canMarkAttendanceSelectedCell.value = canMarkAttendance()

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
        headerTitle: daysNamePerMonth.value[30 - 1] ? `${daysNamePerMonth.value[30 - 1]?.day} ${t(`dates.days_abbr.${daysNamePerMonth.value[30 - 1].day_name.toLowerCase()}`)}` : '',
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
        onClick: async () => {
          if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-30`)) {
            keyIncement.value++
            selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-30`)
            selectedEmployee.value = row
            formatTime()
            canMarkAttendanceSelectedCell.value = canMarkAttendance()
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
        headerTitle: daysNamePerMonth.value[31 - 1] ? `${daysNamePerMonth.value[31 - 1]?.day} ${t(`dates.days_abbr.${daysNamePerMonth.value[31 - 1].day_name.toLowerCase()}`)}` : '',
      }

      ),


    renderRow: (row: any) =>
      h(
        AttendanceTableCellCard, {
        clickable: true,
        title: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-31`) ? AttendanceConsts.getAttendanceStatusIcon(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-31`).status) : '-',
        titleSize: 'small',
        statusColor: row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-31`) ? AttendanceConsts.getAttendanceStatusColor(row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-31`).status) : 'grey',

        color: 'disabled',
        onClick: async () => {
          if (row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-31`)) {
            keyIncement.value++
            selectedCell.value = row?.attendances?.find((element: any) => element.date == `${selectedYear.value}-${selectedMonth.value}-31`)
            selectedEmployee.value = row
            tableCellPopup.value = true
            formatTime()
            canMarkAttendanceSelectedCell.value = canMarkAttendance()

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
    :selected_month="selectedMonth" :selected_year="selectedYear.toString()" :days_per_month="selectedMonthDays"
    :current_month="currentMonth" :current_year="currentYear.toString()" />
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
          <VPlaceholderSection :title="t('tables.placeholder.title')" :subtitle="t('tables.placeholder.subtitle')"
            class="my-6">
          </VPlaceholderSection>
        </div>

      </template>
    </VFlexTable>
    <VFlexPagination v-if="(employeesAttendanceList.length != 0 && paginationVar.max_page != 1)"
      :current-page="paginationVar.page" class="mt-6" :item-per-page="paginationVar.per_page"
      :total-items="paginationVar.total" :max-links-displayed="3" no-router
      @update:current-page="getEmployeesAttendancePerPage" />
    <h6 class="pt-2 is-size-7" v-if="employeesAttendanceList.length != 0 && !employeeStore?.loading && !loading.fetch">
      {{
        t('tables.pagination_footer', { from_number: paginationVar.page !=
          paginationVar.max_page
          ?
          (1 + ((paginationVar.page - 1) * paginationVar.count)) : paginationVar.page == paginationVar.max_page ? (1 +
            ((paginationVar.page - 1) * paginationVar.per_page)) : paginationVar.page == 1 ? 1 : paginationVar.total
        , to_number: paginationVar.page !=
          paginationVar.max_page ?
          paginationVar.page *
          paginationVar.per_page : paginationVar.total, all_number: paginationVar.total
      })}}</h6>

    <VPlaceloadText v-if="employeeStore?.loading || loading.fetch" :lines="1" last-line-width="20%" class="mx-2" />
  </VFlexTableWrapper>
  <VModal :key="keyIncement" :title="t('employee_attendance.table.attendance_details_modal.title')"
    :open="tableCellPopup" actions="right" @close="tableCellPopup = false">
    <template #content>
      <div class="is-flex is-justify-content-space-between">
        <div>
          <h2 class="is-size-6 has-text-primary mb-0">{{ selectedEmployee.user.first_name }} {{
            selectedEmployee.user.last_name
          }}</h2>
          <h4 class="mb-3 is-size-7"><span class=""> {{ selectedEmployee.position.name }}</span></h4>
          <h2 class="is-size-7 mb-3">{{ t('employee_attendance.table.attendance_details_modal.date') }} <span
              class="has-text-primary is-size-6"> {{
  t(`dates.days_abbr.${daysNamePerMonth.find((day) =>
    day.day == Number(selectedCell.date.split('-')[2]))?.day_name.toLowerCase()
}`)
              }} {{
              selectedCell.date
              }}</span></h2>
          <h2 class="is-size-7 mb-3">{{t('employee_attendance.table.attendance_details_modal.status')}} <span
              class="has-text-primary is-size-6">{{
                            t(`attendance_status.${
                AttendanceConsts.getAttendanceStatusName(selectedCell.status).replaceAll(' ',
                  '_').toLowerCase()
              }`) }}</span></h2>
        </div>
        <div>
          <VButton color="primary" v-if="canMarkAttendanceSelectedCell" raised class="is-size-7"
            @click="markAttendancePopup = true">{{
            t('employee_attendance.table.attendance_details_modal.mark_attendance')
            }}</VButton>
        </div>
      </div>

      <div class="form-fieldset">
        <div class="columns is-multiline">
          <div class="column is-12">
            <VCard elevated>
              <h3 class="title is-7 mb-2">{{
              t('employee_attendance.table.attendance_details_modal.check_in')
              }}</h3>
              <p> {{
              selectedCell.check_in != undefined ? selectedCell.check_in :
              t('employee_attendance.table.attendance_details_modal.no_data')
              }} </p>
            </VCard>
            <VCard elevated class="mt-2">
              <h3 class="title is-7 mb-2"> {{
              t('employee_attendance.table.attendance_details_modal.check_out')
              }} </h3>
              <p> {{
              selectedCell.check_out != undefined ? selectedCell.check_out :
              t('employee_attendance.table.attendance_details_modal.no_data')
              }} </p>
            </VCard>
          </div>
        </div>
      </div>

    </template>
    <template #action="{ close }">
      <VLoader size="small" :active="loading.delete">
        <VButton :disabled="loading.update" v-if="(
        selectedCell.status == AttendanceConsts.PENDING_ABSENCE ||
        selectedCell.status == AttendanceConsts.PENDING_PARTIAL_ABSENCE ||
        selectedCell.status == AttendanceConsts.JUSTIFIED_ABSENCE ||
        selectedCell.status == AttendanceConsts.UNJUTIFIED_ABSENCE ||
        selectedCell.status == AttendanceConsts.JUSTIFIED_PARTIAL_ABSENCE ||
        selectedCell.status == AttendanceConsts.UNJUSTIFIED_PARTIAL_ABSENCE)
        && canMarkAttendanceSelectedCell" class="mr-2" color="danger" outlined
          @click="justifyEmployeeAttendance(false)">
          {{ t('employee_attendance.table.attendance_details_modal.unjustify_attendance') }}</VButton>
      </VLoader>
      <VLoader size="small" :active="loading.update">
        <VButton :disabled="loading.delete" v-if="(
        selectedCell.status == AttendanceConsts.PENDING_ABSENCE ||
        selectedCell.status == AttendanceConsts.PENDING_PARTIAL_ABSENCE ||
        selectedCell.status == AttendanceConsts.JUSTIFIED_ABSENCE ||
        selectedCell.status == AttendanceConsts.UNJUTIFIED_ABSENCE ||
        selectedCell.status == AttendanceConsts.JUSTIFIED_PARTIAL_ABSENCE ||
        selectedCell.status == AttendanceConsts.UNJUSTIFIED_PARTIAL_ABSENCE)
        && canMarkAttendanceSelectedCell" class="mr-2" color="primary" outlined
          @click="justifyEmployeeAttendance(true)">
          {{ t('employee_attendance.table.attendance_details_modal.justify_attendance') }}</VButton>
      </VLoader>
    </template>
  </VModal>
  <VModal :key="keyIncement" :title="t('employee_attendance.table.mark_attendance_modal.title')"
    :open="markAttendancePopup" actions="right" @close="markAttendancePopup = false">
    <template #content>
      <div class="is-flex is-justify-content-space-between">
        <div>
          <h2 class="is-size-6 has-text-primary mb-0">{{ selectedEmployee.user.first_name }} {{
          selectedEmployee.user.last_name
          }}</h2>
          <h4 class="mb-3 is-size-7"><span class=""> {{ selectedEmployee.position.name }}</span></h4>
          <h2 class="is-size-7 mb-3">{{ t('employee_attendance.table.mark_attendance_modal.date') }}<span
              class="has-text-primary is-size-6"> {{
              t(`dates.days_abbr.${
  daysNamePerMonth.find((day) =>
    day.day == Number(selectedCell.date.split('-')[2]))?.day_name.toLowerCase()
}`)
              }} {{
              selectedCell.date
              }}</span></h2>
          <h2 class="is-size-7 mb-3">{{t('employee_attendance.table.mark_attendance_modal.status')}} <span
              class="has-text-primary is-size-6">{{
              t(`attendance_status.${
  AttendanceConsts.getAttendanceStatusName(selectedCell.status).replaceAll(" ", "_").toLowerCase()
}`)
              }}</span></h2>
        </div>
      </div>

      <div class="form-fieldset">
        <div class="columns is-multiline">
          <div class="column is-12">
            <VCard elevated>
              <h3 class="title is-7 mb-2">
                {{ t('employee_attendance.table.mark_attendance_modal.check_in') }}</h3>
              <div class="column is-12">
                <div class="columns">

                  <VField class="column is-12 pl-0">
                    <VControl>
                      <Datepicker v-model="selectedCheckInTime" :locale="locale" time-picker
                        :cancel-text="t('date_picker.cancel')" :select-text="t('date_picker.select')"
                        :dark="dark.isDark" class="date-picker-dircetion" />
                    </VControl>
                  </VField>
                </div>

              </div>
            </VCard>
            <VCard elevated class="mt-2">
              <h3 class="title is-7 mb-2">
                {{ t('employee_attendance.table.mark_attendance_modal.check_out') }}</h3>
              <div class="column is-12">
                <div class="columns">

                  <VField class="column is-12 pl-0">
                    <VControl>
                      <Datepicker v-model="selectedCheckOutTime" :locale="locale" time-picker
                        :cancel-text="t('date_picker.cancel')" :select-text="t('date_picker.select')"
                        :dark="dark.isDark" class="date-picker-dircetion" />
                    </VControl>
                  </VField>
                </div>

              </div>
            </VCard>
          </div>
        </div>
      </div>

    </template>
    <template #action="{ close }">
      <VLoader size="small" :active="loading.update">
        <VButton class="mr-2" color="primary" @click="updateEmployeeAttendance">
          {{ t('modal.buttons.update') }}</VButton>
      </VLoader>
    </template>
  </VModal>

</template>
<style scoped lang="scss">
.is-clickable {
  cursor: default !important;
}
</style>
