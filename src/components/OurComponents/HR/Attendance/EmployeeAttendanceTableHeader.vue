<script lang="ts">
import { defaultUserStatusSearchFilter, UserStatus } from '/@src/models/Others/UserStatus/userStatus'
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
    const dark = useDarkmode();
    const month = ref({
      month: new Date().getMonth(),
      year: new Date().getFullYear()
    });

    const { t, locale } = useI18n()
    const iconArrow = locale.value == "ar" ? { left: "lnir lnir-chevron-right", right: "lnir lnir-chevron-left" } : { left: "lnir lnir-chevron-left", right: "lnir lnir-chevron-right" }

    const onOpen = () => {
      searchFilterPop.value = !searchFilterPop.value
      quickSearchField.value = ''
      context.emit('onOpen', searchFilterPop.value)
    }
    const popUpTrigger = (value: boolean) => {
      searchFilterPop.value = value
    }
    const updateSelectedMonth = async () => {
      selectedMonth.value = month.value.month + 1
      selectedYear.value = month.value.year
      if (selectedMonth.value < 10)
        selectedMonth.value = "0" + selectedMonth.value
      else selectedMonth.value = selectedMonth.value.toString()
      selectedYear.value = selectedYear.value.toString()
      await quickSearch()
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
        } else {
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
      month.value.month = Number(currentMonth) - 1
      month.value.year = Number(currentYear)
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
    return {
      dark,
      month,
      iconArrow,
      locale,
      t,
      AttendanceConsts,
      months,
      selectedMonth,
      selectedYear,
      keyIncrement,
      quickSearch,
      quickSearchField,
      is_reseted,
      default_per_page,
      onOpen,
      resetFilter_popup,
      search_filter,
      popUpTrigger,
      updateSelectedMonth,
      statusesList,
      resetFilter,
      search,
      searchFilterPop,
      perPage,
      pagination
    }

  },
  components: { Datepicker },
})
</script>

