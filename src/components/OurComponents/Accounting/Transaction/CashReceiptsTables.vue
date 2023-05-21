

<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { Notyf } from 'notyf';
import { useI18n } from 'vue-i18n';
import { stringTrim } from '/@src/composable/helpers/stringHelpers';
import { useNotyf } from '/@src/composable/useNotyf';
import { AccountConsts } from '/@src/models/Accounting/Account/account';
import { defaultClientsCashReceiptsSearchFilter, Transaction, ClientsCashReceiptsSearchFilter, defaultTransaction } from '/@src/models/Accounting/Transaction/record';
import { getClientsCashReceiptsList, resetClientsCashReceiptsSearchFilter } from '/@src/services/Accounting/Transaction/transactionService';
import { useTransaction } from '/@src/stores/Accounting/Transaction/transactionStore';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { Permissions } from '/@src/utils/consts/rolesPermissions';
import { defaultPagination } from '/@src/utils/response';
import PrintDropDown from '/@src/components/OurComponents/PrintComponents/PrintDropDown.vue'
import usePrint from '/@src/composable/usePrint';
import sleep from '/@src/utils/sleep';
import { ref, onMounted, h } from 'vue';
import SupplierEmployeeCashReceiptPrint from '/@src/components/OurComponents/PrintComponents/SupplierEmployeeCashReceiptPrint.vue';
import { defaultSuppliersCashReceiptsSearchFilter, SuppliersCashReceiptsSearchFilter } from '/@src/models/Accounting/Transaction/record';
import { getSuppliersCashReceiptsList, resetEmployeeSuppliersCashReceiptsSearchFilter } from '/@src/services/Accounting/Transaction/transactionService';

import { boolean } from 'zod';
import usePrint8CM from '/@src/composable/usePrint8CM';
import ReceiptsDropDown from './ReceiptsDropDown.vue';

export interface ClientsSuppliersEmployeesCashReceiptsTableProps {
  isForCustomer: boolean,
  customerId: number | undefined,
  isForEmployee: boolean,
  employeeId: number | undefined,
  withTitle: boolean,
  is_for_show: boolean,
  is_on_day: boolean
}
const props = withDefaults(defineProps<ClientsSuppliersEmployeesCashReceiptsTableProps>(), {
  isForCustomer: false,
  customerId: undefined,
  isForEmployee: false,
  employeeId: undefined,
  withTitle: false,
  is_for_show: true,
  is_on_day: false
})

const { t } = useI18n()
const viewWrapper = useViewWrapper()
const notif = useNotyf() as Notyf
const clientsSearchFilter = ref(resetClientsCashReceiptsSearchFilter())
const suppliersSearchFilter = ref(resetEmployeeSuppliersCashReceiptsSearchFilter())
if (props.isForCustomer && props.customerId) {
  clientsSearchFilter.value.customer_id = props.customerId
}
const supplierSearchFilter = ref(resetEmployeeSuppliersCashReceiptsSearchFilter())
if (props.isForEmployee && props.employeeId) {
  supplierSearchFilter.value.employee_id = props.employeeId
}



const clientsCashReceiptsList = ref<Array<Transaction>>([])
const suppliersCashReceiptsList = ref<Array<Transaction>>([])

const clientsaginationVar = ref(defaultPagination)
const suppliersPaginationVar = ref(defaultPagination)
const router = useRouter()
const transactionStore = useTransaction()
const clientsKeyIncrement = ref(0)
const clients_default_per_page = ref(1)
const suppliersKeyIncrement = ref(0)
const suppliers_default_per_page = ref(1)
const selectedReceiptForPrint = ref(defaultTransaction)
const selectedClientReceiptsForDetails = ref(defaultTransaction)
const selectedSupplierEmployeeReceiptsForDetails = ref(defaultTransaction)
const clientReceiptDetailsPopup = ref(false)
const supplierEmployeeReceiptDetailsPopup = ref(false)
const keyIncrementClientDetailsModal = ref(0)
const keyIncrementSupplierEmployeeDetailsModal = ref(0)
onMounted(async () => {
  if (props.is_on_day == true) {
    clientsSearchFilter.value.isOnDay = true
    suppliersSearchFilter.value.isOnDay = true
  }
  const { clients_cash_receipts, clientsPagination } = await getClientsCashReceiptsList(clientsSearchFilter.value)
  clientsCashReceiptsList.value = clients_cash_receipts

  const { suppliers_cash_receipts, suppliersPagination } = await getSuppliersCashReceiptsList(suppliersSearchFilter.value)
  suppliersCashReceiptsList.value = suppliers_cash_receipts

  clientsaginationVar.value = clientsPagination
  clientsKeyIncrement.value = clientsKeyIncrement.value + 1
  clients_default_per_page.value = clientsPagination.per_page

  suppliersPaginationVar.value = clientsPagination
  suppliersKeyIncrement.value = suppliersKeyIncrement.value + 1
  suppliers_default_per_page.value = clientsPagination.per_page
});

