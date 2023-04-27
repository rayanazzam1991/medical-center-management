      
<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { Notyf } from 'notyf';
import { useI18n } from 'vue-i18n';
import VTag from '/@src/components/base/tags/VTag.vue';
import VTagTippy from '/@src/components/OurComponents/VTagTippy.vue';
import { useNotyf } from '/@src/composable/useNotyf';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { defaultPagination } from '/@src/utils/response';
import { defaultCancelReservation, defaultReservationSearchFilter, Reservation, ReservationConsts, ReservationSearchFilter } from '/@src/models/Sales/Reservation/reservation';
import { useReservation } from '/@src/stores/Sales/Reservation/reservationStore';
import { cancelReservation, deactivateReservation, getReservationsList } from '/@src/services/Sales/Reservation/reservationService';
import ReservationListDropDown from '/@src/components/OurComponents/Sales/Reservation/ReservationListDropDown.vue';
import { Permissions } from '/@src/utils/consts/rolesPermissions';


const viewWrapper = useViewWrapper()
const { t } = useI18n()
viewWrapper.setPageTitle(t('reservation.table.title'))
useHead({
    title: t('reservation.table.title'),
})
const notif = useNotyf() as Notyf
const reservationStore = useReservation()
const searchFilter = ref(defaultReservationSearchFilter)
const reservationsList = ref<Array<Reservation>>([])
const paginationVar = ref(defaultPagination)
const keyIncrement = ref(0)
const router = useRouter()
const default_per_page = ref(1)
const cancelReservationData = ref(defaultCancelReservation)
const cancelReservationPopup = ref(false)
const cancelReservationId = ref(0)


onMounted(async () => {
    const { reservations, pagination } = await getReservationsList(searchFilter.value)
    reservationsList.value = reservations
    paginationVar.value = pagination
    keyIncrement.value = keyIncrement.value + 1
    default_per_page.value = pagination.per_page

});

const search = async (newSearchFilter: ReservationSearchFilter) => {
    paginationVar.value.per_page = newSearchFilter.per_page ?? paginationVar.value.per_page
    const { reservations, pagination } = await getReservationsList(newSearchFilter)
    reservationsList.value = reservations
    paginationVar.value = pagination
    searchFilter.value = newSearchFilter
}

const resetFilter = async (newSearchFilter: ReservationSearchFilter) => {
    searchFilter.value = newSearchFilter
    await search(searchFilter.value)
}

