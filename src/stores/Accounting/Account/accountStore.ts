
import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { Account, CreateAccount } from "/@src/models/Accounting/Account/account"
import { addAccountApi } from "/@src/utils/api/Accounting/Account"
import { Pagination, defaultPagination } from "/@src/utils/response"
import sleep from "/@src/utils/sleep"


export const useAccount = defineStore('account', () => {

  const api = useApi()
  const accounts = ref<Account[]>([])
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
    }
    catch (error: any) {
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
    addAccountStore,
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

