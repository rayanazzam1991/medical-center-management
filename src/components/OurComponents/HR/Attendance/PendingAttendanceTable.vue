<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "permissions": [
            "attendance_list"
        ]
    }
}
</route>
            
<script setup lang="ts">
import { Notyf } from 'notyf';
import { useI18n } from 'vue-i18n';
import VTag from '/@src/components/base/tags/VTag.vue';
import { useNotyf } from '/@src/composable/useNotyf';
import { Attendance, AttendanceConsts, EmployeeAttendance, EmployeeAttendanceSearchFilter, JustificationRequestData, PendingAttendance, UpdateAttendance, defaultAttendance, defaultEmployeeAttendance, defaultEmployeeAttendanceSearchFilter, defaultPendingAttendance } from '/@src/models/HR/Attendance/EmployeeAttendance/employeeAttendance';
import { addJustificationProofFile, getPendingAttendancesList, justifyAttendance, unjustifyAttendance, updateAttendance } from '/@src/services/HR/Attendance/EmployeeAttendance/attendanceService';
import { useAttendance } from '/@src/stores/HR/Attendance/EmployeeAttendance/attendanceStore';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { defaultPagination } from '/@src/utils/response';
import PendingAttendanceDropdown from './PendingAttendanceDropdown.vue';
import { Permissions } from '/@src/utils/consts/rolesPermissions';
import sleep from '/@src/utils/sleep';
import { useDarkmode } from '/@src/stores/darkmode';
import { Employee, defaultEmployee } from '/@src/models/Employee/employee';
import Datepicker from '@vuepic/vue-datepicker';



const viewWrapper = useViewWrapper()
const { t, locale } = useI18n()
const dark = useDarkmode()
const notif = useNotyf() as Notyf
const attendanceStore = useAttendance()
const searchFilter = ref(defaultEmployeeAttendanceSearchFilter)
const selectedCell = ref<PendingAttendance>(defaultPendingAttendance)
const keyIncement = ref(0)
const justifyAttendancePopup = ref(false)
const unjustifyAttendancePopup = ref(false)
const markAttendancePopup = ref(false)

const pendingAttendancesList = ref<Array<PendingAttendance>>([])
const paginationVar = ref(defaultPagination)
const keyIncrement = ref(0)
const router = useRouter()
const default_per_page = ref(1)
const loading = ref({ update: false, delete: false, fetch: false })
const selectedReason = ref('')
const justificationProofFile = ref<File>()
const selectedCheckInTime = ref({ hours: '00', minutes: '00' })
const selectedCheckOutTime = ref({ hours: '00', minutes: '00' })
const selectedEmployee = ref<Employee>(defaultEmployee)

onMounted(async () => {
    const { pending_attendnaces, pagination } = await getPendingAttendancesList(searchFilter.value)
    pendingAttendancesList.value = pending_attendnaces
    paginationVar.value = pagination
    keyIncrement.value = keyIncrement.value + 1
    default_per_page.value = pagination.per_page

});

const search = async (newSearchFilter: EmployeeAttendanceSearchFilter) => {
    paginationVar.value.per_page = newSearchFilter.per_page ?? paginationVar.value.per_page


    const { pending_attendnaces, pagination } = await getPendingAttendancesList(newSearchFilter)
    pendingAttendancesList.value = pending_attendnaces
    paginationVar.value = pagination
    searchFilter.value = newSearchFilter
}

const resetFilter = async (newSearchFilter: EmployeeAttendanceSearchFilter) => {
    searchFilter.value = newSearchFilter
    await search(searchFilter.value)
}

