<script setup lang="ts">
import { useHead } from '@vueuse/head';
import TableCellCard from '/@src/components/OurComponents/HR/Attendance/TableCellCard.vue';
import { useNotyf } from '/@src/composable/useNotyf';
import { defaultEmployeeSchedule, defaultEmployeeScheduleSearchFilter, defaultSchedule, defaultUpdateSchedule, EmployeeSchedule, EmployeeScheduleSearchFilter, Schedule, UpdateSchedule } from '../../models/HR/Attendance/EmployeeSchedule/employeeSchedule';
import { getEmployeesSchedule, updateEmployeeSchedule } from '/@src/services/Employee/employeeService';
import { getSettingsFromStorage } from '/@src/services/Others/Setting/settingService';
import { useEmployee } from '/@src/stores/Employee/employeeStore';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { defaultPagination } from '/@src/utils/response';
import sleep from '/@src/utils/sleep';


const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Employees Schedule')
useHead({
    title: 'Employees Schedule',
})
const notif = useNotyf()
const searchFilter = ref(defaultEmployeeScheduleSearchFilter)
const employeesScheduleList = ref<Array<EmployeeSchedule>>([])
const paginationVar = ref(defaultPagination)
const router = useRouter()
const employeeStore = useEmployee()
const default_per_page = ref(1)
const keyIncrement = ref(0)
const tableCellPopup = ref(false)
const selectedCell = ref<Schedule>(defaultSchedule)
const selectedEmployee = ref<EmployeeSchedule>(defaultEmployeeSchedule)
const daysName = ref<string[]>([])
const selectedStartTime = ref({ hour: '00', minute: '00' })
const selectedEndTime = ref({ hour: '00', minute: '00' })
const updateScheduleVar = ref(defaultUpdateSchedule)
const keyIncement = ref(0)
const loading = ref({ update: false, delete: false })
const { employeesSchedule, pagination } = await getEmployeesSchedule(searchFilter.value)
employeesScheduleList.value = employeesSchedule
if (employeesScheduleList.value.length != 0) {

    for (let i = 0; i < employeesScheduleList.value[0].schedules.length; i++) {
        daysName.value.push(employeesScheduleList.value[0].schedules[i].day_of_week);
    }
}


onMounted(async () => {

    paginationVar.value = pagination
    keyIncrement.value = keyIncrement.value + 1
    default_per_page.value = pagination.per_page

});

const search = async (newSearchFilter: EmployeeScheduleSearchFilter) => {

    const { employeesSchedule, pagination } = await getEmployeesSchedule(newSearchFilter)

    employeesScheduleList.value = employeesSchedule
    paginationVar.value = pagination
    searchFilter.value = newSearchFilter
}

const resetFilter = async (newSearchFilter: EmployeeScheduleSearchFilter) => {
    searchFilter.value = newSearchFilter
    search(searchFilter.value)
}

