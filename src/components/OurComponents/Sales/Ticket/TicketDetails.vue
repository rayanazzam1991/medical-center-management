<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { useI18n } from 'vue-i18n'
import { Ticket, defaultTicket, TicketConsts } from '/@src/models/Sales/Ticket/ticket';
import { getTicket } from '/@src/services/Sales/Ticket/ticketService';
import { getWaitingListByTicketId } from '/@src/services/Sales/WaitingList/waitingListService';
import { defaultWaitingListByTicket } from '/@src/models/Sales/WaitingList/waitingList';
import { notifications } from '/@src/data/widgets/ui/notificationList';
import { useNotyf } from '/@src/composable/useNotyf';
import { Notyf } from 'notyf';
import { TicketService } from '/@src/models/Sales/TicketService/ticketService';
import { addParenthesisToString } from '/@src/composable/helpers/stringHelpers';
import usePrint from '/@src/composable/usePrint';
import sleep from '/@src/utils/sleep';
import usePrint8CM from '/@src/composable/usePrint8CM';

const router = useRouter()
const notif = useNotyf() as Notyf
const route = useRoute()
const viewWrapper = useViewWrapper()
const currentTicket = ref<Ticket>(defaultTicket)
const ticketId = ref(0)
const loading = ref(false)
const { t, locale } = useI18n()
const iconArrow = locale.value == "ar" ? "lnir lnir-arrow-right" : "lnir lnir-arrow-left"
const keyIncrement = ref(0)
const currentServiceCardPopup = ref(false)
const isLoading = ref(false)
const ticketCurrentWaitingList = ref(defaultWaitingListByTicket)
const currentTicketServices = ref<TicketService[]>([])
const currentTicketServicesPrice = ref(0)
// @ts-ignore
ticketId.value = route.params.id
viewWrapper.setPageTitle(t('ticket.details.title'))
useHead({
  title: t('ticket.details.title'),
})
const { printDiv8CM } = usePrint8CM('');
const print = async () => {
  printDiv8CM('printerable', t('ticket.table.title'))
}
const printServiceCard = async () => {
  await sleep(500)
  printDiv8CM('printerable_service_card', t('ticket.table.title'))
}

