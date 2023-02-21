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
export const defaultJournalEntry: JournalEntry = {
    id: 0,
    account_type: AccountConsts.CREDIT_TYPE,
    amount: "0.00",
    account: defaultAccount,
    currency: defaultCurrency,
    currency_rate: 1,
    description: undefined,
    created_at: ""
}