const getEmployeesSchedulePerPage = async (pageNum: number) => {
    searchFilter.value.page = pageNum
    search(searchFilter.value)
}
const employeeSort = async (value: string) => {
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
const formatTime = () => {
    if (selectedCell.value.start_time) {
        const [hour, minute, second] = selectedCell.value.start_time.split(':')
        selectedStartTime.value = { hour: Number(hour) < 10 && Number(hour) > 0 ? hour.substring(1) : hour, minute: Number(minute) < 10 && Number(minute) > 0 ? minute.substring(1) : minute }

    }
    if (selectedCell.value.end_time) {
        const [hour, minute, second] = selectedCell.value.end_time.split(':')
        selectedEndTime.value = { hour: Number(hour) < 10 && Number(hour) > 0 ? hour.substring(1) : hour, minute: Number(minute) < 10 && Number(minute) > 0 ? minute.substring(1) : minute }
    }
    console.log(selectedStartTime.value)
    console.log(selectedEndTime.value)
}

const updateSchedule = async () => {
    let formatedStartTimeMinute;
    let formatedStartTimeHour;
    let formatedEndTimeMinute;
    let formatedEndTimeHour;
    if (Number(selectedStartTime.value.minute) < 10 && Number(selectedStartTime.value.minute) > 0)
        formatedStartTimeMinute = '0' + selectedStartTime.value.minute
    else
        formatedStartTimeMinute = selectedStartTime.value.minute

    if (Number(selectedStartTime.value.hour) < 10 && Number(selectedStartTime.value.hour) > 0)
        formatedStartTimeHour = '0' + selectedStartTime.value.hour
    else
        formatedStartTimeHour = selectedStartTime.value.hour
    if (Number(selectedEndTime.value.minute) < 10 && Number(selectedEndTime.value.minute) > 0)
        formatedEndTimeMinute = '0' + selectedEndTime.value.minute
    else
        formatedEndTimeMinute = selectedEndTime.value.minute

    if (Number(selectedEndTime.value.hour) < 10 && Number(selectedEndTime.value.hour) > 0)
        formatedEndTimeHour = '0' + selectedEndTime.value.hour
    else
        formatedEndTimeHour = selectedEndTime.value.hour

    if (Number(formatedStartTimeHour) > Number(formatedEndTimeHour)) {
        await sleep(200);

        // @ts-ignore
        notif.error(`Start time cant be after end time`)

        return
    }

    else if (Number(formatedStartTimeHour) == Number(formatedEndTimeHour)) {
        if (Number(formatedStartTimeMinute) >= Number(formatedEndTimeMinute)) {
            await sleep(200);

            // @ts-ignore
            notif.error(`Start time cant be after end time`)

            return
        }
    }


    const updateStartTime = formatedStartTimeHour + ':' + formatedStartTimeMinute
    const updateEndTime = formatedEndTimeHour + ':' + formatedEndTimeMinute
    updateScheduleVar.value.end_time = updateEndTime
    updateScheduleVar.value.start_time = updateStartTime
    updateScheduleVar.value.is_vacation = false
    if (selectedEmployee.value.id != undefined) {
        loading.value.update = true
        const { message, success } = await updateEmployeeSchedule(selectedEmployee.value.id, selectedCell.value.id, updateScheduleVar.value)
        if (success) {

            search(searchFilter.value)
            // @ts-ignore
            notif.dismissAll()
            await sleep(200);

            // @ts-ignore
            notif.success(`${selectedEmployee.value.user.first_name} ${selectedEmployee.value.user.last_name} schedule was edited successfully`)
        } else {
            await sleep(200);
            // @ts-ignore
            notif.error(message)
        }
        keyIncement.value++
        loading.value.update = false

        tableCellPopup.value = false
        await search(searchFilter.value)

    }
}
const deleteSchedule = async () => {
    const updateStartTime = "00:00:00"
    const updateEndTime = "00:00:00"

    updateScheduleVar.value.end_time = updateEndTime
    updateScheduleVar.value.start_time = updateStartTime
    updateScheduleVar.value.is_vacation = true
    if (selectedEmployee.value.id != undefined) {
        loading.value.delete = true
        const { message, success } = await updateEmployeeSchedule(selectedEmployee.value.id, selectedCell.value.id, updateScheduleVar.value)
        if (success) {

            search(searchFilter.value)
            // @ts-ignore
            notif.dismissAll()
            await sleep(200);

            // @ts-ignore
            notif.success(`${selectedEmployee.value.user.first_name} ${selectedEmployee.value.user.last_name} schedule was edited successfully`)
        } else {
            await sleep(200);
            // @ts-ignore
            notif.error(message)
        }
        keyIncement.value++
        loading.value.delete = false
        tableCellPopup.value = false
        await search(searchFilter.value)

    }
}

const columns = {

    "users.name": {
        align: 'center',

        label: 'Employee Name',
        grow: true,
        renderRow: (row: any) =>
            h(
                TableCellCard, {
                title: row?.user?.first_name + ' ' + row?.user?.last_name,
                subtitle2: `${row?.position?.name} | ${row?.user?.room?.department?.name}`,
                subtitle: `${row?.user?.phone_number}`,
                titleSize: 'medium',
                clickable: false,
                color: 'primary',
                onClick: () => {
                    router.push({ path: `/employee/${row?.id}` })

                }
            }

            ),
        sortable: true,
        searchable: true,

    },
    first_day: {
        align: 'center',

        label: `${daysName.value[0]}`,
        grow: false,
        renderRow: (row: any) =>
            h(
                TableCellCard, {
                clickable: true,
                title: row?.schedules[0]?.is_vacation == 0 ? row?.schedules[0]?.start_time + ' - ' + row?.schedules[0]?.end_time : "+",
                titleSize: row?.schedules[0]?.is_vacation == 1 ? "large" : "small",

                color: row?.schedules[0]?.is_vacation == 0 ? 'white' : 'disabled',
                onClick: () => {
                    keyIncement.value++
                    selectedCell.value = row?.schedules[0]
                    selectedEmployee.value = row
                    formatTime()
                    tableCellPopup.value = true
                }
            }

            ),

    },
    second_day: {
        align: 'center',

        label: `${daysName.value[1]}`,
        grow: false,
        renderRow: (row: any) =>
            h(
                TableCellCard, {
                clickable: true,
                title: row?.schedules[1]?.is_vacation == 0 ? row?.schedules[1]?.start_time + ' - ' + row?.schedules[1]?.end_time : "+",
                titleSize: row?.schedules[1]?.is_vacation == 1 ? "large" : "small",
                color: row?.schedules[1]?.is_vacation == 0 ? 'white' : 'disabled',
                onClick: () => {
                    keyIncement.value++
                    selectedCell.value = row?.schedules[1]
                    selectedEmployee.value = row
                    formatTime()
                    tableCellPopup.value = true
                }
            }

            ),

    },
    third_day: {
        align: 'center',

        label: `${daysName.value[2]}`,
        grow: false,
        renderRow: (row: any) =>
            h(
                TableCellCard, {
                clickable: true,
                title: row?.schedules[2]?.is_vacation == 0 ? row?.schedules[2]?.start_time + ' - ' + row?.schedules[2]?.end_time : "+",
                titleSize: row?.schedules[2]?.is_vacation == 1 ? "large" : "small",

                color: row?.schedules[2]?.is_vacation == 0 ? 'white' : 'disabled',
                onClick: () => {

                    keyIncement.value++
                    selectedCell.value = row?.schedules[2]
                    selectedEmployee.value = row
                    formatTime()
                    tableCellPopup.value = true
                }
            }

            ),

    },
    fourth_day: {
        align: 'center',

        label: `${daysName.value[3]}`,
        grow: false,
        renderRow: (row: any) =>
            h(
                TableCellCard, {
                clickable: true,
                title: row?.schedules[3]?.is_vacation == 0 ? row?.schedules[3]?.start_time + ' - ' + row?.schedules[3]?.end_time : "+",
                titleSize: row?.schedules[3]?.is_vacation == 1 ? "large" : "small",

                color: row?.schedules[3]?.is_vacation == 0 ? 'white' : 'disabled',
                onClick: () => {
                    keyIncement.value++
                    selectedCell.value = row?.schedules[3]
                    selectedEmployee.value = row
                    formatTime()
                    tableCellPopup.value = true
                }
            }

            ),
    },
    fifth_day: {
        align: 'center',

        label: `${daysName.value[4]}`,
        grow: false,
        renderRow: (row: any) =>
            h(
                TableCellCard, {
                clickable: true,
                title: row?.schedules[4]?.is_vacation == 0 ? row?.schedules[4]?.start_time + ' - ' + row?.schedules[4]?.end_time : "+",
                titleSize: row?.schedules[4]?.is_vacation == 1 ? "large" : "small",

                color: row?.schedules[4]?.is_vacation == 0 ? 'white' : 'disabled',
                onClick: () => {
                    keyIncement.value++
                    selectedCell.value = row?.schedules[4]
                    selectedEmployee.value = row
                    formatTime()
                    tableCellPopup.value = true
                }
            }

            ),
    },
    sixth_day: {
        align: 'center',

        label: `${daysName.value[5]}`,
        grow: false,
        renderRow: (row: any) =>
            h(
                TableCellCard, {
                clickable: true,
                title: row?.schedules[5]?.is_vacation == 0 ? row?.schedules[5]?.start_time + ' - ' + row?.schedules[5]?.end_time : "+",
                titleSize: row?.schedules[5]?.is_vacation == 1 ? "large" : "small",

                color: row?.schedules[5]?.is_vacation == 0 ? 'white' : 'disabled',
                onClick: () => {
                    keyIncement.value++
                    selectedCell.value = row?.schedules[5]
                    selectedEmployee.value = row
                    formatTime()
                    tableCellPopup.value = true
                }
            }

            ),
    },
    seventh_day: {
        align: 'center',

        label: `${daysName.value[6]}`,
        grow: false,
        renderRow: (row: any) =>
            h(
                TableCellCard, {
                clickable: true,
                title: row?.schedules[6]?.is_vacation == 0 ? row?.schedules[6]?.start_time + ' - ' + row?.schedules[6]?.end_time : "+",
                titleSize: row?.schedules[6]?.is_vacation == 1 ? "large" : "small",

                color: row?.schedules[6]?.is_vacation == 0 ? 'white' : 'disabled',
                onClick: () => {
                    keyIncement.value++
                    selectedCell.value = row?.schedules[6]
                    selectedEmployee.value = row
                    formatTime()
                    tableCellPopup.value = true

                }
            }

            ),
    },
} as const
</script>

<template>
    <EmployeeScheduleTableHeader :key="keyIncrement" :title="viewWrapper.pageTitle" @search="search"
        :pagination="paginationVar" :default_per_page="default_per_page" @resetFilter="resetFilter" />
    <VFlexTableWrapper :columns="columns" :data="employeesScheduleList" :limit="searchFilter.per_page"
        @update:sort="employeeSort">

        <VFlexTable clickable>
            <template #body>
                <div v-if="employeeStore?.loading" class="flex-list-inner">
                    <div v-for="key in paginationVar.per_page" :key="key" class="flex-table-item">
                        <VFlexTableCell>
                            <VPlaceload />
                        </VFlexTableCell>

                    </div>
                </div>
                <div v-else-if="employeesScheduleList.length === 0" class="flex-list-inner">
                    <VPlaceholderSection title="No matches" subtitle="There is no data that match your search."
                        class="my-6">
                    </VPlaceholderSection>
                </div>

            </template>
        </VFlexTable>
        <VFlexPagination v-if="(employeesScheduleList.length != 0 && paginationVar.max_page != 1)"
            :current-page="paginationVar.page" class="mt-6" :item-per-page="paginationVar.per_page"
            :total-items="paginationVar.total" :max-links-displayed="3" no-router
            @update:current-page="getEmployeesSchedulePerPage" />
        <h6 v-if="employeesScheduleList.length != 0 && !employeeStore?.loading">Showing {{ paginationVar.page !=
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
    <VModal :key="keyIncement" title="Edit Employee Schedule" :open="tableCellPopup" actions="center"
        @close="tableCellPopup = false">
        <template #content>
            <h2 class="is-size-5 has-text-primary mb-3">Day: {{ selectedCell.day_of_week }}</h2>
            <h2 class="is-size-5">{{ selectedEmployee.user.first_name }}
                {{ selectedEmployee.user.last_name }}</h2>
            <h4 class="mb-3"><span class=""> {{ selectedEmployee.position.name
}}</span> |
                <span class=""> {{ selectedEmployee.user.room.department?.name
}}</span>
            </h4>
            <form class=" form-layout" @submit.prevent="">
                <!--Fieldset-->
                <div class="form-fieldset">
                    <div class="columns is-multiline">
                        <div class="column is-12">
                            <h2 class="mb-3">Starting Time</h2>
                            <div class="columns">

                                <VField class="column is-6 ">
                                    <VControl>
                                        <VSelect v-model="selectedStartTime.hour">
                                            <VOption :key="'00'" :value="'00'">00 </VOption>

                                            <VOption v-for="index in 23" :key="index" :value="index">{{ index < 10 ? '0'
        + index : index
}} </VOption>
                                        </VSelect>
                                    </VControl>
                                </VField>
                                <VField class="column is-6">
                                    <VControl>
                                        <VSelect v-model="selectedStartTime.minute">
                                            <VOption :key="'00'" :value="'00'">00 </VOption>

                                            <VOption v-for="index in 59" :key="index" :value="index.toString()">{{ index
        < 10 ? '0' + index : index
}} </VOption>
                                        </VSelect>
                                    </VControl>
                                </VField>
                            </div>

                        </div>
                        <div class="column is-12">
                            <h2 class="mb-3">End Time</h2>
                            <div class="columns ">
                                <VField class="column is-6">
                                    <VControl>
                                        <VSelect v-model="selectedEndTime.hour">
                                            <VOption :key="'00'" :value="'00'">00 </VOption>

                                            <VOption v-for="index in 23" :key="index" :value="index">{{ index < 10 ? '0'
        + index : index
}} </VOption>
                                        </VSelect>
                                    </VControl>
                                </VField>
                                <VField class="column is-6 ">
                                    <VControl>
                                        <VSelect v-model="selectedEndTime.minute">
                                            <VOption :key="'00'" :value="'00'">00 </VOption>

                                            <VOption v-for="index in 59" :key="index" :value="index.toString()">{{ index
        < 10 ? '0' + index : index
}} </VOption>
                                        </VSelect>
                                    </VControl>
                                </VField>
                            </div>

                        </div>
                    </div>
                </div>
            </form>
        </template>
        <template #action="{ close }">
            <VLoader size="small" :active="loading.delete">
                <VButton v-if="!selectedCell.is_vacation" class="mr-2" color="danger" outlined @click="deleteSchedule">
                    Make Vacation</VButton>
            </VLoader>
            <VLoader size="small" :active="loading.update">
                <VButton color="primary" raised @click="updateSchedule">Update</VButton>
            </VLoader>
        </template>
    </VModal>

</template>
<style lang="scss">
.is-clickable {
    cursor: default !important;
}
</style>