<template>
  <form class="form-layout" v-on:submit.prevent="quickSearch">
    <div class="form-outer">
      <div class="form-header stuck-header">
        <div class="form-header-inner">
          <div class="left mx-2 ">
            <div class="columns is-flex is-align-items-center">
              <div class="column">
                <Datepicker v-model="month" :cancel-text="t('date_picker.cancel')" :locale="locale" month-picker
                  :select-text="t('date_picker.select')" class="date-picker-dircetion" :dark="dark.isDark"
                  @update:model-value="updateSelectedMonth">
                  <template #arrow-left>
                    <i :class="iconArrow.left" aria-hidden="true"></i>
                  </template>
                  <template #arrow-right>
                    <i :class="iconArrow.right" aria-hidden="true"></i>
                  </template>

                </Datepicker>

              </div>
              <VControl class="mr-2" icon="feather:search">
                <VInput v-model="quickSearchField" :placeholder="t('employee_attendance.search_filter.quick_search')"
                  type="text" />
              </VControl>
              <VIconButton class="mr-2 is-hidden" icon="feather:search" type="submit" />
              <VIconButton class="mr-2" icon="fas fa-filter" @click.prevent="onOpen" />
              <VIconButton :raised="false" class="mr-2" color="danger" icon="feather:rotate-ccw"
                v-on:click="resetFilter" />

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
        <h6 class="is-size-7 mt-2"><span class="has-text-info">{{ t('employee_attendance.search_filter.note') }} </span>
          <span class="blue"> {{ AttendanceConsts.getAttendanceStatusIcon(AttendanceConsts.ATTEND) }}</span> ➡
          {{
  t(`attendance_status.${AttendanceConsts.getAttendanceStatusName(AttendanceConsts.ATTEND)
    .replace(' ', '_').toLowerCase()
}`)
          }} |
          <Tippy placement="bottom">
            {{ AttendanceConsts.getAttendanceStatusIcon(AttendanceConsts.PENDING_ABSENCE) }} ➡
            {{ t('attendance_status.absence') }} |
            <template #content>
              <p>
                {{ AttendanceConsts.getAttendanceStatusIcon(AttendanceConsts.PENDING_ABSENCE) }} ➡
                {{
                t(`attendance_status.${
  AttendanceConsts.getAttendanceStatusName(AttendanceConsts.PENDING_ABSENCE)
    .replace(' ', '_').toLowerCase()
}`)
                }}
              </p>
              <p>
                <span class="green">{{
                AttendanceConsts.getAttendanceStatusIcon(AttendanceConsts.JUSTIFIED_ABSENCE)
                }}</span> ➡
                {{
                t(`attendance_status.${
  AttendanceConsts.getAttendanceStatusName(AttendanceConsts.JUSTIFIED_ABSENCE)
    .replace(' ', '_').toLowerCase()
}`)
                }}
              </p>
              <p>
                <span class="red">{{
                AttendanceConsts.getAttendanceStatusIcon(AttendanceConsts.UNJUTIFIED_ABSENCE)
                }}</span>
                ➡
                {{
                t(`attendance_status.${
  AttendanceConsts.getAttendanceStatusName(AttendanceConsts.UNJUTIFIED_ABSENCE)
    .replace(' ', '_').toLowerCase()
}`)
                }}
              </p>
            </template>
          </Tippy>
          <Tippy placement="bottom">
            {{ AttendanceConsts.getAttendanceStatusIcon(AttendanceConsts.PENDING_PARTIAL_ABSENCE) }} ➡
            {{ t('attendance_status.partial_absence') }} |
            <template #content>
              <p>
                {{ AttendanceConsts.getAttendanceStatusIcon(AttendanceConsts.PENDING_PARTIAL_ABSENCE) }}
                ➡
                {{
                t(`attendance_status.${
  AttendanceConsts.getAttendanceStatusName(AttendanceConsts.PENDING_PARTIAL_ABSENCE)
    .replaceAll(' ', '_').toLowerCase()
}`)
                }}
              </p>
              <p>
                <span class="green">{{
                AttendanceConsts.getAttendanceStatusIcon(AttendanceConsts.JUSTIFIED_PARTIAL_ABSENCE)
                }}</span> ➡
                {{
                t(`attendance_status.${
  AttendanceConsts.getAttendanceStatusName(AttendanceConsts.JUSTIFIED_PARTIAL_ABSENCE)
    .replaceAll(' ', '_').toLowerCase()
}`)
                }}
              </p>
              <p>
                <span class="red">{{
                AttendanceConsts.getAttendanceStatusIcon(AttendanceConsts.UNJUSTIFIED_PARTIAL_ABSENCE)
                }}</span>
                ➡
                {{
                t(`attendance_status.${
  AttendanceConsts.getAttendanceStatusName(AttendanceConsts.UNJUSTIFIED_PARTIAL_ABSENCE)
    .replaceAll(' ', '_').toLowerCase()
}`)
                }}
              </p>
            </template>
          </Tippy>
          <span class="blue"> {{ AttendanceConsts.getAttendanceStatusIcon(AttendanceConsts.VACATION) }}</span>
          ➡
          {{
          t(`attendance_status.${
  AttendanceConsts.getAttendanceStatusName(AttendanceConsts.VACATION).replace(' ', '_').toLowerCase()
}`)
          }} |
          <span class="yellow">{{
          AttendanceConsts.getAttendanceStatusIcon(AttendanceConsts.MISSING_CHECK)
          }}</span> ➡
          {{
          t(`attendance_status.${
  AttendanceConsts.getAttendanceStatusName(AttendanceConsts.MISSING_CHECK)
    .replace(' ', '_').toLowerCase()
}`)
          }}


        </h6>

      </div>
    </div>
    <EmployeeAttendanceSearchFilterModal :key="keyIncrement" :search_filter_popup="searchFilterPop"
      @resetFilter="resetFilter_popup" @search="search_filter" @search_filter_popup="popUpTrigger" />
  </form>
</template>

<style lang="scss" >
@import '/@src/scss/styles/tableHeader.scss';
@import '@vuepic/vue-datepicker/dist/main.css';
@import '/@src/scss/styles/customDatePicker.scss';

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
