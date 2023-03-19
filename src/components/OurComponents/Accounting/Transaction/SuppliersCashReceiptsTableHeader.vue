<script lang="ts">
import { useI18n } from "vue-i18n"
import { defaultSuppliersCashReceiptsSearchFilter, SuppliersCashReceiptsSearchFilter } from "/@src/models/Accounting/Transaction/record"
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
    }

  },

  setup(props, context) {
    const { t } = useI18n()
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
    const searchFilter = ref(defaultSuppliersCashReceiptsSearchFilter)
    const search = () => {
      searchFilter.value = {
        note: searchNote.value,
        per_page: perPage.value
      }
      context.emit('search', searchFilter.value)

    }
    const resetFilter = () => {
      searchNote.value = ''
      searchFilter.value.note = undefined
      is_reseted.value = true
      keyIncrement.value++
      context.emit('resetFilter', searchFilter.value)
    }
    const search_filter = (value: SuppliersCashReceiptsSearchFilter) => {
      searchFilter.value = value
      searchFilter.value.per_page = perPage.value
      context.emit('search', searchFilter.value)
    }

    const resetFilter_popup = (value: SuppliersCashReceiptsSearchFilter) => {
      searchFilter.value.cash_account_id = undefined
      searchFilter.value.note = undefined
      searchFilter.value.supplier_name = undefined
      searchFilter.value.currency_id = undefined
      searchFilter.value.cash_account_id = undefined
      is_reseted.value = true
      searchFilter.value.supplier_name = undefined
      context.emit('resetFilter', searchFilter.value)
    }

    return { t, Permissions, resetFilter, search, default_per_page, searchNote, perPage, pagination, keyIncrement, searchFilterPop, popUpTrigger, onOpen, search_filter, resetFilter_popup }
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
              <VControl>
                <VButton v-permission="Permissions.TRANSACTION_CREATE" class="" to="/transaction/supplier-employee-cash-receipt/add" color="primary"> {{
                  t('supplier_cash_receipt.add_supplier_employee_cash_receipts_button') }}
                </VButton>
              </VControl>
            </div>
          </div>
        </div>
      </div>
    </div>
    <SuppliersCashReceiptsSearchFilterModel :key="keyIncrement" :search_filter_popup="searchFilterPop"
      @search_filter_popup="popUpTrigger" @search="search_filter" @resetFilter="resetFilter_popup" />

  </form>
</template>

<style   lang="scss">
@import '/@src/scss/styles/tableHeader.scss';
</style>