const { printDiv8CM } = usePrint8CM('');
const clientsPrint = async () => {
  await sleep(500)
  printDiv8CM('printerable', t('customer_cash_receipt.table.print_title'))
}
const clientsSearch = async (newSearchFilter: ClientsCashReceiptsSearchFilter) => {
  clientsaginationVar.value.per_page = newSearchFilter.per_page ?? clientsaginationVar.value.per_page
  if (props.isForCustomer && props.customerId) {
    newSearchFilter.customer_id = props.customerId
  }
  if (props.is_on_day == true) {
    newSearchFilter.isOnDay = true
  } else {
    newSearchFilter.isOnDay = Number(false)
  }

  const { clients_cash_receipts, clientsPagination } = await getClientsCashReceiptsList(newSearchFilter)
  clientsCashReceiptsList.value = clients_cash_receipts
  clientsaginationVar.value = clientsPagination
  clientsSearchFilter.value = newSearchFilter
}

const clientsResetFilter = async (newSearchFilter: ClientsCashReceiptsSearchFilter) => {
  if (props.isForCustomer && props.customerId) {
    newSearchFilter.customer_id = props.customerId
  }
  if (props.is_on_day == true) {
    newSearchFilter.isOnDay = true
  }

  clientsSearchFilter.value = newSearchFilter
  await clientsSearch(clientsSearchFilter.value)
}

const getClientsReceiptsPerPage = async (pageNum: number) => {
  clientsSearchFilter.value.page = pageNum
  await clientsSearch(clientsSearchFilter.value)
}

const clientReceiptSort = async (value: string) => {
  if (value != undefined) {
    const [sortField, sortOrder] = value.split(':') as [string, 'desc' | 'asc']
    clientsSearchFilter.value.order_by = sortField
    clientsSearchFilter.value.order = sortOrder
  }
  else {
    clientsSearchFilter.value.order = undefined
    clientsSearchFilter.value.order_by = undefined
  }
  await clientsSearch(clientsSearchFilter.value)

}
const clientPopUpTrigger = (value: boolean) => {
  clientReceiptDetailsPopup.value = value
}

const clientsColumns = {
  client_name: {
    align: 'center',
    label: t('customer_cash_receipt.table.columns.client_name'),
    renderRow: (row: Transaction) =>
      h('span', row.entries.find((entry) => entry.account.chart_account?.code == AccountConsts.CLIENTS_CODE)?.account.name),
    grow: true,
  },
  amount: {
    align: 'center',
    label: t('customer_cash_receipt.table.columns.amount'),
    renderRow: (row: Transaction) =>
      h('span', row.amount),
  },
  note: {
    align: 'center',
    label: t('customer_cash_receipt.table.columns.note'),
    renderRow: (row: Transaction) =>
      h('span', {
        innerHTML: row.note ?
          `<div class="tooltip">${stringTrim(row.note, 10)}<div class="tooltiptext"><p class="text-white">${row.note}</p></div></div>` : '-',

      }),
  },
  date: {
    align: 'center',
    label: t('customer_cash_receipt.table.columns.action_date'),
    renderRow: (row: Transaction) =>
      h('span', row.date ?? '-'),
    sortable: true
  },
  created_at: {
    align: 'center',
    label: t('customer_cash_receipt.table.columns.created_at'),
    renderRow: (row: Transaction) =>
      h('span', row.created_at ?? '-'),
    sortable: true
  },
  created_by: {
    align: 'center',
    label: t('customer_cash_receipt.table.columns.created_by'),
    renderRow: (row: Transaction) =>
      h('span', row.created_by ? (row.created_by?.first_name + ' ' + row.created_by?.last_name) : '-'),
  },
  actions: {
    align: 'center',
    label: t('customer_cash_receipt.table.columns.actions'),
    renderRow: (row: Transaction) =>
      h(ReceiptsDropDown, {
        printPermission: Permissions.CLIENT_CASH_RECEIPT_SHOW,
        detailsPermission: Permissions.CLIENT_CASH_RECEIPT_SHOW,
        onPrint: async () => {
          selectedReceiptForPrint.value = row
          clientsKeyIncrement.value++
          await clientsPrint()
        },
        onShow: async () => {
          selectedClientReceiptsForDetails.value = row
          clientReceiptDetailsPopup.value = !clientReceiptDetailsPopup.value
          keyIncrementClientDetailsModal.value++
        },
      }),
  },

} as const

