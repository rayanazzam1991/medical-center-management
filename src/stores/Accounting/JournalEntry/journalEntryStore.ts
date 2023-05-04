import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { JournalEntrySearchFilter } from "/@src/models/Accounting/JournalEntry/journalEntry";
import { getJournalEntriesByContactApi } from "/@src/utils/api/Accounting/JournalEntry";
import { Pagination, defaultPagination } from "/@src/utils/response"


export const useJournalEntry = defineStore('journalEntry', () => {
  const api = useApi()
  const loading = ref(false)
  const success = ref<boolean>()
  const error_code = ref<string>()
  const message = ref<string>()
  const pagination = ref<Pagination>(defaultPagination)


  async function getJournalEntriesByContactStore(contactId: number | undefined, searchFilter: JournalEntrySearchFilter) {
    if (loading.value) return
    if (!contactId) return
    loading.value = true

    try {
      const returnedResponse = await getJournalEntriesByContactApi(api, contactId, searchFilter)
      pagination.value = returnedResponse.response.pagination
      success.value = returnedResponse.response.success
      error_code.value = returnedResponse.response.error_code
      message.value = returnedResponse.response.message
      return returnedResponse.response.data


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
    loading,
    pagination,
    getJournalEntriesByContactStore,
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
  import.meta.hot.accept(acceptHMRUpdate(useJournalEntry, import.meta.hot))
}
