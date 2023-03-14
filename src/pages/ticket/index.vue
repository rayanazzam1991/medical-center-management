<script setup lang="ts">
import { useHead } from '@vueuse/head'
import VTag from '/@src/components/base/tags/VTag.vue'
import { defaultTicketSearchFilter, Ticket, defaultTicket, TicketSearchFilter, TicketConsts } from '/@src/models/Sales/Ticket/ticket'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { defaultPagination } from '/@src/utils/response'
import { useTicket } from '/@src/stores/Sales/Ticket/ticketStore'
import { useI18n } from 'vue-i18n'
import { closeTicket, getTicketsList } from '/@src/services/Sales/Ticket/ticketService'
import CloseTicketDropDown from '/@src/components/OurComponents/CloseTicketDropDown.vue'
import sleep from '/@src/utils/sleep'
import { useNotyf } from '/@src/composable/useNotyf'
import { Notyf } from 'notyf'
import { getWaitingListByTicketId } from '/@src/services/Sales/WaitingList/waitingListService'
import { defaultWaitingListByTicket } from '/@src/models/Sales/WaitingList/waitingList'
import { TicketService } from '/@src/models/Sales/TicketService/ticketService'
import { addParenthesisToString } from '/@src/composable/helpers/stringHelpers'
const viewWrapper = useViewWrapper()
const { t } = useI18n()
viewWrapper.setPageTitle(t('ticket.table.title'))
useHead({
  title: t('ticket.table.title'),
})
const notif = useNotyf() as Notyf
const searchFilter = ref(defaultTicketSearchFilter)
const ticketsList = ref<Array<Ticket>>([])
const paginationVar = ref(defaultPagination)
const router = useRouter()
const ticketStore = useTicket()
const keyIncrement = ref(0)
const default_per_page = ref(1)
const closeTicketPopup = ref(false)
const selectedCloseTicket = ref<Ticket>(defaultTicket)
const currentServiceCardPopup = ref(false)
const isLoading = ref(false)
const ticketCurrentWaitingList = ref(defaultWaitingListByTicket)
const currentTicketServices = ref<TicketService[]>([])
const currentTicketServicesPrice = ref(0)
const currenctTicketId = ref(0)

onMounted(async () => {
  const { tickets, pagination } = await getTicketsList(searchFilter.value)
  ticketsList.value = tickets
  paginationVar.value = pagination
  keyIncrement.value = keyIncrement.value + 1
  default_per_page.value = pagination.per_page
});


const closeTicketStatus = async () => {
  const { message, success } = await closeTicket(selectedCloseTicket.value.id)
  if (success) {
    search(searchFilter.value)
    notif.dismissAll()
    await sleep(200);
    notif.success(t('toast.success.edit'))
  } else {
    await sleep(200);
    notif.error(message)
  }
  closeTicketPopup.value = false
}