const getReservationsPerPage = async (pageNum: number) => {
    searchFilter.value.page = pageNum
    await search(searchFilter.value)
}
const reservationSort = async (value: string) => {
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
const deactivateReservationFunction = async (reservationId: number) => {
    const { success, message } = await deactivateReservation(reservationId)
    if (success) {
        notif.success(t('toast.success.deactivate_reservation'))
        await search(searchFilter.value)
    } else {
        notif.error({ message: message, duration: 3000 })
    }
}
const cancelReservationFunction = async () => {
    if (cancelReservationData.value.cancellation_reason && cancelReservationData.value.cancellation_reason?.length > 255) {
        notif.error({ message: t('toast.error.reservation.cancellation_reason_too_long'), duration: 3000 })
        return
    }
    const { success, message } = await cancelReservation(cancelReservationId.value, cancelReservationData.value)
    if (success) {
        notif.success(t('toast.success.cancel_reservation'))
        await search(searchFilter.value)
        cancelReservationPopup.value = false
    } else {
        notif.error({ message: message, duration: 3000 })
    }
}

const columns = {
    "customer_name": {
        align: 'center',
        label: t("reservation.table.columns.customer_name"),
        renderRow: (row: Reservation) =>
            h('span', row.customer.user.first_name + ' ' + row.customer.user.last_name),
    },
    "service_name": {
        align: 'center',
        label: t("reservation.table.columns.service_name"),
        renderRow: (row: Reservation) =>
            h('span', row.service_provider.service?.name),
    },
    "provider_name": {
        align: 'center',
        label: t("reservation.table.columns.provider_name"),
        renderRow: (row: Reservation) =>
            h('span', row.service_provider.provider.user.first_name + ' ' + row.service_provider.provider.user.last_name),
    },
    "date": {
        align: 'center',
        sortable: true,
        label: t("reservation.table.columns.date"),
        renderRow: (row: Reservation) =>
            h('span', row.date),
    },
    "time": {
        align: 'center',
        label: t("reservation.table.columns.time"),
        renderRow: (row: Reservation) =>
            h('span', row.time_from + ' - ' + row.time_to),
    },
    status: {
        align: 'center',
        label: t("reservation.table.columns.status"),
        renderRow: (row: Reservation) => {

            if (row.status !== ReservationConsts.CANCELLED) {
                return h(
                    VTag,
                    {
                        rounded: true,
                        color: ReservationConsts.getStatusColor(row.status),
                    },
                    {
                        default() {
                            return ReservationConsts.getStatusName(row.status)
                        },
                    }
                );
            } else {
                return h(
                    VTagTippy,
                    {
                        rounded: true,
                        tag_color: ReservationConsts.getStatusColor(row.status),
                        tippy_content: row.cancellation_reason ? t("reservation.table.columns.cancellation_reason") + " : " + row.cancellation_reason : t("reservation.table.columns.cancellation_reason") + " : " + t('reservation.table.columns.no_cancellation_reason')
                    },
                    {
                        default() {
                            return ReservationConsts.getStatusName(row.status)
                        },
                    }
                );
            }
        }


    },
    "created_at": {
        align: 'center',
        sortable: true,
        label: t("reservation.table.columns.created_at")
    },
    "created_by": {
        align: 'center',
        label: t("reservation.table.columns.created_by"),
        renderRow: (row: Reservation) =>
            h('span', row.created_by.first_name + ' ' + row.created_by.last_name),

    },
    actions: {
        align: 'center',
        label: t("reservation.table.columns.actions"),
        renderRow: (row: Reservation) =>
            h(ReservationListDropDown, {
                cancelPermission: Permissions.VARIABLE_PAYMENT_EDIT,
                deactivatePermission: Permissions.VARIABLE_PAYMENT_EDIT,
                canCancelDeactivate: row.can_decativate_cancel,
                onDeactivate: async () => {
                    await deactivateReservationFunction(row.id)
                },
                onCancel: () => {
                    cancelReservationData.value.cancellation_reason = undefined
                    cancelReservationId.value = row.id
                    cancelReservationPopup.value = true
                },

            }),

    },
} as const
</script>
    
<template>
    <ReservationListTableHeader :key="keyIncrement" :button_name="t('reservation.table.header_button')" @search="search"
        :pagination="paginationVar" :default_per_page="default_per_page" @resetFilter="resetFilter" />

    <VFlexTableWrapper :columns="columns" :data="reservationsList" @update:sort="reservationSort">

        <VFlexTable separators clickable>
            <template #body>
                <div v-if="reservationStore?.loading" class="flex-list-inner">
                    <div v-for="key in paginationVar.per_page" :key="key" class="flex-table-item">
                        <VFlexTableCell>
                            <VPlaceload />
                        </VFlexTableCell>
                    </div>
                </div>
                <div v-else-if="reservationsList.length === 0" class="flex-list-inner">
                    <VPlaceholderSection :title="t('tables.placeholder.title')" :subtitle="t('tables.placeholder.subtitle')"
                        class="my-6">
                    </VPlaceholderSection>
                </div>
            </template>
        </VFlexTable>
        <VFlexPagination v-if="(reservationsList.length != 0 && paginationVar.max_page != 1)"
            :current-page="paginationVar.page" class="mt-6" :item-per-page="paginationVar.per_page"
            :total-items="paginationVar.total" :max-links-displayed="3" no-router
            @update:current-page="getReservationsPerPage" />
        <h6 class="pt-2 is-size-7" v-if="reservationsList.length != 0 && !reservationStore?.loading">
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
        <VPlaceloadText v-if="reservationStore?.loading" :lines="1" last-line-width="20%" class="mx-2" />
    </VFlexTableWrapper>
    <VModal :title="t('reservation.cancel_reservation_modal.title')" :open="cancelReservationPopup" actions="center"
        @close="cancelReservationPopup = false">
        <template #content>
            <VField class="column">
                <VLabel>{{ t('reservation.cancel_reservation_modal.cancellation_reason') }}
                </VLabel>
                <VControl>
                    <VTextarea v-model="cancelReservationData.cancellation_reason" class="is-primary-focus" rows="2"
                        :placeholder="t('reservation.cancel_reservation_modal.cancellation_reason_placeholder')" />
                </VControl>
            </VField>
            <VPlaceholderSection :title="t('reservation.cancel_reservation_modal.caution')"
                :subtitle="t('reservation.cancel_reservation_modal.subtitle')" />
        </template>
        <template #action="{ close }">
            <VButton :loading="reservationStore.loading" color="primary" raised @click="cancelReservationFunction">{{
                t('modal.buttons.confirm')
            }}</VButton>
        </template>
    </VModal>
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
    