onMounted(async () => {
  loading.value = true

  await getCurrentTicket()
  loading.value = false
})
const getCurrentTicket = async () => {
  const { ticket } = await getTicket(ticketId.value)
  currentTicket.value = ticket
  keyIncrement.value++
}
const viewCurrenyServiceCard = async () => {
  isLoading.value = true
  const { waiting_list_by_ticket, success, message } = await getWaitingListByTicketId(ticketId.value)
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
const goToAddReminder = (ticketServiceId: number) => {
  router.push({ path: `/reminder/add`, query: { customer_id: currentTicket.value.customer.id, ticket_service_id: ticketServiceId } })
}

const columns = {
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
      h('span', currentTicket.value.currency?.name ?? t('place_holder.none')),
  },
} as const
</script>
<template>
  <div class="profile-wrapper">
    <div class="profile-header has-text-centered">
      <div class="profile-stats">
        <div class="profile-stat">
          <i aria-hidden="true" class="lnil lnil-user"></i>
          <span class="title is-size-5">{{ t('ticket.details.customer_name') }} : {{
            currentTicket.customer.user.first_name
            + ' ' +
            currentTicket.customer.user.last_name }}
          </span>
        </div>
        <div class="separator"></div>
        <div class="profile-stat">
          <i class="iconify mr-2" aria-hidden="true" data-icon="bi:ticket-perforated"></i>
          <span class="title is-size-5">{{ t('ticket.details.ticket') }}: {{ currentTicket.id }}
          </span>
        </div>
        <div class="separator"></div>
        <div class="profile-stat">
          <i aria-hidden="true" class="lnil lnil-checkmark-circle"></i>
          <span class="title is-size-5">{{ t('ticket.details.status') }}:
            <span :class="`has-text-${TicketConsts.getStatusColor(currentTicket.status)}`">{{
              TicketConsts.getStatusName(currentTicket.status)
            }}</span></span>
        </div>
      </div>
    </div>
  </div>

  <div class="profile-wrapper">
    <div class="project-details">
      <div class="tabs-wrapper is-triple-slider">
        <div class="columns project-details-inner">
          <div class="column is-12">
            <div class="project-details-card">
              <div class="card-head">
                <div class="title-wrap">
                  <h3>{{ t('ticket.details.services') }}</h3>
                </div>
                <div class="buttons">

                  <VButton :icon="iconArrow" to="/ticket">
                    {{ t('ticket.back_button') }}
                  </VButton>
                  <VButton :loading="isLoading"
                    :disabled="currentTicket.status != TicketConsts.SERVING && currentTicket.status != TicketConsts.WAITING"
                    @click="viewCurrenyServiceCard" color="primary">
                    {{ t('ticket.details.view_current_service_card') }}
                  </VButton>
                  <VIconButton icon="lnir lnir-printer" outlined color="primary" @click="print" />


                </div>
              </div>
              <div class="project-features">
                <div class="project-feature">
                  <h4>{{ t('ticket.details.name') }}</h4>
                </div>
                <div class="project-feature">
                  <h4>{{ t('ticket.details.service_provider_name') }}</h4>
                </div>
                <div class="project-feature">
                  <h4>{{ t('ticket.details.sell_price') }}</h4>
                </div>
                <div class="project-feature">
                  <h4>{{ t('ticket.details.items_list') }}</h4>
                </div>
                <div class="project-feature">
                </div>
              </div>
              <div class="project-features" v-for="(service, index) in currentTicket.requested_services" :key="index">
                <div class="project-feature">

                  <p>
                    {{ service.service.name }}
                  </p>
                </div>
                <div class="project-feature">

                  <p> {{ service.provider.user.first_name + ' ' + service.provider.user.last_name }}</p>
                </div>
                <div class="project-feature">

                  <p> {{ service.sell_price }}</p>
                </div>
                <div class="project-feature" v-if="service.service.has_item">
                  <VDropdown icon="ion:eye">
                    <template #content>
                      <p class="dropdown-item" v-for="(item, index) in service.service.service_items" :key="index"> ({{
                        item.quantity }}) {{ item.item.name }} </p>
                    </template>
                  </VDropdown>
                </div>
                <div v-else class="project-feature">
                  <p> 0 </p>
                </div>
                <div class="project-feature">
                  <VButton @click="goToAddReminder(service.id)" color="primary" outlined icon="lnir lnir-alarm-2">{{
                    t('reminder.add_button') }}</VButton>
                </div>

              </div>
              <div class="project-details">
                <div class="tabs-wrapper is-triple-slider">
                  <div class="tab-content is-active">
                    <div class="columns project-details-inner">
                      <div class="column is-12">
                        <div class="project-details-card">
                          <div class="project-files">

                            <div class="columns is-multiline">
                              <div class="column is-6">
                                <div class="file-box">
                                  <div class="meta">
                                    <span>{{ t('ticket.details.paid_amount') }}</span>
                                    <span>
                                      {{ currentTicket.paid_amount ?? t('place_holder.none') }}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div class="column is-6">
                                <div class="file-box">
                                  <div class="meta">
                                    <span>{{ t('ticket.details.remaining_amount') }}</span>
                                    <span>
                                      {{ currentTicket.remaining_amount ?? t('place_holder.none') }}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div class="column is-6">
                                <div class="file-box">
                                  <div class="meta">
                                    <span>{{ t('ticket.details.currency') }}</span>
                                    <span>
                                      {{ currentTicket.currency?.name ?? t('place_holder.none') }}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div class="column is-6">
                                <div class="file-box">
                                  <div class="meta">
                                    <span>{{ t('ticket.details.currency_rate') }}</span>
                                    <span>
                                      {{ currentTicket.currency_rate ?? t('place_holder.none') }}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div class="column is-6">
                                <div class="file-box">
                                  <div class="meta">
                                    <span>{{ t('ticket.details.created_at') }}</span>
                                    <span>
                                      {{ currentTicket.created_at }}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div class="column is-6">
                                <div class="file-box">
                                  <div class="meta">
                                    <span>{{ t('ticket.details.created_by') }}</span>
                                    <span>
                                      {{ currentTicket.created_by.first_name + ' ' + currentTicket.created_by.last_name }}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
      </div>
    </div>
    <VModal :key="keyIncrement" :title="t('ticket.details.current_service_card_modal')" :open="currentServiceCardPopup"
      actions="right" @close="currentServiceCardPopup = false">
      <template #content>
        <div class="modal-header">
          <h2> {{ t('ticket.details.turn_number') }}
            <span>
              {{ ticketCurrentWaitingList.turn_number }}</span>
          </h2>
          <h2>
            {{ t('ticket.details.service_provider_name') }}:
            <span> {{
              ticketCurrentWaitingList.current_provider.user.first_name
            }} {{ ticketCurrentWaitingList.current_provider.user.last_name }} </span>
          </h2>
        </div>
      </template>
      <template #action="{ close }">
        <VButton icon="lnir lnir-printer" color="primary" raised @click="printServiceCard">{{ t('modal.buttons.print') }}
        </VButton>
      </template>
    </VModal>

  </div>
  <TicketPrint :key="keyIncrement" :ticket="currentTicket" />
  <ClientServiceCardPrint :key="keyIncrement" :service-card-by-ticket-props="ticketCurrentWaitingList" />
</template>

<style scoped lang="scss">
@import '/@src/scss/styles/multiTapedDetailsPageServices.scss';

.tabs-width {
  min-width: 350px;
  min-height: 40px;

  .is-active {
    min-height: 40px;

  }
}

.tabs-wrapper .tabs li a,
.tabs-wrapper-alt .tabs li a {
  height: 40px;

}

.tabs li {
  min-height: 38px !important;

}


.file-link {
  color: var(--primary-grey) !important;
}

.file-link:hover {
  color: var(--primary) !important;
}

.full-width {
  width: 100%;
  margin-right: 12px;
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
</style>
