<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { Notyf } from 'notyf';
import { useI18n } from 'vue-i18n';
import VTag from '/@src/components/base/tags/VTag.vue';
import ChangeStatusDropDown from '/@src/components/OurComponents/ChangeStatusDropDown.vue';
import { useNotyf } from '/@src/composable/useNotyf';
import { defaultReminderSearchFilter, Reminder, ReminderSearchFilter, ReminderConsts } from '/@src/models/Sales/Reminder/reminder';
import { getRemindersList } from '/@src/services/Sales/Reminder/reminderService';
import { useReminder } from '/@src/stores/Sales/Reminder/reminderStore';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { defaultPagination } from '/@src/utils/response';



const viewWrapper = useViewWrapper()
const { t } = useI18n()
viewWrapper.setPageTitle(t('reminder.table.title'))
useHead({
    title: t('reminder.table.title'),
})
const notif = useNotyf() as Notyf
const reminderStore = useReminder()
const searchFilter = ref(defaultReminderSearchFilter)
const remindersList = ref<Array<Reminder>>([])
const paginationVar = ref(defaultPagination)
const keyIncrement = ref(0)
const router = useRouter()
const default_per_page = ref(1)
onMounted(async () => {
    const { reminders, pagination } = await getRemindersList(searchFilter.value)
    remindersList.value = reminders
    paginationVar.value = pagination
    keyIncrement.value = keyIncrement.value + 1
    default_per_page.value = pagination.per_page

});

const search = async (newSearchFilter: ReminderSearchFilter) => {
    paginationVar.value.per_page = newSearchFilter.per_page ?? paginationVar.value.per_page
    const { reminders, pagination } = await getRemindersList(newSearchFilter)
    remindersList.value = reminders
    paginationVar.value = pagination
    searchFilter.value = newSearchFilter
}

const resetFilter = async (newSearchFilter: ReminderSearchFilter) => {
    searchFilter.value = newSearchFilter
    search(searchFilter.value)
}

const getRemindersPerPage = async (pageNum: number) => {

    searchFilter.value.page = pageNum
    search(searchFilter.value)
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
        label: t("reminder.table.columns.customer"),
        renderRow: (row: Reminder) =>
            h('span', row?.customer?.user?.first_name + ' ' + row?.customer?.user?.last_name),
    },
    customer_phone_number: {
        align: 'center',
        label: t("reminder.table.columns.customer_phone_number"),
        renderRow: (row: Reminder) =>
            h('span', row?.customer?.user?.phone_number),
    },
    requested_service: {
        align: 'center',
        label: t("reminder.table.columns.requested_service"),
        renderRow: (row: Reminder) =>
            h('span', row?.service.service.name),
    },
    note: {
        align: 'center',
        grow: true,
        label: t("reminder.table.columns.note"),
        renderRow: (row: Reminder) =>
            h('span', row?.note),
    },
    date: {
        align: 'center',
        sortable: true,

        label: t("reminder.table.columns.date"),
        renderRow: (row: Reminder) =>
            h('span', row?.date),
    },
    time: {
        align: 'center',
        sortable: true,
        label: t("reminder.table.columns.time"),
        renderRow: (row: Reminder) =>
            h('span', row?.time),
    },
    status: {
        align: 'center',
        label: t("reminder.table.columns.status"),

        renderRow: (row: Reminder) =>
            h(
                VTag,
                {
                    rounded: true,
                    color: ReminderConsts.getStatusColor(row.status)
                },
                {
                    default() {
                        return ReminderConsts.getStatusName(row.status)
                    },
                }
            )
    },
    actions: {
        align: 'center',
        label: t("reminder.table.columns.actions"),
        renderRow: (row: any) =>
            h(ChangeStatusDropDown, {

                onChangeStatus: () => {
                }

            }),

    },

} as const
</script>

<template>
    <ReminderTableHeader :key="keyIncrement" :title="viewWrapper.pageTitle" @search="search" :pagination="paginationVar"
        :default_per_page="default_per_page" @resetFilter="resetFilter" />


    <VFlexTableWrapper :columns="columns" :data="remindersList" @update:sort="remindersSort">

        <VFlexTable separators clickable>
            <template #body>
                <div v-if="reminderStore?.loading" class="flex-list-inner">
                    <div v-for="key in paginationVar.per_page" :key="key" class="flex-table-item">
                        <VFlexTableCell>
                            <VPlaceload />
                        </VFlexTableCell>
                    </div>
                </div>
                <div v-else-if="remindersList.length === 0" class="flex-list-inner">
                    <VPlaceholderSection :title="t('tables.placeholder.title')" :subtitle="t('tables.placeholder.subtitle')"
                        class="my-6">
                    </VPlaceholderSection>
                </div>
            </template>
        </VFlexTable>
        <VFlexPagination v-if="(remindersList.length != 0 && paginationVar.max_page != 1)"
            :current-page="paginationVar.page" class="mt-6" :item-per-page="paginationVar.per_page"
            :total-items="paginationVar.total" :max-links-displayed="3" no-router
            @update:current-page="getRemindersPerPage" />
        <h6 class="pt-2 is-size-7" v-if="remindersList.length != 0 && !reminderStore?.loading">
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
        <VPlaceloadText v-if="reminderStore?.loading" :lines="1" last-line-width="20%" class="mx-2" />
    </VFlexTableWrapper>
</template>

