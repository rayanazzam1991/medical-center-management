<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "permissions": [
            "best_attending_employee_report"
        ]
    }
}
</route>        
<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { useI18n } from 'vue-i18n'
import { useReport } from '/@src/stores/Others/Report/reportStore'
import { resetBestAttendingEmployeeFilter, getBestAttendingEmployeeReport } from '/@src/services/Others/Report/reportService'
import { Department, DepartmentSearchFilter } from '/@src/models/Others/Department/department'
import { Room, RoomSearchFilter } from '/@src/models/Others/Room/room'
import { getRoomsList } from '/@src/services/Others/Room/roomSevice'
import { getDepartmentsList } from '/@src/services/Others/Department/departmentService'
import { useNotyf } from '/@src/composable/useNotyf'
import { Notyf } from 'notyf'

const { t } = useI18n()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle(t('reports.best_attending_employee.title'))
useHead({
    title: t('reports.best_attending_employee.title'),
})
const notif = useNotyf() as Notyf
const reportStore = useReport()
const reportFilter = ref(resetBestAttendingEmployeeFilter());
const pageTitle = t('reports.best_attending_employee.title');
const departmentsList = ref<Department[]>([])
const roomsList = ref<Room[]>([])
const isAllResults = ref(false)
onMounted(async () => {

    let roomSearchFilter = {} as RoomSearchFilter
    roomSearchFilter.per_page = 500
    const { rooms } = await getRoomsList(roomSearchFilter)
    roomsList.value = rooms

    let departmentSearchFilter = {} as DepartmentSearchFilter
    departmentSearchFilter.per_page = 500
    const { departments } = await getDepartmentsList(departmentSearchFilter)
    departmentsList.value = departments
});

const onSubmit = async () => {
    if (reportFilter.value.count && (reportFilter.value.count < 0 || !Number.isInteger(reportFilter.value.count))) {
        notif.error({ message: t('toast.error.report.count_must_be_integer_positive'), duration: 3000 })
        return
    }
    const { report, success } = await getBestAttendingEmployeeReport(reportFilter.value);
    if (success && report) {
        const blob = new Blob([report], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = t('reports.best_attending_employee.title') + ' ' + new Date().toISOString().slice(0, 10) + '.xlsx';
        link.click();
    }
};
watch(isAllResults, (value) => {
    if (value) {
        reportFilter.value.count = undefined
    } else {
        reportFilter.value.count = 0
    }
})

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
                            <div class="column is-6">
                                <VField>
                                    <VLabel>{{ t('reports.best_attending_employee.date_from') }}</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="reportFilter.date_from" placeholder="" type="date" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-6">
                                <VField>
                                    <VLabel>{{ t('reports.best_attending_employee.date_to') }}</VLabel>
                                    <VControl icon="feather:chevrons-right">
                                        <VInput v-model="reportFilter.date_to" placeholder="" type="date" />
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-12">
                                <VField>
                                    <VLabel>{{ t('reports.best_attending_employee.department') }}</VLabel>
                                    <VControl>
                                        <VSelect v-model="reportFilter.department_id">
                                            <VOption value="">{{ t('reports.best_attending_employee.department') }}
                                            </VOption>
                                            <VOption v-for="department in departmentsList" :key="department.id"
                                                :value="department.id">{{ department.name }}
                                            </VOption>
                                        </VSelect>
                                    </VControl>
                                </VField>
                            </div>
                            <div class="column is-12">
                                <VField>
                                    <VLabel>{{ t('reports.best_attending_employee.room') }}</VLabel>
                                    <VControl>
                                        <VSelect v-model="reportFilter.room_id">
                                            <VOption value="">{{ t('reports.best_attending_employee.room') }}</VOption>
                                            <VOption v-for="room in roomsList" :key="room.id" :value="room.id">
                                                #{{ room.number }} - {{ room.department?.name }}
                                            </VOption>
                                        </VSelect>
                                    </VControl>
                                </VField>
                            </div>
                            <div class="p-0 m-0 is-flex is-align-items-end column is-12 columns">
                                <div class="column is-9">
                                    <VField>
                                        <VLabel>{{ t('reports.best_attending_employee.count') }}</VLabel>
                                        <VControl icon="feather:chevrons-right">
                                            <VInput :disabled="isAllResults" v-model="reportFilter.count" placeholder=""
                                                type="number" />
                                        </VControl>
                                    </VField>
                                </div>
                                <div class="column is-3">
                                    <VField>
                                        <VControl>
                                            <VCheckbox class="is-flex-row" v-model="isAllResults"
                                                :label="t('reports.best_attending_employee.all')" paddingless bigger
                                                color="primary" />
                                        </VControl>
                                    </VField>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>


    </div>
</template>
<style scoped lang="scss">
@import '/@src/scss/styles/formPage.scss';
</style>
      