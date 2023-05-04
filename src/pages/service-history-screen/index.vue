<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "permissions": [
            "service_history_screen_list"
        ]
    }
}
</route>
    
<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { Notyf } from 'notyf';
import { useI18n } from 'vue-i18n';
import { useNotyf } from '/@src/composable/useNotyf';
import { Reminder, ReminderConsts } from '/@src/models/Sales/Reminder/reminder';
import { defaultServiceHistoryScreenSearchFilter, ServiceHistoryScreen, ServiceHistoryScreenSearchFilter } from '/@src/models/Sales/ServiceHistoryScreen/serviceHistoryScreen';
import { getServiceHistoryScreensList } from '/@src/services/Sales/ServiceHistoryScreen/serviceHistoryScreenService';
import { useServiceHistoryScreen } from '/@src/stores/Sales/ServiceHistoryScreen/serviceHistoryScreenStore';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { defaultPagination } from '/@src/utils/response';
import ViewEditDropDown from '/@src/components/OurComponents/ViewEditDropDown.vue'
import { Permissions } from '/@src/utils/consts/rolesPermissions';



const viewWrapper = useViewWrapper()
const { t } = useI18n()
viewWrapper.setPageTitle(t('service_history_screen.table.title'))
useHead({
    title: t('service_history_screen.table.title'),
})
const notif = useNotyf() as Notyf
const serviceHistoryScreenStore = useServiceHistoryScreen()
const searchFilter = ref(defaultServiceHistoryScreenSearchFilter)
const serviceHistoryScreensList = ref<Array<ServiceHistoryScreen>>([])
const paginationVar = ref(defaultPagination)
const keyIncrement = ref(0)
const router = useRouter()
const default_per_page = ref(1)
onMounted(async () => {
    const { screens, pagination } = await getServiceHistoryScreensList(searchFilter.value)
    serviceHistoryScreensList.value = screens
    paginationVar.value = pagination
    keyIncrement.value = keyIncrement.value + 1
    default_per_page.value = pagination.per_page

});

const search = async (newSearchFilter: ServiceHistoryScreenSearchFilter) => {
    paginationVar.value.per_page = newSearchFilter.per_page ?? paginationVar.value.per_page
    const { screens, pagination } = await getServiceHistoryScreensList(searchFilter.value)
    serviceHistoryScreensList.value = screens
    paginationVar.value = pagination
    searchFilter.value = newSearchFilter
}

const resetFilter = async (newSearchFilter: ServiceHistoryScreenSearchFilter) => {
    searchFilter.value = newSearchFilter
    await search(searchFilter.value)
}

const getServiceHistoryScreensPerPage = async (pageNum: number) => {

    searchFilter.value.page = pageNum
    await search(searchFilter.value)
}
const remindersSort = async (value: string) => {
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

const columns = {
    customer: {
        align: 'center',
        label: t("service_history_screen.table.columns.name"),
        renderRow: (row: ServiceHistoryScreen) =>
            h('span', row?.name),
    },
    rooms: {
        align: 'center',
        label: t("service_history_screen.table.columns.rooms"),
        renderRow: (row: ServiceHistoryScreen) => {
            let roomsNames = ''
            row?.filters.rooms.forEach((room, index) => {
                if (index < row.filters.rooms.length - 1)
                    roomsNames = roomsNames + room.department?.name + ' #' + room.number + ' | '
                else
                    roomsNames = roomsNames + room.department?.name + ' #' + room.number

            });
            if (row.filters.rooms.length == 0) {
                roomsNames = '-'
            }
            return h('span', roomsNames);

        },
    },
    departments: {
        align: 'center',
        label: t("service_history_screen.table.columns.departments"),
        renderRow: (row: ServiceHistoryScreen) => {
            let departmentsNames = ''
            row?.filters.departments.forEach((department, index) => {
                if (index < row.filters.departments.length - 1)
                    departmentsNames = departmentsNames + department.name + ' | '
                else
                    departmentsNames = departmentsNames + department.name

            });
            if (row.filters.departments.length == 0) {
                departmentsNames = '-'
            }
            return h('span', departmentsNames);

        },
    },
    services: {
        align: 'center',
        label: t("service_history_screen.table.columns.services"),
        renderRow: (row: ServiceHistoryScreen) => {
            let servicesNames = ''
            row?.filters.services.forEach((service, index) => {
                if (index < row.filters.services.length - 1)
                    servicesNames = servicesNames + service.name + ' | '
                else
                    servicesNames = servicesNames + service.name

            });
            if (row.filters.services.length == 0) {
                servicesNames = '-'
            }
            return h('span', servicesNames);

        },
    },
    created_at: {
        searchable: true,
        sortable: true,
        align: 'center',
        label: t('service_history_screen.table.columns.created_at'),
        renderRow: (row: ServiceHistoryScreen) =>
            h('span', row.created_at)
    },
    created_by: {
        align: 'center',
        label: t('service_history_screen.table.columns.created_by'),
        renderRow: (row: ServiceHistoryScreen) =>
            h('span', row?.created_by?.first_name + ' ' + row?.created_by?.last_name)
    },
    actions: {
        align: 'center',
        label: t('service_history_screen.table.columns.actions'),
        renderRow: (row: ServiceHistoryScreen) =>
            h(ViewEditDropDown, {
                editPermission: Permissions.SERVICE_HISTORY_SCREEN_EDIT,
                viewPermission: Permissions.SERVICE_HISTORY_SCREEN_SHOW,
                onEdit: () => {

                    router.push({ path: `/service-history-screen/${row.id}/edit` })
                },
                onView: () => {
                    router.push({ path: `/service-history-screen/${row.id}` })
                },


            }),
    },



} as const
</script>

<template>
    <ServiceHistoryScreenTableHeader :key="keyIncrement" :title="viewWrapper.pageTitle" @search="search"
        :pagination="paginationVar" :default_per_page="default_per_page" @resetFilter="resetFilter" />


    <VFlexTableWrapper :columns="columns" :data="serviceHistoryScreensList" @update:sort="remindersSort">

        <VFlexTable separators clickable>
            <template #body>
                <div v-if="serviceHistoryScreenStore?.loading" class="flex-list-inner">
                    <div v-for="key in paginationVar.per_page" :key="key" class="flex-table-item">
                        <VFlexTableCell>
                            <VPlaceload />
                        </VFlexTableCell>
                    </div>
                </div>
                <div v-else-if="serviceHistoryScreensList.length === 0" class="flex-list-inner">
                    <VPlaceholderSection :title="t('tables.placeholder.title')" :subtitle="t('tables.placeholder.subtitle')"
                        class="my-6">
                    </VPlaceholderSection>
                </div>
            </template>
        </VFlexTable>
        <VFlexPagination v-if="(serviceHistoryScreensList.length != 0 && paginationVar.max_page != 1)"
            :current-page="paginationVar.page" class="mt-6" :item-per-page="paginationVar.per_page"
            :total-items="paginationVar.total" :max-links-displayed="3" no-router
            @update:current-page="getServiceHistoryScreensPerPage" />
        <h6 class="pt-2 is-size-7" v-if="serviceHistoryScreensList.length != 0 && !serviceHistoryScreenStore?.loading">
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
        <VPlaceloadText v-if="serviceHistoryScreenStore?.loading" :lines="1" last-line-width="20%" class="mx-2" />
    </VFlexTableWrapper>
</template>

