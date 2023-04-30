<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "permissions": [
            "service_provider_monthly_report"
        ]
    }
}
</route>        
            
<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { useI18n } from 'vue-i18n'
import { useReport } from '/@src/stores/Others/Report/reportStore'
import { resetServiceProviderMonthlyReportData, getBestServiceProviderReport, getServiceProviderMonthlyReport } from '/@src/services/Others/Report/reportService'
import { Employee, EmployeeSearchFilter } from '/@src/models/Employee/employee'
import { getEmployeesList } from '/@src/services/Employee/employeeService'
import { useDarkmode } from '/@src/stores/darkmode'
import Datepicker from '@vuepic/vue-datepicker';
import { useNotyf } from '/@src/composable/useNotyf'
import { Notyf } from 'notyf'
import { Department, DepartmentSearchFilter } from '/@src/models/Others/Department/department'
import { BaseConsts } from '/@src/utils/consts/base'
import { getDepartmentsList } from '/@src/services/Others/Department/departmentService'
import { Room, RoomSearchFilter } from '/@src/models/Others/Room/room'
import { getRoomsList } from '/@src/services/Others/Room/roomSevice'
import { useEmployee } from '/@src/stores/Employee/employeeStore'
import { useRoom } from '/@src/stores/Others/Room/roomStore'
import { useDepartment } from '/@src/stores/Others/Department/departmentStore'

const { t, locale } = useI18n()
const dark = useDarkmode();
const iconArrow = locale.value == "ar" ? { left: "lnir lnir-chevron-right", right: "lnir lnir-chevron-left" } : { left: "lnir lnir-chevron-left", right: "lnir lnir-chevron-right" }
const notif = useNotyf() as Notyf
const month = ref({
    month: new Date().getMonth(),
    year: new Date().getFullYear()
});

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle(t('reports.service_provider_monthly.title'))
useHead({
    title: t('reports.service_provider_monthly.title'),
})
const reportStore = useReport()
const reportFilter = ref(resetServiceProviderMonthlyReportData());
const pageTitle = t('reports.service_provider_monthly.title');
const employeesList = ref<Employee[]>([])
const departmentsList = ref<Department[]>([])
const roomsList = ref<Room[]>([])
const employeeStore = useEmployee()
const roomStore = useRoom()
const departmentStore = useDepartment()

const selectedDepartmentId = ref(0)
const selectedRoomId = ref(0)

onMounted(async () => {
    let departmentSearchFilter = {} as DepartmentSearchFilter
    departmentSearchFilter.status = BaseConsts.ACTIVE
    departmentSearchFilter.per_page = 500
    const { departments } = await getDepartmentsList(departmentSearchFilter)
    departmentsList.value = departments

    // let employeeSearchFilter = {} as EmployeeSearchFilter
    // employeeSearchFilter.per_page = 500
    // const { employees } = await getEmployeesList(employeeSearchFilter)
    // employeesList.value = employees

});
const getRoomsByDepartment = async () => {
    let RoomsFilter = {} as RoomSearchFilter
    RoomsFilter.department_id = selectedDepartmentId.value
    RoomsFilter.per_page = 500
    const { rooms } = await getRoomsList(RoomsFilter)
    roomsList.value = rooms
}
const getEmployeesByRoom = async () => {
    let employeesSearchFilter = {} as EmployeeSearchFilter
    employeesSearchFilter.room_id = selectedRoomId.value
    employeesSearchFilter.per_page = 500
    const { employees } = await getEmployeesList(employeesSearchFilter)
    employeesList.value = employees
}

