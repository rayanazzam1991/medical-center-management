import { AxiosInstance } from "axios"
import { JournalEntrySearchFilter } from "/@src/models/Accounting/JournalEntry/journalEntry"
import { CustomResponseCollection, CustomResponseSingle } from "/@src/utils/response"

export async function getJournalEntriesByContactApi(
    api: AxiosInstance,
    contact_id: number,
    searchFilter: JournalEntrySearchFilter
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.get(`journalEntry/getJournalEntriesByContact/${contact_id}`, { params: searchFilter })
    return { response }
}

