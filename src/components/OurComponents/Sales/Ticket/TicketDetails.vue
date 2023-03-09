<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { useI18n } from 'vue-i18n'
import { Ticket, defaultTicket, TicketConsts } from '/@src/models/Sales/Ticket/ticket';
import { getTicket } from '/@src/services/Sales/Ticket/ticketService';

const route = useRoute()
const viewWrapper = useViewWrapper()
const currentTicket = ref<Ticket>(defaultTicket)
const ticketId = ref(0)
const loading = ref(false)
const { t } = useI18n()

// @ts-ignore
ticketId.value = route.params.id
viewWrapper.setPageTitle(t('ticket.details.title'))
useHead({
  title: t('ticket.details.title'),
})

onMounted(async () => {
  loading.value = true

  await getCurrentTicket()
  loading.value = false
})
const getCurrentTicket = async () => {
  const { ticket } = await getTicket(ticketId.value)
  currentTicket.value = ticket
}

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
                  <VButton color="success" to="/ticket">
                    {{ t('ticket.back_button') }}
                  </VButton>
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
                <div class="project-feature" v-if="service.service.has_item"
                  v-for="(item, index) in service.service.service_items" :key="index">
                  <VDropdown icon="ion:eye">
                    <template #content>
                      <p class="dropdown-item"> ({{ item.quantity }}) {{ item.item.name }} </p>
                    </template>
                  </VDropdown>
                </div>
                <div v-else class="project-feature">
                  <p> 0 </p>
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
                                      {{ currentTicket.paid_amount }}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div class="column is-6">
                                <div class="file-box">
                                  <div class="meta">
                                    <span>{{ t('ticket.details.remaining_amount') }}</span>
                                    <span>
                                      {{ currentTicket.remaining_amount }}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div class="column is-6">
                                <div class="file-box">
                                  <div class="meta">
                                    <span>{{ t('ticket.details.currency') }}</span>
                                    <span>
                                      {{ currentTicket.currency.name }}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div class="column is-6">
                                <div class="file-box">
                                  <div class="meta">
                                    <span>{{ t('ticket.details.currency_rate') }}</span>
                                    <span>
                                      {{ currentTicket.currency_rate }}
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
                                      {{ currentTicket.created_by.first_name }}
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
  </div>
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

.required::after {
  content: ' *';
  color: var(--danger);
}
</style>
