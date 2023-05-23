import { acceptHMRUpdate, defineStore } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { changeAccountStatusApi, generateIncomeStatmentReportApi, getCashierAccountsByAccountIdApi, resetCashAccountsApi } from "/@src/utils/api/Accounting/Account/accounts"

import {
  Account,
  AccountSearchFilter,
  BalanceSheet,
  ChangeAccountStatus,
  CreateAccount,
  TrialBalance,
  UpdateAccountCurrency,
  IncomeStatment,
  ResetCashAccountsData
} from "/@src/models/Accounting/Account/account"
import {
  addAccountApi,
  generateBalanceSheetReportApi,
  generateTrailBalanceReportApi,
  getAccountIdByContactIdApi,
  getAccountsListApi,
  getAllAccountsApi,
  getAuthenticatedCashierAccountsApi,
  updateAccountCurrencyApi
} from "/@src/utils/api/Accounting/Account"
import { defaultPagination, Pagination } from "/@src/utils/response"
import sleep from "/@src/utils/sleep"
import { useStorage } from "@vueuse/core"
import { GetAccountIdByContactIdRequestData } from "/@src/models/Accounting/AccountContact/accountContact"


export const useAccount = defineStore('account', () => {

  const api = useApi()
  const accounts = ref<Account[]>([])
  const cashierAccounts = ref<Account[]>([])
  const accountIdByContactId = ref<number>(0)
  const accountStorage = useStorage('accounts', <Account[]>([]))
  const pagination = ref<Pagination>(defaultPagination)
  const loading = ref(false)
  const success = ref<boolean>()
  const error_code = ref<string>()
  const message = ref<string>()


  async function addAccountStore(account: CreateAccount) {
    if (loading.value) return
    loading.value = true
    sleep(2000)
    try {
      const response = await addAccountApi(api, account)
      var returnedAccount: Account
      returnedAccount = response.response.data
      accounts.value.push(returnedAccount)
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message

      return returnedAccount
    } catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message

    } finally {
      loading.value = false
    }
  }

  async function getAccountsListStore(searchFilter: AccountSearchFilter) {
    if (loading.value) return
    loading.value = true
    try {
      const response = await getAccountsListApi(api, searchFilter)
      accounts.value = response.response.data
      pagination.value = response.response.pagination
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message
      return accounts
    } catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message

    } finally {
      loading.value = false
    }
  }

  async function getAllAccountsStore(searchFilter: AccountSearchFilter) {
    if (loading.value) return
    loading.value = true
    sleep(1000)
    try {
      const response = await getAllAccountsApi(api, searchFilter)
      accounts.value = response.response.data
      accountStorage.value = accounts.value
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message
      // }
      return accounts
    } catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message

    } finally {
      loading.value = false
    }
  }

  async function generateTrailBalanceReportStore() {
    if (loading.value) return
    loading.value = true
    await sleep(1000);
    try {
      const returnedResponse = await generateTrailBalanceReportApi(api)
      success.value = returnedResponse.response.success
      error_code.value = returnedResponse.response.error_code
      message.value = returnedResponse.response.message
      return returnedResponse.response.data as TrialBalance
    } catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message
    } finally {
      loading.value = false
    }
  }

  async function generateBalanceSheetReportStore() {
    if (loading.value) return
    loading.value = true
    await sleep(1000);
    try {
      const returnedResponse = await generateBalanceSheetReportApi(api)
      success.value = returnedResponse.response.success
      error_code.value = returnedResponse.response.error_code
      message.value = returnedResponse.response.message
      return returnedResponse.response.data as BalanceSheet
    } catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message
    } finally {
      loading.value = false
    }
  }
  async function generateIncomeStatmentReportStore() {
    if (loading.value) return
    loading.value = true
    await sleep(1000);
    try {
      const returnedResponse = await generateIncomeStatmentReportApi(api)
      success.value = returnedResponse.response.success
      error_code.value = returnedResponse.response.error_code
      message.value = returnedResponse.response.message
      return returnedResponse.response.data as IncomeStatment
    } catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message
    } finally {
      loading.value = false
    }
  }
  async function updateAccountCurrencyStore(account_id: number, updateAccountCurrencyData: UpdateAccountCurrency) {
    if (loading.value) return
    loading.value = true
    sleep(1000)
    try {
      const response = await updateAccountCurrencyApi(api, account_id, updateAccountCurrencyData)
      var returnedAccount: Account
      returnedAccount = response.response.data
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message

      return returnedAccount
    } catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message

    } finally {
      loading.value = false
    }
  }
  async function changeAccountStatusStore(account: ChangeAccountStatus) {
    if (loading.value) return
    loading.value = true
    try {
      const response = await changeAccountStatusApi(api, account)
      var returnedAccount: Account
      returnedAccount = response.response.data
      accounts.value.splice(
        accounts.value.findIndex((accountElement) => (accountElement.id = account.id)),
        1
      )
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message

      accounts.value.push(returnedAccount)
    } catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message
    }
    finally {
      loading.value = false
    }
  }
  async function getAuthenticatedCashierAccountsStore() {
    if (loading.value) return
    loading.value = true
    try {
      const response = await getAuthenticatedCashierAccountsApi(api)
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message
      cashierAccounts.value = response.response.data
    } catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message
    }
    finally {
      loading.value = false
    }
  }
  async function getAccountIdByContactIdStore(data: GetAccountIdByContactIdRequestData) {
    if (loading.value) return
    loading.value = true
    try {
      const response = await getAccountIdByContactIdApi(api, data)
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message
      accountIdByContactId.value = response.response.data
    } catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message
    }
    finally {
      loading.value = false
    }
  }
  async function getCashierAccountsByAccountIdStore(accountId: number) {
    if (loading.value) return
    loading.value = true
    try {
      const response = await getCashierAccountsByAccountIdApi(api, accountId)
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message
      cashierAccounts.value = response.response.data
    } catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message
    }
    finally {
      loading.value = false
    }
  }
  async function resetCashAccountsStore(data: ResetCashAccountsData) {
    if (loading.value) return
    loading.value = true
    try {
      const response = await resetCashAccountsApi(api, data)
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message
    } catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message
    }
    finally {
      loading.value = false
    }
  }

  return {
    success,
    error_code,
    message,
    accounts,
    pagination,
    loading,
    cashierAccounts,
    accountIdByContactId,
    getAccountsListStore,
    getAllAccountsStore,
    addAccountStore,
    generateTrailBalanceReportStore,
    generateBalanceSheetReportStore,
    generateIncomeStatmentReportStore,
    updateAccountCurrencyStore,
    changeAccountStatusStore,
    getAuthenticatedCashierAccountsStore,
    getAccountIdByContactIdStore,
    getCashierAccountsByAccountIdStore,
    resetCashAccountsStore
  } as const
})

/**
 * Pinia supports Hot Module replacement so you can edit your stores and
 * interact with them directly in your app without reloading the page.
 *
 * @see https://pinia.esm.dev/cookbook/hot-module-replacement.html
 * @see https://vitejs.dev/guide/api-hmr.html
 */
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAccount, import.meta.hot))
}

