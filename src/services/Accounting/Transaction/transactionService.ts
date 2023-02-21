import {
  CreateRecords,
  Transaction,
  TransactionConsts,
  TransactionSearchFilter
} from "/@src/models/Accounting/Transaction/record"
import {useTransaction} from "/@src/stores/Accounting/Transaction/transactionStore"
import {AccountConsts, RecordAccountAmountDetail, RecordAccountDetail} from '/@src/models/Accounting/Account/account';
import {defaultPagination, Pagination} from "/@src/utils/response";


export async function createRecords(
  records: CreateRecords
) {
  const transactionResponce = useTransaction()
  let response = await transactionResponce.createRecords(records)
  let success: boolean = transactionResponce.success ?? false
  let error_code: string = transactionResponce.error_code ?? ''
  let message: string = transactionResponce.message ?? ''
  return {success, error_code, message, response}

}

export function getRecordsData(values: RecordAccountAmountDetail[], title: string, note: string, amount: number) {
  let recordsData: CreateRecords = <CreateRecords>({})
  let accounts: RecordAccountDetail[] = []
  values.forEach((element) => {
    if (element.debit_amount !== undefined || element.credit_amount !== undefined) {
      let accountDetails: RecordAccountDetail = {}
      accountDetails.account_id = element.account_id
      accountDetails.amount = element.credit_amount ?? (element.debit_amount ?? 0)
      accountDetails.type = element.credit_amount === undefined ? AccountConsts.DEBIT_TYPE : AccountConsts.CREDIT_TYPE
      accounts.push(accountDetails)
    }
  });
  recordsData.accounts = accounts
  recordsData.amount = amount
  recordsData.currency_id = 1
  recordsData.currency_rate = 1500
  recordsData.note = note
  recordsData.recordType = TransactionConsts.OTHER_RECORD
  recordsData.transaction_type_id = 1
  recordsData.title = title
  return recordsData
}

export async function getTransactionsList(searchFilter: TransactionSearchFilter) {
  const transactionResponse = useTransaction()
  let transactions: Transaction[] = await transactionResponse.getTransactionsListStore(searchFilter)

  let success: boolean = transactionResponse.success ?? false
  let error_code: string = transactionResponse.error_code ?? ''
  let pagination: Pagination = transactionResponse.pagination ?? defaultPagination
  let message: string = transactionResponse.message ?? ''
  return {success, error_code, message, transactions, pagination}

}
