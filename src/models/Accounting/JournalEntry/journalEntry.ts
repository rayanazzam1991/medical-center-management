import { Account, AccountConsts, defaultAccount } from "../Account/account"
import { Currency, defaultCurrency } from "../Currency/currency"

export interface JournalEntry {
    id: number
    account_type: number
    amount: string
    account: Account
    currency: Currency
    currency_rate: number
    description?: string
    created_at: string
}
export interface JournalEntryByAccount {
    id: number
    account_type: number
    amount: string
    currency: Currency
    currency_rate: number
    created_at: string
    type?: string
}
export interface JournalEntriesByAccount {
    account: Account
    movements: JournalEntryByAccount[]
}
export const defaultJournalEntry: JournalEntry = {
    id: 0,
    account_type: AccountConsts.CREDIT_TYPE,
    amount: "0.00",
    account: defaultAccount,
    currency: defaultCurrency,
    currency_rate: 1,
    description: undefined,
    created_at: "",
}
export const defaultJournalEntriesByAccount: JournalEntriesByAccount = {
    account: defaultAccount,
    movements: []
}
export interface JournalEntrySearchFilter {
    account_id?: number
    model_type: 'Supplier' | 'Customer' | 'Employee'
    page?: number
    per_page?: number
    order_by?: string
    order?: string

}

