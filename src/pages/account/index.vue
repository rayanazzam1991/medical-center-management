<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { Notyf } from 'notyf'
import { useI18n } from 'vue-i18n'
import VTag from '/@src/components/base/tags/VTag.vue'
import { useNotyf } from '/@src/composable/useNotyf'
import { Account, AccountConsts, AccountSearchFilter, defaultAccountSearchFilter } from '/@src/models/Accounting/Account/account'
import { getAccountsList } from '/@src/services/Accounting/Account/accountService'
import { useAccount } from '/@src/stores/Accounting/Account/accountStore'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { defaultPagination } from '/@src/utils/response'

const viewWrapper = useViewWrapper()
const { t } = useI18n()
viewWrapper.setPageTitle(t('account.table.title'))
useHead({
  title: t('account.table.title'),
})
const notif = useNotyf() as Notyf
const accountStore = useAccount()
const searchFilter = ref(defaultAccountSearchFilter)
const accountsList = ref<Array<Account>>([])
const paginationVar = ref(defaultPagination)
const keyIncrement = ref(0)
const default_per_page = ref(1)

onMounted(async () => {
  const { accounts, pagination } = await getAccountsList(searchFilter.value)
  accountsList.value = accounts
  paginationVar.value = pagination
  console.log(paginationVar.value)
  keyIncrement.value = keyIncrement.value + 1
  default_per_page.value = pagination.per_page
  console.log(accounts)

});


const search = async (searchFilter2: AccountSearchFilter) => {
  paginationVar.value.per_page = searchFilter2.per_page ?? paginationVar.value.per_page
  const { accounts, pagination } = await getAccountsList(searchFilter2)
  accountsList.value = accounts
  console.log(accountsList.value)
  paginationVar.value = pagination
  searchFilter.value = searchFilter2

}

const resetFilter = async (searchFilter2: AccountSearchFilter) => {
  searchFilter.value = searchFilter2
  await search(searchFilter.value)
}

const getAccountsPerPage = async (pageNum: number) => {
  searchFilter.value.page = pageNum
  await search(searchFilter.value)
}
const accountSort = async (value: string) => {
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

  code: {
    searchable: true,
    sortable: true,
    align: 'center',
    label: t('account.table.columns.code'),
    renderRow: (row: any) =>
      h('span', row.code)
  },
  name: {
    searchable: true,
    sortable: true,
    align: 'center',
    label: t('account.table.columns.name'),
    renderRow: (row: any) =>
      h('span', row.name)
  },
  "chart_of_accounts.parent.name_view": {
    align: 'center',
    label: t('account.table.columns.chart_account_type_level1'),
    renderRow: (row: Account) =>
      h('span', row?.chart_account?.parent?.name)
  },


  "chart_of_accounts.name_view": {
    sortable: true,
    searchable: true,
    align: 'center',
    label: t('account.table.columns.chart_account_type_level2'),
    renderRow: (row: any) =>
      h('span', row?.chart_account?.name)
  },
  "chart_of_accounts.account_type": {
    sortable: true,
    searchable: true,
    align: 'center',
    label: t('account.table.columns.chart_account_type'),
    renderRow: (row: Account) =>
      h('span', AccountConsts.getAccountTypeName(row?.chart_account?.account_type))
  },
  balance: {
    searchable: true,
    sortable: true,
    align: 'center',
    label: t('account.table.columns.balance'),
    renderRow: (row: any) =>
      h('span', row.balance)
  },
  "currencies.code": {
    align: 'center',
    label: t('account.table.columns.currency_rate'),
    renderRow: (row: Account) =>
      h('span', row.currency?.name)
  },
  currency_rate: {
    searchable: true,
    sortable: true,
    align: 'center',
    label: t('account.table.columns.currency_rate'),
    renderRow: (row: any) =>
      h('span', row.currency_rate)
  },
  status: {
    align: 'center',
    label: t("account.table.columns.status"),

    renderRow: (row: any) =>
      h(
        VTag,
        {
          rounded: true,
          color:
            row?.status === AccountConsts.INACTIVE
              ? 'danger'
              : row?.status === AccountConsts.ACTIVE
                ? 'success'
                : undefined,
        },
        {
          default() {
            return AccountConsts.getAccountStatusName(row?.status)
          },
        }
      ),

  },
  created_at: {
    searchable: true,
    sortable: true,
    align: 'center',
    label: t('account.table.columns.created_at'),
    renderRow: (row: any) =>
      h('span', row.created_at)
  },


} as const
</script>

<template>
  <AccountTableHeader :key="keyIncrement" :title="viewWrapper.pageTitle" :button_name="t('account.header_button')"
    @search="search" :pagination="paginationVar" :default_per_page="default_per_page" @resetFilter="resetFilter" />

  <VFlexTableWrapper :columns="columns" :data="accountsList" @update:sort="accountSort">

    <VFlexTable separators clickable>
      <template #body>
        <div v-if="accountStore?.loading" class="flex-list-inner">
          <div v-for="key in paginationVar.per_page" :key="key" class="flex-table-item">
            <VFlexTableCell>
              <VPlaceload />
            </VFlexTableCell>
          </div>
        </div>
        <div v-else-if="accountsList.length === 0" class="flex-list-inner">
          <VPlaceholderSection :title="t('tables.placeholder.title')" :subtitle="t('tables.placeholder.subtitle')"
            class="my-6">
          </VPlaceholderSection>
        </div>

      </template>
    </VFlexTable>

    <VFlexPagination v-if="(accountsList.length != 0 && paginationVar.max_page != 1)" :current-page="paginationVar.page"
      class="mt-6" :item-per-page="paginationVar.per_page" :total-items="paginationVar.total" :max-links-displayed="3"
      no-router @update:current-page="getAccountsPerPage" />
    <h6 class="pt-2 is-size-7" v-if="accountsList.length != 0 && !accountStore?.loading">
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
    <VPlaceloadText v-if="accountStore?.loading" :lines="1" last-line-width="20%" class="mx-2" />

  </VFlexTableWrapper>
</template>

