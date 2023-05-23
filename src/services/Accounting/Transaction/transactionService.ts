import {
  ClientsCashReceiptsSearchFilter,
  CreateRecords,
  ResetCashAccountsListSearchFilter,
  SuppliersCashReceiptsSearchFilter,
  Transaction,
  TransactionConsts,
  TransactionSearchFilter
} from "/@src/models/Accounting/Transaction/record"
import { useTransaction } from "/@src/stores/Accounting/Transaction/transactionStore"
import { Account, AccountConsts, defaultAccount, RecordAccountAmountDetail, RecordAccountDetail } from '/@src/models/Accounting/Account/account';
import { defaultPagination, Pagination } from "/@src/utils/response";
import { Currency } from "/@src/models/Accounting/Currency/currency";
import { ChartOfAccountConsts } from "/@src/models/Accounting/ChartOfAccount/chartOfAccount";


export async function createRecords(
  records: CreateRecords
) {
  const transactionResponce = useTransaction()
  let response = await transactionResponce.createRecords(records)
  let success: boolean = transactionResponce.success ?? false
  let error_code: string = transactionResponce.error_code ?? ''
  let message: string = transactionResponce.message ?? ''
  return { success, error_code, message, response }

}

export function getRecordsData(values: RecordAccountAmountDetail[], title: string, note: string, amount: number, currency_id: number, currency_rate: number, accountList: Account[], currenciesList: Currency[]) {
  let recordsData: CreateRecords = <CreateRecords>({})
  let accounts: RecordAccountDetail[] = []
  let totalCreditCurrenciesDifferenceAmount = 0
  let totalDebitCurrenciesDifferenceAmount = 0
  let totalCurrenciesDifferenceAmount = 0
  const currenciesDifferenceAccount = accountList.find((account) => account.chart_account?.code == ChartOfAccountConsts.CURRENCY_DIFFERENCES_CODE)

  values.forEach((entry) => {
    const account = accountList.find((account) => account.id == entry.account_id) ?? defaultAccount
    if (!account?.currency?.is_main) {
      if (entry.credit_amount) {
        if (account.chart_account?.account_type == AccountConsts.DEBIT_TYPE) {
          entry.difference_amount = entry.credit_amount - (entry.credit_amount * account.currency_rate / currency_rate)
          totalCreditCurrenciesDifferenceAmount += entry.difference_amount
        } else {
          entry.difference_amount = 0
        }


      } else if (entry.debit_amount) {
        if (account.chart_account?.account_type == AccountConsts.CREDIT_TYPE) {
          entry.difference_amount = entry.debit_amount - (entry.debit_amount * account.currency_rate / currency_rate)
          totalDebitCurrenciesDifferenceAmount += entry.difference_amount
        } else {
          entry.difference_amount = 0
        }
      }
    } else {
      entry.difference_amount = 0
    }
  });
  totalCurrenciesDifferenceAmount = totalCreditCurrenciesDifferenceAmount - totalDebitCurrenciesDifferenceAmount

  values.forEach((element) => {
    if (element.debit_amount !== undefined || element.credit_amount !== undefined) {
      let accountDetails: RecordAccountDetail = {}
      accountDetails.account_id = element.account_id
      accountDetails.amount = element.credit_amount ? element.credit_amount - element.difference_amount : element.debit_amount ? element.debit_amount - element.difference_amount : 0
      accountDetails.type = element.credit_amount === undefined ? AccountConsts.DEBIT_TYPE : AccountConsts.CREDIT_TYPE
      accounts.push(accountDetails)
    }
  });
  if (totalCurrenciesDifferenceAmount != 0) {
    accounts.push(
      { account_id: currenciesDifferenceAccount?.id, amount: Math.abs(totalCurrenciesDifferenceAmount), type: totalCurrenciesDifferenceAmount > 0 ? AccountConsts.CREDIT_TYPE : AccountConsts.DEBIT_TYPE }
    )
  }
  recordsData.accounts = accounts
  recordsData.amount = amount
  recordsData.currency_id = currency_id
  recordsData.currency_rate = currency_rate
  recordsData.note = note
  recordsData.recordType = TransactionConsts.OTHER_RECORD
  recordsData.transaction_type_id = 1
  recordsData.title = title
  return recordsData
}

export async function getTransactionsList(searchFilter: TransactionSearchFilter) {
  const transactionResponse = useTransaction()
  let transactions: Transaction[] = await transactionResponse.getTransactionsListStore(searchFilter) ?? []

  let success: boolean = transactionResponse.success ?? false
  let error_code: string = transactionResponse.error_code ?? ''
  let pagination: Pagination = transactionResponse.pagination ?? defaultPagination
  let message: string = transactionResponse.message ?? ''
  return { success, error_code, message, transactions, pagination }

}
export async function getClientsCashReceiptsList(searchFilter: ClientsCashReceiptsSearchFilter) {
  const transactionResponse = useTransaction()

  let clients_cash_receipts: Transaction[] = await transactionResponse.getClientsCashReceiptsListStore(searchFilter) ?? []
  let success: boolean = transactionResponse.success ?? false
  let error_code: string = transactionResponse.error_code ?? ''
  let clientsPagination: Pagination = transactionResponse.pagination ?? defaultPagination
  let message: string = transactionResponse.message ?? ''
  return { success, error_code, message, clients_cash_receipts, clientsPagination }

}

export async function getSuppliersCashReceiptsList(searchFilter: SuppliersCashReceiptsSearchFilter) {
  const transactionResponse = useTransaction()
  let suppliers_cash_receipts: Transaction[] = await transactionResponse.getSuppliersCashReceiptsListStore(searchFilter) ?? []
  let success: boolean = transactionResponse.success ?? false
  let error_code: string = transactionResponse.error_code ?? ''
  let suppliersPagination: Pagination = transactionResponse.pagination ?? defaultPagination
  let message: string = transactionResponse.message ?? ''
  return { success, error_code, message, suppliers_cash_receipts, suppliersPagination }
}
export async function getResetCashAccountsList(searchFilter: ResetCashAccountsListSearchFilter) {
  const transactionResponse = useTransaction()
  await transactionResponse.getResetCashAccountsListStore(searchFilter)
  const reset_cash_account_transactions = transactionResponse.resetCashAccountTransactions
  const success: boolean = transactionResponse.success ?? false
  const error_code: string = transactionResponse.error_code ?? ''
  const pagination: Pagination = transactionResponse.pagination ?? defaultPagination
  const message: string = transactionResponse.message ?? ''
  return { success, error_code, message, reset_cash_account_transactions, pagination }
}

export function resetClientsCashReceiptsSearchFilter() {
  const blankSearchFilter: ClientsCashReceiptsSearchFilter = {
    order: undefined,
    order_by: undefined,
    page: undefined,
    per_page: undefined,
    cash_account_id: undefined,
    client_name: undefined,
    currency_id: undefined,
    note: undefined,
    customer_id: undefined,
    isOnDay: undefined,
  }

  return blankSearchFilter

}
export function resetEmployeeSuppliersCashReceiptsSearchFilter() {
  const blankSearchFilter: SuppliersCashReceiptsSearchFilter = {
    order: undefined,
    order_by: undefined,
    page: undefined,
    per_page: undefined,
    cash_account_id: undefined,
    currency_id: undefined,
    note: undefined,
    supplier_name: undefined,
    employee_id: undefined,
    isOnDay: undefined,

  }

  return blankSearchFilter

}