const search = async (newSearchFilter: TicketSearchFilter) => {
  paginationVar.value.per_page = newSearchFilter.per_page ?? paginationVar.value.per_page
  const { tickets, pagination } = await getTicketsList(newSearchFilter)
  ticketsList.value = tickets
  paginationVar.value = pagination
  searchFilter.value = newSearchFilter
}
const resetFilter = async (newSearchFilter: TicketSearchFilter) => {
  searchFilter.value = newSearchFilter
  await search(searchFilter.value)
}
const getTicketsPerPage = async (pageNum: number) => {
  searchFilter.value.page = pageNum
  await search(searchFilter.value)
}
const ticketSort = async (value: string) => {
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

const viewCurrenyServiceCard = async (ticketId: number) => {
  currenctTicketId.value = ticketId
  const selectedTicket = ticketsList.value.find((ticket) => ticket.id == ticketId)
  if (selectedTicket?.status != TicketConsts.WAITING && selectedTicket?.status != TicketConsts.SERVING) {
    notif.error(t('toast.error.ticket.no_waiting_list'))
  } else {

    const { waiting_list_by_ticket, success, message } = await getWaitingListByTicketId(ticketId)
    currentTicketServices.value = []
    currentTicketServicesPrice.value = 0
    if (success) {
      ticketCurrentWaitingList.value = waiting_list_by_ticket
      waiting_list_by_ticket.ticket.requested_services.forEach((ticketService) => {
        if (ticketService.provider.id == waiting_list_by_ticket.current_provider.id) {
          currentTicketServices.value.push(ticketService)
          currentTicketServicesPrice.value += ticketService.sell_price
        }

      });
      currentServiceCardPopup.value = true
      keyIncrement.value++


    } else {
      notif.error(message)
    }
    isLoading.value = false

  }

}

const columns = {
  id: {
    searchable: true,
    align: 'center',
    label: t('ticket.table.columns.id')
  },
  customer_name: {
    searchable: true,
    align: 'center',
    label: t('ticket.table.columns.customer_name'),
    renderRow: (row: any) =>
      h('span', row.customer.user.first_name + ' ' + row.customer.user.last_name)
  },
  services_count: {
    searchable: true,
    align: 'center',
    label: t('ticket.table.columns.services_count'),
    renderRow: (row: any) =>
      h('span', row.services_count)
  },
  current_service_provider: {
    searchable: true,
    align: 'center',
    label: t('ticket.table.columns.current_service_provider'),
    renderRow: (row: any) =>
      h('span', row.current_service_provider ?? '-')
  },
  total_amount: {
    searchable: true,
    align: 'center',
    label: t('ticket.table.columns.total_amount'),
    renderRow: (row: any) =>
      h('span', row.total_amount)
  },
  status: {
    align: 'center',
    label: t('ticket.table.columns.status'),
    renderRow: (row: any) =>
      h(
        VTag,
        {
          rounded: true,
          color:
            row.status === TicketConsts.SERVING
              ? 'info'
              : row.status === TicketConsts.SERVICES_ARE_DONE
                ? 'success'
                : row.status === TicketConsts.WAITING
                  ? 'warning'
                  : 'danger',
        },
        {
          default() {
            return TicketConsts.getStatusName(row.status)
          },
        }
      ),
  },
  created_at: {
    searchable: true,
    sortable: true,
    align: 'center',
    label: t('ticket.table.columns.created_at'),
    renderRow: (row: any) =>
      h('span', row.created_at)
  },
  created_by: {
    align: 'center',
    label: t('ticket.table.columns.created_by'),
    renderRow: (row: any) =>
      h('span', row?.created_by?.first_name + ' ' + row?.created_by?.last_name)
  },
  actions: {
    align: 'center',
    label: t('ticket.table.columns.actions'),
    renderRow: (row: any) =>
      h(CloseTicketDropDown, {
        onEdit: () => {
          if (row.status != TicketConsts.CLOSED) {

            router.push({ path: `/ticket/${row.id}/edit` })
          } else {
            notif.error(t('toast.error.ticket.cannot_edit_closed_ticket'))
          }
        },
        onView: () => {
          router.push({ path: `/ticket/${row.id}` })
        },
        onCloseTicket: () => {
          closeTicketPopup.value = true
          selectedCloseTicket.value = row
        },
        onViewCurrentServiceCard: async () => {
          await viewCurrenyServiceCard(row.id)
        }


      }),
  },
} as const
const ticketServicesColumns = {
  service_name: {
    align: 'center',
    label: t("ticket.details.current_services.columns.service_name"),
    renderRow: (row: TicketService) =>
      h('span', row?.service.name),
  },
  service_price: {
    align: 'center',
    label: t("ticket.details.current_services.columns.service_price"),
    renderRow: (row: TicketService) =>
      h('span', row?.sell_price),
  },
  currency: {
    align: 'center',
    label: t("ticket.details.current_services.columns.currency"),
    renderRow: (row: TicketService) =>
      h('span', ticketsList.value.find((ticket) => ticket.id == currenctTicketId.value)?.currency.name),
  },
} as const

</script>

<template>
  <TicketTableHeader :key="keyIncrement" :title="viewWrapper.pageTitle" :button_name="t('ticket.header_button')"
    @search="search" :pagination="paginationVar" :default_per_page="default_per_page" @resetFilter="resetFilter" />
  <VFlexTableWrapper :columns="columns" :data="ticketsList" @update:sort="ticketSort">
    <VFlexTable separators clickable>
      <template #body>
        <div v-if="ticketStore?.loading" class="flex-list-inner">
          <div v-for="key in paginationVar.per_page" :key="key" class="flex-table-item">
            <VFlexTableCell>
              <VPlaceload />
            </VFlexTableCell>
          </div>
        </div>
        <div v-else-if="ticketsList.length === 0" class="flex-list-inner">
          <VPlaceholderSection :title="t('tables.placeholder.title')" :subtitle="t('tables.placeholder.subtitle')"
            class="my-6">
          </VPlaceholderSection>
        </div>
      </template>
    </VFlexTable>
    <VFlexPagination v-if="(ticketsList.length != 0 && paginationVar.max_page != 1)" :current-page="paginationVar.page"
      class="mt-6" :item-per-page="paginationVar.per_page" :total-items="paginationVar.total" :max-links-displayed="3"
      no-router @update:current-page="getTicketsPerPage" />
    <h6 v-if="ticketsList.length != 0 && !ticketStore?.loading">
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

    <VPlaceloadText v-if="ticketStore?.loading" :lines="1" last-line-width="20%" class="mx-2" />
  </VFlexTableWrapper>
  <VModal :title="t('ticket.table.modal_title')" :open="closeTicketPopup" actions="center"
    @close="closeTicketPopup = false">
    <template #content>
      <VPlaceholderSection :title="t('ticket.table.delete_modal.title')"
        :subtitle="t('ticket.table.delete_modal.subtitle', { title: viewWrapper.pageTitle })" />
    </template>
    <template #action="{ close }">
      <VButton color="primary" raised @click="closeTicketStatus()">{{ t('modal.buttons.confirm') }}
      </VButton>
    </template>
  </VModal>
  <VModal :key="keyIncrement" :title="t('ticket.details.current_service_card_modal')" :open="currentServiceCardPopup"
    actions="right" @close="currentServiceCardPopup = false">
    <template #content>
      <div class="modal-header">
        <h2> {{ t('ticket.details.customer_name') }}:
          <span>
            {{
              ticketCurrentWaitingList.ticket.customer.user.first_name
            }} {{ ticketCurrentWaitingList.ticket.customer.user.last_name }}
          </span>
        </h2>
        <h2>
          {{ t('ticket.details.service_provider_name') }}:
          <span> {{
            ticketCurrentWaitingList.current_provider.user.first_name
          }} {{ ticketCurrentWaitingList.current_provider.user.last_name }} </span>
        </h2>
        <h2> {{ t('ticket.details.turn_number') }}
          <span>
            {{ ticketCurrentWaitingList.turn_number }}</span>
        </h2>
        <h2> {{ t('ticket.details.date_time') }}: <span>{{ ticketCurrentWaitingList.created_at }}</span></h2>
        <h2> {{ t('ticket.details.sell_price') }}: <span>{{ currentTicketServicesPrice }} {{
          addParenthesisToString(ticketCurrentWaitingList.ticket.currency.name) }}</span></h2>
      </div>
      <VFlexTableWrapper :columns="ticketServicesColumns" :data="currentTicketServices">
        <VFlexTable separators clickable>
        </VFlexTable>
      </VFlexTableWrapper>
    </template>
    <template>
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

.modal-header {
  margin: 0 0 2rem;

  h2 {
    font-family: var(--font-alt);

    span {
      font-weight: 600;
      font-size: 1.1rem;

    }
  }
}

.is-dark {
  .tooltip .tooltiptext {
    background-color: rgb(43, 41, 41);
  }
}
</style>
