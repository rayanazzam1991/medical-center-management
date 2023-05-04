import { defaultPagination, Pagination } from "/@src/utils/response";
import { defaultJournalEntriesByAccount, JournalEntriesByAccount, JournalEntry, JournalEntrySearchFilter } from "/@src/models/Accounting/JournalEntry/journalEntry";
import { useJournalEntry } from "/@src/stores/Accounting/JournalEntry/journalEntryStore";



export async function getJournalEntriesByContact(contactId: number | undefined, searchFilter: JournalEntrySearchFilter) {
    const response = useJournalEntry()
    let journal_entries: JournalEntriesByAccount = await response.getJournalEntriesByContactStore(contactId, searchFilter) ?? defaultJournalEntriesByAccount
    let success: boolean = response.success ?? false
    let error_code: string = response.error_code ?? ''
    let pagination: Pagination = response.pagination ?? defaultPagination
    let message: string = response.message ?? ''
    return { success, error_code, message, journal_entries, pagination }

}
export function resetJournalEntrySearchFilter() {
    const blankSearchFilter: JournalEntrySearchFilter = {
        order: undefined,
        order_by: undefined,
        page: undefined,
        per_page: undefined,
        account_id: undefined,
        model_type: "Customer"
    }

    return blankSearchFilter

}
