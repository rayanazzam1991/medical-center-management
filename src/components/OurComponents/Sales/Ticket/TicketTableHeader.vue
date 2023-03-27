<script lang="ts">
import { defaultPagination } from "/@src/utils/response"
import { useI18n } from "vue-i18n"
import { defaultTicketSearchFilter, TicketConsts, TicketSearchFilter } from "/@src/models/Sales/Ticket/ticket"
import { Permissions } from "/@src/utils/consts/rolesPermissions"

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
    pagination: {
      default: defaultPagination,
    },
    default_per_page: {
      type: Number,
      default: 1,
    }

  },
  setup(props, context) {
    const { t } = useI18n()
    const onOpen = () => {
      searchFilterPop.value = !searchFilterPop.value
      context.emit('onOpen', searchFilterPop.value)
    }
    const popUpTrigger = (value: boolean) => {
      searchFilterPop.value = value
    }
    const searchFilterPop = ref(false)
    const keyTest = ref(0)
    const default_per_page = props.default_per_page
    const pagination = props.pagination
    const searchId = ref()
    const perPage = ref(pagination.per_page)
    const searchFilter = ref(defaultTicketSearchFilter)
    const search = () => {
      searchFilter.value = {
        id: searchId.value,
        per_page: perPage.value
      }
      context.emit('search', searchFilter.value)

    }
    const resetFilter = () => {
      searchId.value = undefined
      searchFilter.value.id = undefined
      searchFilter.value.customer_name = undefined
      searchFilter.value.status = undefined
      keyTest.value++
      context.emit('resetFilter', searchFilter.value)

    }
    const search_filter = (value: TicketSearchFilter) => {
      searchFilter.value = value
      searchFilter.value.per_page = perPage.value
      searchFilter.value.page = 1

      context.emit('search', searchFilter.value)
    }
    const resetFilter_popup = (value: TicketSearchFilter) => {
      searchFilter.value.id = undefined
      context.emit('resetFilter', searchFilter.value)

    }
    return { t, Permissions, resetFilter, popUpTrigger, resetFilter_popup, search_filter, TicketConsts, searchFilterPop, search, default_per_page, searchId, onOpen, keyTest, perPage, pagination }
  },
})
</script>

<template>
  <form class="form-layout" v-on:submit.prevent="search">
    <div class="form-outer">
      <div class="form-header stuck-header">
        <div class="form-header-inner">
          <div class="left my-4 mx-2 ">
            <div class="columns is-flex is-align-items-center">
              <VControl class="mr-2" icon="feather:search">
                <VInput v-model="searchId" type="text" :placeholder="t('ticket.search_filter.id')" />
              </VControl>
              <VIconButton class="mr-2" @click.prevent="onOpen" icon="fas fa-filter" />
              <VIconButton class="mr-2" v-on:click="resetFilter" icon="feather:rotate-ccw" :raised="false"
                color="danger" />

            </div>
          </div>
          <div class="left my-4 mx-2">
            <div class="columns is-flex is-align-items-center">
              <VControl class="mr-2 ">
                <div class="select">

                  <select v-model="perPage" @change="search">
                    <VOption :value="default_per_page * 0.1">{{ default_per_page *
                      0.1
                    }}
                    </VOption>
                    <VOption :value="default_per_page * 0.5">{{ default_per_page * 0.5 }}
                    </VOption>
                    <VOption :value="default_per_page">{{ default_per_page }}
                    </VOption>
                    <VOption :value="default_per_page * 2">{{ default_per_page * 2 }}
                    </VOption>
                    <VOption :value="default_per_page * 10">{{ default_per_page * 10 }}
                    </VOption>
                  </select>
                </div>
              </VControl>
              <VControl>
                <VButton v-permission="Permissions.TICKET_CREATE" to="/ticket/add" color="primary">{{ button_name }}
                </VButton>
              </VControl>

            </div>
          </div>
        </div>
      </div>
    </div>
    <TicketSearchFilterModel :key="keyTest" :search_filter_popup="searchFilterPop" @search_filter_popup="popUpTrigger"
      @search="search_filter" @resetFilter="resetFilter_popup" />
  </form>
</template>

<style   lang="scss">
@import '/@src/scss/styles/tableHeader.scss';
</style>