const suppliersPrint = async () => {
  await sleep(500)
  printDiv8CM('printerable_supplier', t('supplier_cash_receipt.table.print_title'))
}

const suppliersSearch = async (newSearchFilter: SuppliersCashReceiptsSearchFilter) => {
  suppliersPaginationVar.value.per_page = newSearchFilter.per_page ?? suppliersPaginationVar.value.per_page
  if (props.isForEmployee && props.employeeId) {
    newSearchFilter.employee_id = props.employeeId
  }
  if (props.is_on_day == true) {
    newSearchFilter.isOnDay = true
  } else {
    newSearchFilter.isOnDay = Number(false)
  }

  const { suppliers_cash_receipts, suppliersPagination } = await getSuppliersCashReceiptsList(newSearchFilter)
  suppliersCashReceiptsList.value = suppliers_cash_receipts
  suppliersPaginationVar.value = suppliersPagination
  suppliersSearchFilter.value = newSearchFilter
}

const suppliersResetFilter = async (newSearchFilter: SuppliersCashReceiptsSearchFilter) => {
  if (props.isForEmployee && props.employeeId) {
    newSearchFilter.employee_id = props.employeeId
  }
  if (props.is_on_day == true) {
    newSearchFilter.isOnDay = true
  }
  suppliersSearchFilter.value = newSearchFilter
  await suppliersSearch(suppliersSearchFilter.value)
}

const getSuppliersReceiptsPerPage = async (pageNum: number) => {
  suppliersSearchFilter.value.page = pageNum
  await suppliersSearch(suppliersSearchFilter.value)
}

const suppliersReceiptSort = async (value: string) => {
  if (value != undefined) {
    const [sortField, sortOrder] = value.split(':') as [string, 'desc' | 'asc']
    suppliersSearchFilter.value.order_by = sortField
    suppliersSearchFilter.value.order = sortOrder
  }
  else {
    suppliersSearchFilter.value.order = undefined
    suppliersSearchFilter.value.order_by = undefined
  }
  await suppliersSearch(suppliersSearchFilter.value)

}
const supplierEmployeePopUpTrigger = (value: boolean) => {
  supplierEmployeeReceiptDetailsPopup.value = value
}

