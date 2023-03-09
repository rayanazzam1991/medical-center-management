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
const props = withDefaults(
  defineProps<{
    activeTab?: 'Details' | 'Services'
  }>(),
  {
    activeTab: 'Details',
  }
)
const tab = ref(props.activeTab)
if (route.query.tab === 'Details'
  || route.query.tab === 'Services') {
  tab.value = route.query.tab
}
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
    <div class="project-details">
      <div class="tabs-wrapper is-triple-slider">
        <div :hidden="loading" class="tabs-inner">
          <div class="tabs tabs-width">
            <ul>
              <li :class="[tab === 'Details' && 'is-active']">
                <a tabindex="0" @keydown.space.prevent="tab = 'Details'" @click="tab = 'Details'"><span>{{
                  t('employee.details.tabs.details')
                }}</span></a>
              </li>
              <li :class="[tab === 'Services' && 'is-active']">
                <a tabindex="0" @keydown.space.prevent="tab = 'Services'" @click="tab = 'Services'"><span>{{
                  t('employee.details.tabs.services')
                }}</span></a>
              </li>
              <li class="tab-naver"></li>
            </ul>
          </div>
        </div>
        <div v-if="tab === 'Details'" class="tab-content is-active">
          <div class="columns project-details-inner">
            <div class="column is-12">
              <div class="project-details-card">
                <div class="card-head">
                  <div class="title-wrap">
                    <h3>{{ t('employee.details.main_details') }}</h3>
                  </div>
                </div>
                <div class="project-files">
                  <h4>{{ t('employee.details.more_info') }}</h4>
                  <div class="columns is-multiline">
                    <div class="column is-6">
                      <div class="file-box">
                        <div class="meta">
                          <span>{{ t('employee.details.starting_date') }}</span>
                          <span>
                            {{ currentTicket.id }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="column is-6">
                      <div class="file-box">
                        <div class="meta">
                          <span>{{ t('employee.details.end_date') }}</span>
                          <span>
                            {{ currentTicket.customer.user.first_name + ' ' + currentTicket.customer.user.last_name }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="column is-6">
                      <div class="file-box">
                        <div class="meta">
                          <span>{{ t('employee.details.department') }}</span>
                          <span>
                            {{ currentTicket.total_amount }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="column is-6">
                      <div class="file-box">
                        <div class="meta">
                          <span>{{ t('employee.details.room_number') }}</span>
                          <span>
                            {{ currentTicket.currency.name }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="column is-6">
                      <div class="file-box">
                        <div class="meta">
                          <span>{{ t('employee.details.basic_salary') }}</span>
                          <span>
                            {{ currentTicket.currency_rate }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="column is-6">
                      <div class="file-box">
                        <div class="meta">
                          <span>{{ t('employee.details.payment_percentage') }}</span>
                          <span>
                            {{ currentTicket.paid_amount }}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="column is-6">
                      <div class="file-box">
                        <div class="meta">
                          <span>{{ t('employee.details.nationality') }}</span>
                          <span>
                            {{ currentTicket.remaining_amount }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="column is-6">
                      <div class="file-box">
                        <div class="meta">
                          <span>{{ t('employee.details.address') }}</span>
                          <span>
                            {{ currentTicket.created_at }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="column is-12">
                      <div class="file-box">
                        <div class="meta full-width">
                          <div class="is-justify-content-space-between is-align-items-flex-start is-flex mt-2 ">
                            <div class="columns is-multiline">
                              <span class="column is-12 pb-0">{{
                                t('employee.details.employee_number') }}</span>
                              <span class="column py-2">
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
        <div v-if="tab === 'Services'" class="tab-content is-active">
          <div class="columns project-details-inner">
            <div class="column is-12">
              <div class="project-details-card">
                <div class="card-head pb-4 border-buttom">
                  <div class="title-wrap">
                    <h3>{{ t('employee.details.services') }}</h3>
                  </div>
                </div>
                <div v-if="currentTicket.requested_services.length == 0" class="project-features">
                  <div class="project-feature">
                    <i aria-hidden="true" class="lnil lnil-emoji-sad"></i>
                    <h4>{{ t('employee.details.tabs_content_placeholder.services') }}</h4>
                  </div>
                </div>

                <div class="project-files">
                  <div class="columns is-multiline border-buttom" v-for="service in currentTicket.requested_services"
                    :key="service.service.id">

                    <div class="column is-3">
                      <div class="file-box">
                        <div class="meta">
                          <span>{{ t('employee.details.service_name') }}</span>
                          <span>
                            {{ service.service.name }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="column is-3">
                      <div class="file-box">
                        <div class="meta">
                          <span>{{ t('employee.details.service_price') }}</span>
                          <span>
                            {{ service.sell_price }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="column is-3">
                      <div class="file-box">
                        <div class="meta">
                          <span>{{ t('employee.details.service_price') }}</span>
                          <span>
                            {{ service.service.quantity_item ?? 1 }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div class="column is-3">
                      <div class="file-box">
                        <div class="meta">
                          <span>{{ t('employee.details.service_price') }}</span>
                          <span>
                            <!-- {{ service }} -->
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
</template>

<style scoped lang="scss">
@import '/@src/scss/styles/multiTapedDetailsPage.scss';

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
