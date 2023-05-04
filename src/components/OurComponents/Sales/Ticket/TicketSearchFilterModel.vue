<script lang="ts">
import { useI18n } from "vue-i18n"
import { defaultTicketSearchFilter, TicketConsts } from "/@src/models/Sales/Ticket/ticket"


export default defineComponent({
  props: {
    title: {
      type: String,
      default: '',
    },
    button_name: {
      type: String,
      default: '',
    },
    search_filter_popup: {
      default: false,
    },
    is_reseted: {
      type: Boolean,
      default: false,
    },
    is_for_customer: {
      type: Boolean,
      default: false,
    },

  },
  emits: ['search_filter_popup', 'search', 'resetFilter'],
  setup(props, context) {
    const { t } = useI18n()
    const searchCustomerName = ref()
    const searchStatus = ref()
    const searchFilter = ref(defaultTicketSearchFilter)
    let search_filter_popup = computed({
      get: () => props.search_filter_popup as boolean,
      set(value) {
        value = false
        context.emit('search_filter_popup', value)
      },
    })
    const search = () => {
      searchFilter.value = {
        customer_name: searchCustomerName.value,
        status: searchStatus.value,
      }
      context.emit('search', searchFilter.value)
      search_filter_popup.value = false
    }
    const resetFilter = () => {
      searchCustomerName.value = undefined
      searchStatus.value = undefined
      searchFilter.value.customer_name = undefined
      searchFilter.value.status = undefined
      context.emit('resetFilter', searchFilter.value)
    }

    return { t, TicketConsts, search, resetFilter, search_filter_popup, searchCustomerName, searchStatus }
  },
})
</script>

<template>
  <VModal :title="t('ticket.search_filter.title')" :open="search_filter_popup" actions="center"
    @close="search_filter_popup = false">
    <template #content>
      <form class="form-layout" @submit.prevent="">
        <VField v-if="!$props.is_for_customer" class="column filter">
          <VControl icon="feather:search">
            <input v-model="searchCustomerName" type="text" class="input "
              :placeholder="t('ticket.search_filter.customer_name')" />
          </VControl>
        </VField>
        <VField class="column filter">
          <VControl>
            <VSelect v-model="searchStatus" class="">
              <VOption value="">{{ t('ticket.search_filter.status') }}</VOption>
              <VOption value="0">{{ TicketConsts.getStatusName(0) }}</VOption>
              <VOption value="1">{{ TicketConsts.getStatusName(1) }}</VOption>
              <VOption value="2">{{ TicketConsts.getStatusName(2) }}</VOption>
              <VOption value="3">{{ TicketConsts.getStatusName(3) }}</VOption>
              <VOption value="4">{{ TicketConsts.getStatusName(4) }}</VOption>
            </VSelect>
          </VControl>
        </VField>
        <VButton type="submit" @click="search" class="is-hidden" />

      </form>
    </template>
    <template #action="{ close }">
      <VButton icon="fas fa-filter" color="primary" raised @click="search">{{ t('modal.buttons.filter') }}</VButton>
    </template>
  </VModal>
</template>