const suppliersColumns = {
  name: {
    align: 'center',
    label: t('supplier_cash_receipt.table.columns.name'),
    renderRow: (row: Transaction) =>
      h('span', row.entries.find((entry) => entry.account.chart_account?.code == AccountConsts.SUPPLIER_CODE || entry.account.chart_account?.code == AccountConsts.EMPLOYEE_CODE)?.account.name),
    grow: true,
  },
  type: {
    align: 'center',
    label: t('supplier_cash_receipt.table.columns.type.title'),
    renderRow: (row: Transaction) =>
      h('span', row.entries.find((entry) => entry.account.chart_account?.code == AccountConsts.SUPPLIER_CODE || entry.account.chart_account?.code == AccountConsts.EMPLOYEE_CODE)?.account.chart_account?.code == AccountConsts.EMPLOYEE_CODE ? t('supplier_cash_receipt.table.columns.type.employee') : t('supplier_cash_receipt.table.columns.type.supplier')),
  },
  amount: {
    align: 'center',
    label: t('customer_cash_receipt.table.columns.amount'),
    renderRow: (row: Transaction) =>
      h('span', row.amount),
  },
  note: {
    align: 'center',
    label: t('customer_cash_receipt.table.columns.note'),
    renderRow: (row: Transaction) =>
      h('span', {
        innerHTML: row.note ?
          `<div class="tooltip">${stringTrim(row.note, 10)}<div class="tooltiptext"><p class="text-white">${row.note}</p></div></div>` : '-',

      }),
  },
  date: {
    align: 'center',
    label: t('customer_cash_receipt.table.columns.action_date'),
    renderRow: (row: Transaction) =>
      h('span', row.date ?? '-'),
    sortable: true
  },
  created_at: {
    align: 'center',
    label: t('customer_cash_receipt.table.columns.created_at'),
    renderRow: (row: Transaction) =>
      h('span', row.created_at ?? '-'),
    sortable: true
  },
  created_by: {
    align: 'center',
    label: t('customer_cash_receipt.table.columns.created_by'),
    renderRow: (row: Transaction) =>
      h('span', row.created_by ? (row.created_by?.first_name + ' ' + row.created_by?.last_name) : '-'),
  },
  actions: {
    align: 'center',
    label: t('customer_cash_receipt.table.columns.actions'),
    renderRow: (row: Transaction) =>
      h(ReceiptsDropDown, {
        printPermission: Permissions.SUPPLIER_EMPLOYEE_CASH_RECEIPT_SHOW,
        detailsPermission: Permissions.SUPPLIER_EMPLOYEE_CASH_RECEIPT_SHOW,
        onPrint: async () => {
          selectedReceiptForPrint.value = row
          suppliersKeyIncrement.value++
          await suppliersPrint()
        },
        onShow: async () => {
          selectedSupplierEmployeeReceiptsForDetails.value = row
          supplierEmployeeReceiptDetailsPopup.value = !supplierEmployeeReceiptDetailsPopup.value
          keyIncrementSupplierEmployeeDetailsModal.value++
        },
      }),
  },

} as const
</script>

