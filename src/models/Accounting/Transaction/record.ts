import { User } from "../../Others/User/user"
import { RecordAccountDetail } from "../Account/account"
import { Currency, defaultCurrency } from "../Currency/currency"
import { JournalEntry } from "../JournalEntry/journalEntry"

export interface CreateRecords {
  title: string,
  amount: number,
  accounts: Array<RecordAccountDetail>,
  currency_id: number,
  currency_rate: number,
  transaction_type_id: number,
  note: string,
  date: string,
  recordType?: number
}
export interface Transaction {
  id: number
  title?: string
  amount: string
  currency: Currency
  currency_rate: number
  note?: string
  date?: string
  created_at: string
  created_by?: User
  entries: JournalEntry[]

}


export interface TransactionSearchFilter {
  title?: string
  note?: string
  page?: number
  per_page?: number
  order_by?: string
  order?: string
}
export interface ClientsCashReceiptsSearchFilter {
  customer_id?: number
  client_name?: string
  note?: string
  isOnDay?:boolean | number
  currency_id?: number
  cash_account_id?: number
  page?: number
  per_page?: number
  order_by?: string
  order?: string
}
export interface SuppliersCashReceiptsSearchFilter {
  employee_id?: number
  supplier_name?: string
  note?: string
  isOnDay?:boolean |number
  currency_id?: number
  cash_account_id?: number
  page?: number
  per_page?: number
  order_by?: string
  order?: string
}

export const defaultTransactionSearchFilter: Partial<TransactionSearchFilter> = {}
export const defaultClientsCashReceiptsSearchFilter: Partial<ClientsCashReceiptsSearchFilter> = {}
 export const defaultSuppliersCashReceiptsSearchFilter: Partial<SuppliersCashReceiptsSearchFilter> = {}


export const defaultTransaction: Transaction = {
  id: 0,
  title: undefined,
  amount: "0.00",
  currency: defaultCurrency,
  currency_rate: 1,
  note: undefined,
  date: undefined,
  created_at: "",
  created_by: undefined,
  entries: []
}
export const createRecordsWithDefault = {
  title: "",
  amount: 0,
  accounts: [],
  currency_id: 1,
  currency_rate: 1,
  transaction_type_id: 1,
  note: "",
  date: "",
  recordType: 1
} as CreateRecords

class TransactionConsts {
  static readonly ADD_QUANTITY = 1;
  static readonly TRANSFER_CASH = 2;
  static readonly CUSTOM_EXPENSE = 3;
  static readonly CUSTOM_REVENUE = 4;
  static readonly CLIENT_CASH_RECEIPT = 5;
  static readonly SUPPLIER_CASH_RECEIPT = 6;
  static readonly EMPLOYEE_CASH_RECEIPT = 7;
  static readonly OTHER_RECORD = 50;

}

export { TransactionConsts }

