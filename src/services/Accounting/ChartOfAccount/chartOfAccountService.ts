
import { ChartOfAccount, ChartOfAccountSearchFilter } from "/@src/models/Accounting/ChartOfAccount/chartOfAccount"
import { Currency, CurrencySearchFilter } from "/@src/models/Accounting/Currency/currency"
import { useChartOfAccount } from "/@src/stores/Accounting/ChartOfAccount/chartOfAccountStore"
import { Pagination } from "/@src/utils/response"


export async function getChartOfAccountsList(searchFilter: ChartOfAccountSearchFilter) {
  const chartOfAccount = useChartOfAccount()
  await chartOfAccount.getChartOfAccountsStore(searchFilter)
  let chartOfAccounts: ChartOfAccount[] = chartOfAccount.chartOfAccounts
  let pagination: Pagination = chartOfAccount.pagination
  let success: boolean = chartOfAccount.success ?? false
  let error_code: string = chartOfAccount.error_code ?? ''
  let message: string = chartOfAccount.message ?? ''

  return { chartOfAccounts, pagination, success, error_code, message }
}