<template>
  <ClientsCashReceiptsTableHeader :is_on_day="$props.is_on_day" :with_title="$props.withTitle"
    :is_for_customer="props.isForCustomer" :is_for_show="$props.is_for_show" :key="clientsKeyIncrement"
    :title="viewWrapper.pageTitle" @search="clientsSearch" :pagination="clientsaginationVar"
    :default_per_page="suppliers_default_per_page" @resetFilter="clientsResetFilter" />
  <VFlexTableWrapper :columns="clientsColumns" :data="clientsCashReceiptsList" :limit="clientsSearchFilter.per_page"
    @update:sort="clientReceiptSort">
    <VFlexTable separators clickable>
      <template #body>
        <div v-if="transactionStore?.loading" class="flex-list-inner">
          <div v-for="key in clientsaginationVar.per_page" :key="key" class="flex-table-item">
            <VFlexTableCell>
              <VPlaceload />
            </VFlexTableCell>
          </div>
        </div>
        <div v-else-if="clientsCashReceiptsList.length === 0" class="flex-list-inner">
          <VPlaceholderSection :title="t('tables.placeholder.title')" :subtitle="t('tables.placeholder.subtitle')"
            class="my-6">
          </VPlaceholderSection>
        </div>
      </template>
    </VFlexTable>
    <VFlexPagination v-if="(clientsCashReceiptsList.length != 0 && clientsaginationVar.max_page != 1)"
      :current-page="clientsaginationVar.page" class="mt-6" :item-per-page="clientsaginationVar.per_page"
      :total-items="clientsaginationVar.total" :max-links-displayed="3" no-router
      @update:current-page="getClientsReceiptsPerPage" />
    <h6 class="pt-2 is-size-7" v-if="clientsCashReceiptsList.length != 0 && !transactionStore?.loading">
      {{
        t('tables.pagination_footer', {
          from_number: clientsaginationVar.page !=
            clientsaginationVar.max_page
            ?
            (1 + ((clientsaginationVar.page - 1) * clientsaginationVar.count)) : clientsaginationVar.page ==
              clientsaginationVar.max_page ? (1 +
                ((clientsaginationVar.page - 1) * clientsaginationVar.per_page)) : clientsaginationVar.page == 1 ? 1 :
              clientsaginationVar.total
          , to_number: clientsaginationVar.page !=
            clientsaginationVar.max_page ?
            clientsaginationVar.page *
            clientsaginationVar.per_page : clientsaginationVar.total, all_number: clientsaginationVar.total
        }) }}</h6>
    <VPlaceloadText v-if="transactionStore?.loading" :lines="1" last-line-width="20%" class="mx-2" />
  </VFlexTableWrapper>
  <ClientsCashReceiptsDetailsModal :key="keyIncrementClientDetailsModal" :openModal="clientReceiptDetailsPopup"
    @openModal="clientPopUpTrigger" :receipt="selectedClientReceiptsForDetails" />

  <CustomerCashReceiptPrint :key="clientsKeyIncrement" :customer-cash-receipt="selectedReceiptForPrint" />


  <br>
  <SuppliersCashReceiptsTableHeader :is_on_day="$props.is_on_day" :is_for_show="$props.is_for_show"
    :with_title="$props.withTitle" :key="suppliersKeyIncrement" :title="viewWrapper.pageTitle" @search="suppliersSearch"
    :pagination="suppliersPaginationVar" :default_per_page="suppliers_default_per_page"
    @resetFilter="suppliersResetFilter" />
  <VFlexTableWrapper :columns="suppliersColumns" :data="suppliersCashReceiptsList" :limit="suppliersSearchFilter.per_page"
    @update:sort="suppliersReceiptSort">
    <VFlexTable separators clickable>
      <template #body>
        <div v-if="transactionStore?.loading" class="flex-list-inner">
          <div v-for="key in suppliersPaginationVar.per_page" :key="key" class="flex-table-item">
            <VFlexTableCell>
              <VPlaceload />
            </VFlexTableCell>
          </div>
        </div>
        <div v-else-if="suppliersCashReceiptsList.length === 0" class="flex-list-inner">
          <VPlaceholderSection :title="t('tables.placeholder.title')" :subtitle="t('tables.placeholder.subtitle')"
            class="my-6">
          </VPlaceholderSection>
        </div>
      </template>
    </VFlexTable>
    <VFlexPagination v-if="(suppliersCashReceiptsList.length != 0 && suppliersPaginationVar.max_page != 1)"
      :current-page="suppliersPaginationVar.page" class="mt-6" :item-per-page="suppliersPaginationVar.per_page"
      :total-items="suppliersPaginationVar.total" :max-links-displayed="3" no-router
      @update:current-page="getSuppliersReceiptsPerPage" />
    <h6 class="pt-2 is-size-7" v-if="suppliersCashReceiptsList.length != 0 && !transactionStore?.loading">
      {{
        t('tables.pagination_footer', {
          from_number: suppliersPaginationVar.page !=
            suppliersPaginationVar.max_page
            ?
            (1 + ((suppliersPaginationVar.page - 1) * suppliersPaginationVar.count)) : suppliersPaginationVar.page ==
              suppliersPaginationVar.max_page ? (1 +
                ((suppliersPaginationVar.page - 1) * suppliersPaginationVar.per_page)) : suppliersPaginationVar.page == 1 ? 1 :
              suppliersPaginationVar.total
          , to_number: suppliersPaginationVar.page !=
            suppliersPaginationVar.max_page ?
            suppliersPaginationVar.page *
            suppliersPaginationVar.per_page : suppliersPaginationVar.total, all_number: suppliersPaginationVar.total
        }) }}</h6>
    <VPlaceloadText v-if="transactionStore?.loading" :lines="1" last-line-width="20%" class="mx-2" />
  </VFlexTableWrapper>
  <ClientsCashReceiptsDetailsModal :key="keyIncrementSupplierEmployeeDetailsModal"
    :openModal="supplierEmployeeReceiptDetailsPopup" @openModal="supplierEmployeePopUpTrigger"
    :receipt="selectedSupplierEmployeeReceiptsForDetails" />

  <SupplierEmployeeCashReceiptPrint :key="suppliersKeyIncrement" :cash-receipt="selectedReceiptForPrint" />
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
