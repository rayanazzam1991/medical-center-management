<script lang="ts">
import { useI18n } from "vue-i18n"
import { ClientsCashReceiptsSearchFilter, defaultClientsCashReceiptsSearchFilter } from "/@src/models/Accounting/Transaction/record"
import { defaultPagination } from "/@src/utils/response"
import { Permissions } from "/@src/utils/consts/rolesPermissions"

export default defineComponent({
  props: {
    pagination: {
      default: defaultPagination,
    },
    default_per_page: {
      type: Number,
      default: 1,
    },
    is_for_customer: {
      type: Boolean,
      default: false,
    },
    customer_id: {
      type: Number,
      default: 0,
    },
    with_title: {
      type: Boolean,
      default: false,
    },
    is_for_show: {
      type: Boolean,
      default: true,
    },
    is_on_day: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, context) {
    const { t } = useI18n()
    const router = useRouter()
    const onOpen = () => {
      searchFilterPop.value = !searchFilterPop.value
      searchNote.value = ''
      context.emit('onOpen', searchFilterPop.value)
    }
    const popUpTrigger = (value: boolean) => {
      searchFilterPop.value = value
    }
    const searchFilterPop = ref(false)
    const default_per_page = props.default_per_page
    const pagination = props.pagination
    const searchNote = ref('')
    const is_reseted = ref(false)
    const keyIncrement = ref(0)
    const perPage = ref(pagination.per_page)
    const searchFilter = ref(defaultClientsCashReceiptsSearchFilter)
    const search = () => {
      searchFilter.value = {
        note: searchNote.value,
        per_page: perPage.value
      }
      if (props.is_on_day == true) {
        searchFilter.value.isOnDay = true
      } else {
        searchFilter.value.isOnDay = Number(false)
      }
      context.emit('search', searchFilter.value)

    }
    const resetFilter = () => {
      searchNote.value = ''
      searchFilter.value.note = undefined
      searchFilter.value.client_name = undefined
      searchFilter.value.currency_id = undefined
      searchFilter.value.cash_account_id = undefined

      is_reseted.value = true
      keyIncrement.value++
      context.emit('resetFilter', searchFilter.value)
    }
    const search_filter = (value: ClientsCashReceiptsSearchFilter) => {

      searchFilter.value = value
      searchFilter.value.per_page = perPage.value
      context.emit('search', searchFilter.value)
    }

    const resetFilter_popup = (value: ClientsCashReceiptsSearchFilter) => {
      searchFilter.value.cash_account_id = undefined
      searchFilter.value.note = undefined
      searchFilter.value.client_name = undefined

      context.emit('resetFilter', searchFilter.value)
    }
    const goToClientsCashReceipts = () => {
      if (props.is_for_customer) {
        router.push({ path: "/transaction/customer-cash-receipt/add", query: { customer_id: props.customer_id } })
      } else {
        router.push({ path: "/transaction/customer-cash-receipt/add" })
      }
    }

    return { t, resetFilter, search, goToClientsCashReceipts, default_per_page, Permissions, searchNote, perPage, pagination, keyIncrement, searchFilterPop, popUpTrigger, onOpen, search_filter, resetFilter_popup }
  },


})




</script>

<template>
  <form class="form-layout" v-on:submit.prevent="search">
    <div class="form-outer">
      <div class="form-header stuck-header">
        <h1 v-if="$props.with_title" class="title">
          {{ t('dashboards.accountant.client_cash_receipt_list') }}
        </h1>
        <div class="form-header-inner">
          <div class="left my-4 mx-2 ">
            <div class="columns is-flex is-align-items-center">
              <VControl class="mr-2 status-input">
                <VInput v-model="searchNote" type="text" :placeholder="t('transaction.search_filter.note')" />
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
              <VControl v-if="$props.is_for_show">
                <VButton v-permission="Permissions.CLIENT_CASH_RECEIPT_CREATE" class="" @click="goToClientsCashReceipts"
                  color="primary"> {{
                    t('customer_cash_receipt.add_customer_cash_receipts_button') }}
                </VButton>
              </VControl>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ClientsCashReceiptsSearchFilterModal :is_for_customer="$props.is_for_customer" :key="keyIncrement"
      :search_filter_popup="searchFilterPop" @search_filter_popup="popUpTrigger" @search="search_filter"
      @resetFilter="resetFilter_popup" />

  </form>
</template>

<style scoped lang="scss">
@import '/@src/scss/styles/tableHeader.scss';

.title {
  font-family: var(--font-alt);
  font-size: 1.25rem;
  margin-top: 1rem;

}
</style>