const getPendingAttendancesPerPage = async (pageNum: number) => {

    searchFilter.value.page = pageNum
    await search(searchFilter.value)
}
const attendancesList = async (value: string) => {
    if (value != undefined) {
        const [sortField, sortOrder] = value.split(':') as [string, 'desc' | 'asc']
        searchFilter.value.order_by = sortField
        searchFilter.value.order = sortOrder
    }
    else {
        searchFilter.value.order = undefined
        searchFilter.value.order_by = undefined
    }
    await search(searchFilter.value)
}
const unjustifyEmployeeAttendance = async () => {
    loading.value.delete = true

    const { message, success, attendance } = await unjustifyAttendance(selectedCell.value.id)
    if (success) {
        await search(searchFilter.value)
        notif.dismissAll()
        await sleep(200);
        notif.success(t('toast.success.unjustified'))
    } else {
        await sleep(200);
        notif.error(message)
    }

    keyIncement.value++
    loading.value.delete = false
    unjustifyAttendancePopup.value = false
}
const justifyEmployeeAttendance = async () => {
    if (selectedReason.value == '') {
        notif.error(t('toast.error.Attendance.required_reason'))
        return
    } else if (selectedReason.value.length > 255) {
        notif.error(t('toast.error.Attendance.out_of_length_reason'))
        return

    }
    loading.value.update = true
    const justificationRequestData: JustificationRequestData = {
        reason: selectedReason.value
    }
    const { message, success, justificationResponseData } = await justifyAttendance(selectedCell.value.id, justificationRequestData)
    if (success) {
        if (justificationProofFile.value != undefined) {

            let formData = new FormData()
            if (justificationProofFile.value != undefined) formData.append('images[]', justificationProofFile.value)

            const { success, message } = await addJustificationProofFile(justificationResponseData.id, formData)

            if (success) {
                justificationProofFile.value = undefined
                loading.value.update = false
                await search(searchFilter.value)
                notif.dismissAll()
                await sleep(200);
                notif.success(t('toast.success.justified'))

            } else {
                await sleep(200)
                justificationProofFile.value = undefined
                loading.value.update = false
                notif.error(message)
            }
        } else {
            loading.value.update = false
            await search(searchFilter.value)
            notif.dismissAll()
            await sleep(200);
            notif.success(t('toast.success.justified'))

        }

    } else {
        await sleep(200);
        notif.error(message)
    }

    keyIncement.value++
    selectedReason.value = ''
    loading.value.update = false
    justifyAttendancePopup.value = false
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
        await search(searchFilter.value)
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

const onAddFile = async (event: any) => {
    const _file = event.target.files[0] as File
    let _message = ''
    if (_file) {
        if (
            _file.type != 'image/jpeg' &&
            _file.type != 'image/png' &&
            _file.type != 'image/webp' &&
            _file.type != 'application/pdf'
        ) {
            _message = t('toast.file.type')
            await sleep(200)
            notif.error(_message)
        } else if (_file.size > 2 * 1024 * 1024) {
            _message = t("toast.file.size")
            await sleep(200)
            notif.error(_message)
        } else {
            justificationProofFile.value = _file
        }
    }
}
const columns = {
    "employee_name": {
        align: 'center',
        label: t("pending_attendances.table.columns.employee_name"),
        renderRow: (row: PendingAttendance) =>
            h('span', row?.employee.user.first_name + ' ' + row?.employee.user.last_name),
    },
    "phone_number": {
        align: 'center',
        label: t("pending_attendances.table.columns.phone_number"),
        renderRow: (row: PendingAttendance) =>
            h('span', row?.employee.user.phone_number),
    },
    status: {
        align: 'center',
        label: t("pending_attendances.table.columns.status"),
        renderRow: (row: PendingAttendance) => {

            return h(
                VTag,
                {
                    rounded: true,
                    label: t(`attendance_status.${AttendanceConsts.getAttendanceStatusName(row.status)
                        .replaceAll(' ', '_').toLowerCase()}`)

                },
            );
        }
    },
    "date": {
        align: 'center',
        label: t("pending_attendances.table.columns.date"),
        renderRow: (row: PendingAttendance) =>
            h('span', row?.date),
    },
    "day": {
        align: 'center',
        label: t("pending_attendances.table.columns.day"),
        renderRow: (row: PendingAttendance) =>
            h('span', t(`dates.days.${row.day.toLowerCase()}`)),
    },
    "check_in": {
        align: 'center',
        label: t("pending_attendances.table.columns.check_out"),
        renderRow: (row: PendingAttendance) =>
            h('span', row.check_in ?? '-'),
    },
    "check_out": {
        align: 'center',
        label: t("pending_attendances.table.columns.check_out"),
        renderRow: (row: PendingAttendance) =>
            h('span', row.check_out ?? '-'),
    },
    actions: {
        align: 'center',
        label: t('requested_services.table.columns.actions'),
        renderRow: (row: PendingAttendance) =>
            h(PendingAttendanceDropdown, {
                justifyPermission: Permissions.ATTENDANCE_EDIT,
                unjustifyPermission: Permissions.ATTENDANCE_EDIT,
                viewJustify: row.status == AttendanceConsts.PENDING_PARTIAL_ABSENCE || row.status == AttendanceConsts.PENDING_ABSENCE,
                viewUnjustify: row.status == AttendanceConsts.PENDING_PARTIAL_ABSENCE || row.status == AttendanceConsts.PENDING_ABSENCE,
                viewMark: row.status == AttendanceConsts.MISSING_CHECK,
                onJustifyAttendance: () => {
                    keyIncement.value++
                    selectedCell.value = row
                    justifyAttendancePopup.value = true
                    formatTime()

                },
                onUnjustifyAttendance: () => {
                    keyIncement.value++
                    selectedCell.value = row
                    unjustifyAttendancePopup.value = true
                    formatTime()
                },
                onMarkAttendance: () => {
                    keyIncement.value++
                    selectedCell.value = row
                    markAttendancePopup.value = true
                    selectedEmployee.value = row.employee
                    formatTime()

                }
            }),

    },

} as const

</script>
        
<template>
    <PendingAttendacesTableHeader :key="keyIncrement" :title="viewWrapper.pageTitle" @search="search"
        :pagination="paginationVar" :default_per_page="default_per_page" @resetFilter="resetFilter" />


    <VFlexTableWrapper :columns="columns" :data="pendingAttendancesList" @update:sort="attendancesList">

        <VFlexTable separators clickable>
            <template #body>
                <div v-if="attendanceStore?.loading" class="flex-list-inner">
                    <div v-for="key in paginationVar.per_page" :key="key" class="flex-table-item">
                        <VFlexTableCell>
                            <VPlaceload />
                        </VFlexTableCell>
                    </div>
                </div>
                <div v-else-if="pendingAttendancesList.length === 0" class="flex-list-inner">
                    <VPlaceholderSection :title="t('tables.placeholder.title')" :subtitle="t('tables.placeholder.subtitle')"
                        class="my-6">
                    </VPlaceholderSection>
                </div>
            </template>
        </VFlexTable>
        <VFlexPagination v-if="(pendingAttendancesList.length != 0 && paginationVar.max_page != 1)"
            :current-page="paginationVar.page" class="mt-6" :item-per-page="paginationVar.per_page"
            :total-items="paginationVar.total" :max-links-displayed="3" no-router
            @update:current-page="getPendingAttendancesPerPage" />
        <h6 class="pt-2 is-size-7" v-if="pendingAttendancesList.length != 0 && !attendanceStore?.loading">
            {{
                t('tables.pagination_footer', {
                    from_number: paginationVar.page !=
                        paginationVar.max_page
                        ?
                        (1 + ((paginationVar.page - 1) * paginationVar.count)) : paginationVar.page == paginationVar.max_page ? (1 +
                            ((paginationVar.page - 1) * paginationVar.per_page)) : paginationVar.page == 1 ? 1 : paginationVar.total
                    , to_number: paginationVar.page !=
                        paginationVar.max_page ?
                        paginationVar.page *
                        paginationVar.per_page : paginationVar.total, all_number: paginationVar.total
                }) }}</h6>
        <VPlaceloadText v-if="attendanceStore?.loading" :lines="1" last-line-width="20%" class="mx-2" />
    </VFlexTableWrapper>
    <VModal :title="t('employee_attendance.table.unjustify_attendance.title')" :open="unjustifyAttendancePopup"
        actions="center" @close="unjustifyAttendancePopup = false">
        <template #content>
            <VPlaceholderSection :title="t('employee_attendance.table.unjustify_attendance.confirmation')"
                :subtitle="t('employee_attendance.table.unjustify_attendance.caution')" />
        </template>
        <template #action="{ close }">
            <VLoader size="small" :active="loading.delete">
                <VButton color="primary" raised @click="unjustifyEmployeeAttendance">{{ t('modal.buttons.confirm') }}
                </VButton>
            </VLoader>
        </template>
    </VModal>
    <VModal :key="keyIncement" :title="t('employee_attendance.table.justify_attendance.title')"
        :open="justifyAttendancePopup" actions="center"
        @close="() => { justifyAttendancePopup = false; justificationProofFile = undefined; selectedReason = '' }">
        <template #content>
            <div class="form-fieldset">
                <div class="columns is-multiline">
                    <div class="column is-12">
                        <VField class="column " id="reason">
                            <VLabel class="required">{{ t('employee_attendance.table.justify_attendance.reason') }}
                            </VLabel>
                            <VControl>
                                <VInput v-model="selectedReason" type="text" />
                                <ErrorMessage name="reason" />
                            </VControl>
                        </VField>
                    </div>
                    <div class="column is-12">
                        <VField class="column mb-0 pb-0">
                            <VLabel>{{ t('employee_attendance.table.justify_attendance.proof') }}</VLabel>
                            <VControl>
                                <div class="file has-name">
                                    <label class="file-label">
                                        <input class="file-input" type="file" v-on:change="onAddFile" />
                                        <span class="file-cta">
                                            <span class="file-icon">
                                                <i class="fas fa-cloud-upload-alt"></i>
                                            </span>
                                            <span class="file-label"> {{ t('images.image_name_placeholder') }} </span>
                                        </span>
                                        <span class="file-name light-text">
                                            {{ justificationProofFile?.name ?? t('images.image_select_file') }}
                                        </span>
                                    </label>
                                </div>
                            </VControl>
                        </VField>
                        <h6 class="column help">
                            {{ t('images.accepted_file') }}
                        </h6>
                    </div>
                </div>
            </div>
        </template>
        <template #action="{ close }">
            <VLoader size="small" :active="loading.update">

                <VButton color="primary" raised @click="justifyEmployeeAttendance">{{ t('modal.buttons.confirm') }}
                </VButton>
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
                                t(`dates.days.${selectedCell.day.toLowerCase()}`)
                            }} {{
    selectedCell.date
}}</span></h2>
                    <h2 class="is-size-7 mb-3">{{ t('employee_attendance.table.mark_attendance_modal.status') }} <span
                            class="has-text-primary is-size-6">{{
                                t(`attendance_status.${AttendanceConsts
                                    .getAttendanceStatusName(selectedCell.status).replaceAll(" ", "_").toLowerCase()
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
                                                :cancel-text="t('date_picker.cancel')"
                                                :select-text="t('date_picker.select')" :dark="dark.isDark"
                                                class="date-picker-dircetion" />
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
                                                :cancel-text="t('date_picker.cancel')"
                                                :select-text="t('date_picker.select')" :dark="dark.isDark"
                                                class="date-picker-dircetion" />
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
        
<style lang="scss">
@import '@vuepic/vue-datepicker/dist/main.css';
@import '/@src/scss/styles/customDatePicker.scss';

.tooltip {
    position: relative;
    display: inline-block;
}

.tooltip .tooltiptext {
    visibility: hidden;
    width: 150px;
    background-color: white;
    text-align: center;
    border-radius: 6px;
    padding: 5px;
    word-break: keep-all;
    white-space: normal;


    /* Position the tooltip */
    position: absolute;
    z-index: 1;
}

.tooltip:hover .tooltiptext {
    visibility: visible;


}

.is-dark {
    .tooltip .tooltiptext {
        background-color: rgb(43, 41, 41);
    }
}
</style>
        