<script setup lang="ts">import { useHead } from '@vueuse/head';
import { Notyf } from 'notyf';
import { useI18n } from 'vue-i18n';
import IconButton from '/@src/components/OurComponents/Warehouse/ItemHistory/IconButton.vue';
import { useNotyf } from '/@src/composable/useNotyf';
import { defaultAttendanceJustificationSearchFilter, AttendanceJustification, AttendanceJustificationSearchFilter } from '/@src/models/HR/Attendance/AttendanceJustification/attendanceJustification';
import { getAttendanceJustificationsList } from '/@src/services/HR/Attendance/AttendanceJustification/attendanceJustificationService';
import { useAttendanceJustification } from '/@src/stores/HR/Attendance/AttendanceJustification/attendanceJustificationStore';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { defaultPagination } from '/@src/utils/response';


const viewWrapper = useViewWrapper()
const { t } = useI18n()
viewWrapper.setPageTitle(t('attendance_justification.table.title'))
useHead({
    title: t('attendance_justification.table.title'),
})
const notif = useNotyf() as Notyf
const attendanceJustificationStore = useAttendanceJustification()
const searchFilter = ref(defaultAttendanceJustificationSearchFilter)
const attendanceJustificationsList = ref<Array<AttendanceJustification>>([])
const paginationVar = ref(defaultPagination)
const keyIncrement = ref(0)
const router = useRouter()
const default_per_page = ref(1)
onMounted(async () => {
    const { attendanceJustifications, pagination } = await getAttendanceJustificationsList(searchFilter.value)
    attendanceJustificationsList.value = attendanceJustifications
    paginationVar.value = pagination
    keyIncrement.value = keyIncrement.value + 1
    default_per_page.value = pagination.per_page

});


const search = async (newSearchFilter: AttendanceJustificationSearchFilter) => {
    paginationVar.value.per_page = newSearchFilter.per_page ?? paginationVar.value.per_page
    const { attendanceJustifications, pagination } = await getAttendanceJustificationsList(newSearchFilter)

    attendanceJustificationsList.value = attendanceJustifications
    paginationVar.value = pagination
    searchFilter.value = newSearchFilter

}

const resetFilter = async (newSearchFilter: AttendanceJustificationSearchFilter) => {
    searchFilter.value = newSearchFilter
    await search(searchFilter.value)
}

const getAttendanceJustificationsPerPage = async (pageNum: number) => {
    searchFilter.value.page = pageNum
    search(searchFilter.value)
}
const attendanceJustificationSort = async (value: string) => {
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
const stringTrim = (value: string) => {
    if (value == undefined) {
        return ''
    }
    else {
        let trimmedString = value?.substring(0, 10);
        return trimmedString + '...'
    }
}

const columns = {
    "attendances.employees.users.name": {
        align: 'center',
        sortable: true,
        label: t("attendance_justification.table.columns.employee_name"),
        renderRow: (row: any) =>
            h('span', row?.attendance?.employee?.user?.first_name + ' ' + row?.attendance?.employee?.user?.last_name),


    },
    "attendances.date": {
        align: 'center',
        sortable: true,
        label: t("attendance_justification.table.columns.date"),
        renderRow: (row: any) =>
            h('span', row?.attendance?.date),


    },
    absence_hours: {
        align: 'center',
        label: t("attendance_justification.table.columns.absence_hours"),
        renderRow: (row: any) =>
            h('span', row?.absence_hours),
    },
    reason: {
        align: 'center',
        label: t("attendance_justification.table.columns.reason"),
        renderRow: (row: any) =>
            h('span', {
                innerHTML:
                    `<div class="tooltip">${stringTrim(row?.reason)}<div class="tooltiptext"><p class="text-white">${row?.reason}</p></div></div>`,
            }),
    },
    proof: {
        align: 'center',
        label: t('attendance_justification.table.columns.proof'),
        renderRow: (row: any) => {
            if (row?.proof != undefined) {
                return h(IconButton, {
                    icon: 'fas fa-eye',
                    image_path: import.meta.env.VITE_MEDIA_BASE_URL + row?.proof?.relative_path,
                });
            } else {
                return h('span', '-');

            }
        },
    },
    created_at: {
        align: 'center',
        sortable: true,
        label: t("attendance_justification.table.columns.created_at"),
        renderRow: (row: any) =>
            h('span', row?.created_at),
    },
    created_by: {
        align: 'center',
        label: t("attendance_justification.table.columns.created_by"),
        sortable: true,
        renderRow: (row: any) =>
            h('span', row?.created_by?.first_name + ' ' + row?.created_by?.last_name),
    },
} as const
</script>

<template>
    <AttendanceJustificationTableHeader :key="keyIncrement" :title="viewWrapper.pageTitle"
        :button_name="t('attendance_justification.header_button')" @search="search" :pagination="paginationVar"
        :default_per_page="default_per_page" @resetFilter="resetFilter" />


    <VFlexTableWrapper :columns="columns" :data="attendanceJustificationsList"
        @update:sort="attendanceJustificationSort">

        <VFlexTable separators clickable>
            <template #body>
                <div v-if="attendanceJustificationStore?.loading" class="flex-list-inner">
                    <div v-for="key in paginationVar.per_page" :key="key" class="flex-table-item">
                        <VFlexTableCell>
                            <VPlaceload />
                        </VFlexTableCell>
                    </div>
                </div>
                <div v-else-if="attendanceJustificationsList.length === 0" class="flex-list-inner">
                    <VPlaceholderSection :title="t('tables.placeholder.title')"
                        :subtitle="t('tables.placeholder.subtitle')" class="my-6">
                    </VPlaceholderSection>
                </div>

            </template>
        </VFlexTable>

        <VFlexPagination v-if="(attendanceJustificationsList.length != 0 && paginationVar.max_page != 1)"
            :current-page="paginationVar.page" class="mt-6" :item-per-page="paginationVar.per_page"
            :total-items="paginationVar.total" :max-links-displayed="3" no-router
            @update:current-page="getAttendanceJustificationsPerPage" />
        <h6 v-if="attendanceJustificationsList.length != 0 && !attendanceJustificationStore?.loading">
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
        <VPlaceloadText v-if="attendanceJustificationStore?.loading" :lines="1" last-line-width="20%" class="mx-2" />

    </VFlexTableWrapper>





</template>

<style lang="scss">

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