<script setup lang="ts">import { useHead } from '@vueuse/head';
import { Notyf } from 'notyf';
import { useI18n } from 'vue-i18n';
import VTag from '/@src/components/base/tags/VTag.vue';
import EditDropDown from '/@src/components/OurComponents/EditDropDown.vue';
import NoViewDropDown from '/@src/components/OurComponents/NoViewDropDown.vue';
import { useNotyf } from '/@src/composable/useNotyf';
import { defaultVariablePaymentSearchFilter, VariablePayment, VariablePaymentSearchFilter, VariablePaymentConsts } from '/@src/models/HR/Payroll/VariablePayment/variablePayment';
import { getVariablePaymentsList } from '/@src/services/HR/Payroll/VariablePayment/variablePaymentService';
import { useVariablePayment } from '/@src/stores/HR/Payoll/VariablePayment/variablePaymentStore';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { defaultPagination } from '/@src/utils/response';


const viewWrapper = useViewWrapper()
const { t } = useI18n()
viewWrapper.setPageTitle(t('variable_payment.table.title'))
useHead({
  title: t('variable_payment.table.title'),
})
const notif = useNotyf() as Notyf
const variablePaymentStore = useVariablePayment()
const searchFilter = ref(defaultVariablePaymentSearchFilter)
const variablePaymentsList = ref<Array<VariablePayment>>([])
const paginationVar = ref(defaultPagination)
const keyIncrement = ref(0)
const router = useRouter()
const default_per_page = ref(1)
onMounted(async () => {
  const { variablePayments, pagination } = await getVariablePaymentsList(searchFilter.value)
  variablePaymentsList.value = variablePayments
  paginationVar.value = pagination
  keyIncrement.value = keyIncrement.value + 1
  default_per_page.value = pagination.per_page

});

const search = async (newSearchFilter: VariablePaymentSearchFilter) => {
  paginationVar.value.per_page = newSearchFilter.per_page ?? paginationVar.value.per_page
  const { variablePayments, pagination } = await getVariablePaymentsList(newSearchFilter)
  variablePaymentsList.value = variablePayments
  paginationVar.value = pagination
  searchFilter.value = newSearchFilter
}

const resetFilter = async (newSearchFilter: VariablePaymentSearchFilter) => {
  searchFilter.value = newSearchFilter
  search(searchFilter.value)
}

const getVariablePaymentsPerPage = async (pageNum: number) => {

  searchFilter.value.page = pageNum
  search(searchFilter.value)
}
const variablePaymentsSort = async (value: string) => {
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
  id: {
    align: 'center',
    sortable: true,
    label: t("variable_payment.table.columns.id")

  },
  name: {
    align: 'center',
    sortable: true,
    label: t("variable_payment.table.columns.name")
  },
  type: {
    align: 'center',
    label: t("variable_payment.table.columns.type"),

    renderRow: (row: any) =>
      h(
        VTag,
        {
          rounded: true,
          color:
            row?.type === VariablePaymentConsts.DECREMENT_TYPE
              ? 'danger'
              : row?.type === VariablePaymentConsts.INCREMENT_TYPE
                ? 'success'
                : undefined,
        },
        {
          default() {
            return VariablePaymentConsts.getTypeName(row?.type)
          },
        }
      ),

  },

  status: {
    align: 'center',
    label: t("variable_payment.table.columns.status"),

    renderRow: (row: any) =>
      h(
        VTag,
        {
          rounded: true,
          color:
            row?.status === VariablePaymentConsts.INACTIVE
              ? 'danger'
              : row?.status === VariablePaymentConsts.ACTIVE
                ? 'success'
                : undefined,
        },
        {
          default() {
            return VariablePaymentConsts.showStatusName(row?.status)
          },
        }
      ),

  },
  actions: {
    align: 'center',
    label: t("variable_payment.table.columns.actions"),
    renderRow: (row: any) =>
      h(EditDropDown, {

        onEdit: () => {
          router.push({ path: `/variable-payment/${row?.id}/edit` })
        },

      }),

  },
} as const
</script>

<template>
  <VariablePaymentTableHeader :key="keyIncrement" :title="viewWrapper.pageTitle" :button_name="t('variable_payment.header_button')" 
    @search="search" :pagination="paginationVar" :default_per_page="default_per_page" @resetFilter="resetFilter" />


  <VFlexTableWrapper :columns="columns" :data="variablePaymentsList" @update:sort="variablePaymentsSort">

    <VFlexTable separators clickable>
      <template #body>
        <div v-if="variablePaymentStore?.loading" class="flex-list-inner">
          <div v-for="key in paginationVar.per_page" :key="key" class="flex-table-item">
            <VFlexTableCell>
              <VPlaceload />
            </VFlexTableCell>
          </div>
        </div>
        <div v-else-if="variablePaymentsList.length === 0" class="flex-list-inner">
          <VPlaceholderSection :title="t('tables.placeholder.title')" :subtitle="t('tables.placeholder.subtitle')"
            class="my-6">
          </VPlaceholderSection>
        </div>
      </template>
    </VFlexTable>
    <VFlexPagination v-if="(variablePaymentsList.length != 0 && paginationVar.max_page != 1)" :current-page="paginationVar.page"
      class="mt-6" :item-per-page="paginationVar.per_page" :total-items="paginationVar.total" :max-links-displayed="3"
      no-router @update:current-page="getVariablePaymentsPerPage" />
    <h6 v-if="variablePaymentsList.length != 0 && !variablePaymentStore?.loading">
      {{
        t('tables.pagination_footer', { from_number: paginationVar.page !=
          paginationVar.max_page
          ?
          (1 + ((paginationVar.page - 1) * paginationVar.count)) : paginationVar.page == paginationVar.max_page ? (1 +
            ((paginationVar.page - 1) * paginationVar.per_page)) : paginationVar.page == 1 ? 1 : paginationVar.total
        , to_number: paginationVar.page !=
          paginationVar.max_page ?
          paginationVar.page *
          paginationVar.per_page : paginationVar.total, all_number: paginationVar.total
      })}}</h6>
    <VPlaceloadText v-if="variablePaymentStore?.loading" :lines="1" last-line-width="20%" class="mx-2" />
  </VFlexTableWrapper>
</template>

