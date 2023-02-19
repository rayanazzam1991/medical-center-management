import { defaultCreditAccountDetail, defaultDebitAccountDetail, recordAccountDetail } from "../Account/account"
import { createRecords } from "/@src/services/Accounting/Transaction/transactionService"

export interface CreateRecords {
    title: string,
    amount: number,
    accounts: Array<recordAccountDetail>,
    currency_id: number,
    currency_rate: number,
    transaction_type_id: number,
    note: string,
    date: string,
    recordType: number
}

export const defaultAccounts = [
    defaultCreditAccountDetail,
    defaultDebitAccountDetail
]

export const createRecordsWithDefault = {
    title: "title",
    amount: 1300,
    accounts: defaultAccounts,
    currency_id: 1,
    currency_rate: 1500,
    transaction_type_id: 1,
    note: "note",
    date: "2023-02-14 18:22:24",
    recordType: 1
} satisfies CreateRecords