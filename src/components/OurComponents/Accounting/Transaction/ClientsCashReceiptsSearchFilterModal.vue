<script lang="ts">
import { useI18n } from "vue-i18n"
import { defaultClientsCashReceiptsSearchFilter } from "/@src/models/Accounting/Transaction/record"
import { Currency } from "/@src/models/Accounting/Currency/currency"
import { getCurrenciesFromStorage } from "/@src/services/Accounting/Currency/currencyService"
import { Account, AccountSearchFilter, AccountConsts } from "/@src/models/Accounting/Account/account"
import { getAccountsList, getAuthenticatedCashierAccounts } from "/@src/services/Accounting/Account/accountService"
import { useAuth } from "/@src/stores/Others/User/authStore"

export default defineComponent({
  props: {
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
    const searchNote = ref()
    const searchClientName = ref()
    const searchCurrencyId = ref()
    const searchCashAccountId = ref()
    const searchFilter = ref(defaultClientsCashReceiptsSearchFilter)
    const userAuth = useAuth();
    const haveCashierRole = userAuth.getUser()?.roles?.find((role) => role.name == 'Cashier')
    const isCashier = haveCashierRole ? true : false

    let search_filter_popup = computed({
      get: () => props.search_filter_popup as boolean,
      set(value) {
        value = false
        context.emit('search_filter_popup', value)

      },
    })
    const search = () => {
      searchFilter.value = {
        note: searchNote.value,
        currency_id: searchCurrencyId.value,
        cash_account_id: searchCashAccountId.value,
        client_name: searchClientName.value,
      }
      searchFilter.value.isOnDay = true
      context.emit('search', searchFilter.value)
      search_filter_popup.value = false
    }
    const resetFilter = () => {
      searchNote.value = undefined
      searchCurrencyId.value = undefined
      searchCashAccountId.value = undefined
      searchClientName.value = undefined
      searchFilter.value.note = undefined
      searchFilter.value.currency_id = undefined
      searchFilter.value.cash_account_id = undefined
      searchFilter.value.client_name = undefined
      searchFilter.value.isOnDay = true
      context.emit('resetFilter', searchFilter.value)
    }
    const currenciesList = ref<Currency[]>([])
    const cashAccountsList = ref<Account[]>([])
    onMounted(async () => {
      const currencies = getCurrenciesFromStorage()
      currenciesList.value = currencies
      if (!isCashier) {
        const accountSearchFilter = {
          per_page: 500
        } as AccountSearchFilter
        const { accounts } = await getAccountsList(accountSearchFilter)
        accounts.forEach((account) => {
          if (account.chart_account?.code == AccountConsts.CASH_CODE) {
            cashAccountsList.value.push(account)
          }
        });
      } else {
        if (isCashier) {
          const { cashierAccounts } = await getAuthenticatedCashierAccounts()
          cashAccountsList.value = cashierAccounts
        }

      }

    })
    return { t, search, resetFilter, search_filter_popup, cashAccountsList, currenciesList, searchNote, searchCurrencyId, searchClientName, searchCashAccountId }
  },
})




</script>

<template>
  <VModal :title="t('customer_cash_receipt.search_filter.title')" :open="search_filter_popup" actions="center"
    @close="search_filter_popup = false">
    <template #content>
      <form class="form-layout" @submit.prevent="">
        <VField class="column filter">
          <VControl icon="feather:search">
            <input v-model="searchNote" type="text" class="input "
              :placeholder="t('customer_cash_receipt.search_filter.note')" />
          </VControl>
        </VField>
        <VField v-if="!$props.is_for_customer" class="column filter">
          <VControl icon="feather:search">
            <input v-model="searchClientName" type="text" class="input"
              :placeholder="t('customer_cash_receipt.search_filter.client_name')" />
          </VControl>
        </VField>
        <VField class="column filter">
          <VControl>
            <VSelect v-model="searchCurrencyId" class="">
              <VOption value="">{{ t('customer_cash_receipt.search_filter.currency_id') }}</VOption>
              <VOption v-for="currency in currenciesList" :key="currency.id" :value="currency.id">
                {{ currency.code }} - {{ currency.name }}
              </VOption>
            </VSelect>
          </VControl>
        </VField>
        <VField class="column filter">
          <VControl>
            <VSelect v-model="searchCashAccountId" class="">
              <VOption value="">{{ t('customer_cash_receipt.search_filter.cash_account_id') }}</VOption>
              <VOption v-for="account in cashAccountsList" :key="account.id" :value="account.id">
                {{ account.code }} - {{ account.name }}
              </VOption>
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