const onSubmit = async () => {
    reportFilter.value.month = month.value.month + 1
    reportFilter.value.year = month.value.year
    if (reportFilter.value.employee_id == 0) {
        notif.error({ message: t('toast.error.report.employee_required'), duration: 3000 })
        return
    }
    if (reportFilter.value.month < 1 ||
        reportFilter.value.month > 12 ||
        reportFilter.value.year < 1 ||
        !Number.isInteger(Number(reportFilter.value.year))
    ) {
        notif.error({ message: t('toast.error.report.month_and_year_required'), duration: 3000 })
        return
    } else {
        const date = new Date(`${reportFilter.value.month}/1/${reportFilter.value.year}`)
        if (isNaN(date.getTime())) {
            notif.error({ message: t('toast.error.report.month_and_year_required'), duration: 3000 })
            return
        }



    }
    const { report, success } = await getServiceProviderMonthlyReport(reportFilter.value);
    if (success && report) {
        const blob = new Blob([report], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = t('reports.service_provider_monthly.title') + ' ' + new Date().toISOString().slice(0, 10) + '.xlsx';
        link.click();
    }
};
</script>
        
<template>
    <div class="page-content-inner">
        <FormHeader :title="pageTitle" :form_submit_name="'Export'" type="submit" @onSubmit="onSubmit"
            :isLoading="reportStore?.loading" />
        <form class="form-layout" @submit.prevent="onSubmit">
            <div class="form-outer">
                <div class="form-body">
                    <div class="form-fieldset">
                        <div class="fieldset-heading">
                            <h4>{{ pageTitle }}</h4>
                        </div>
                        <div class="columns is-multiline">
                            <div class="column is-12">
                                <VField>

                                    <VLabel class="required">{{ t('reports.service_provider_monthly.month') }}</VLabel>
                                    <Datepicker v-model="month" :cancel-text="t('date_picker.cancel')" :locale="locale"
                                        month-picker :select-text="t('date_picker.select')" class="date-picker-dircetion"
                                        :dark="dark.isDark">
                                        <template #arrow-left>
                                            <i :class="iconArrow.left" aria-hidden="true"></i>
                                        </template>
                                        <template #arrow-right>
                                            <i :class="iconArrow.right" aria-hidden="true"></i>
                                        </template>
                                    </Datepicker>
                                </VField>
                            </div>
                            <div class="column is-12">
                                <VField>
                                    <VLabel style="position:relative" class="required">{{
                                        t('reports.service_provider_monthly.department') }}
                                        <div v-if="departmentStore.loading"
                                            class="loader is-loading mt-2 ml-4 w35-h35 custom-loader">
                                        </div>
                                    </VLabel>
                                    <VControl>
                                        <div class="select">
                                            <select @change="getRoomsByDepartment" v-model="selectedDepartmentId">
                                                <VOption :value="0">{{ t('reports.service_provider_monthly.department') }}
                                                </VOption>
                                                <VOption v-for="department in departmentsList" :key="department.id"
                                                    :value="department.id">{{
                                                        department.name }}
                                                </VOption>
                                            </select>
                                        </div>
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-12">
                                <VField>
                                    <VLabel style="position:relative" class="required">{{
                                        t('reports.service_provider_monthly.room') }}
                                        <div v-if="roomStore.loading"
                                            class="loader is-loading mt-2 ml-4 w35-h35 custom-loader">
                                        </div>
                                    </VLabel>
                                    <VControl>
                                        <div class="select">
                                            <select @change="getEmployeesByRoom" v-model="selectedRoomId">
                                                <VOption :value="0">{{ t('reports.service_provider_monthly.room') }}
                                                </VOption>
                                                <VOption v-for="room in roomsList" :key="room.id" :value="room.id">{{
                                                    room.number }}
                                                </VOption>
                                            </select>
                                        </div>
                                    </VControl>
                                </VField>
                            </div>

                            <div class="column is-12">
                                <VField>
                                    <VLabel style="position:relative" class="required">{{
                                        t('reports.service_provider_monthly.employee') }}
                                        <div v-if="employeeStore.loading"
                                            class="loader is-loading mt-2 ml-4 w35-h35 custom-loader">
                                        </div>
                                    </VLabel>
                                    <VControl>
                                        <VSelect v-model="reportFilter.employee_id">
                                            <VOption value="0">{{ t('reports.service_provider_monthly.employee') }}
                                            </VOption>
                                            <VOption v-for="employee in employeesList" :key="employee.id"
                                                :value="employee.id">{{ employee.user.first_name }} {{
                                                    employee.user.last_name }}
                                            </VOption>
                                        </VSelect>
                                    </VControl>
                                </VField>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>


    </div>
</template>
<style lang="scss">
@import '/@src/scss/styles/formPage.scss';
@import '@vuepic/vue-datepicker/dist/main.css';
@import '/@src/scss/styles/customDatePicker.scss';
</style>
      