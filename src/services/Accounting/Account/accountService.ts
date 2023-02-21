
import { Account, AccountSearchFilter, BalanceSheet, ChangeAccountStatus, CreateAccount, defaultAccount, defaultBalanceSheet, defaultTrialBalance, TrialBalance, UpdateAccountCurrency } from "/@src/models/Accounting/Account/account"
import { useAccount } from "/@src/stores/Accounting/Account/accountStore"
import { defaultPagination, Pagination } from "/@src/utils/response"


export async function addAccount(accountData: CreateAccount) {
    const accountResponse = useAccount()
    let account: Account = await accountResponse.addAccountStore(accountData) ?? defaultAccount
    let success: boolean = accountResponse.success ?? false
    let error_code: string = accountResponse.error_code ?? ''
    let message: string = accountResponse.message ?? ''
    return { success, error_code, message, account }

}

export async function getAccountsList(searchFilter: AccountSearchFilter) {
    const accountResponse = useAccount()
    await accountResponse.getAccountsListStore(searchFilter)
    let accounts: Account[] = accountResponse.accounts
    let success: boolean = accountResponse.success ?? false
    let error_code: string = accountResponse.error_code ?? ''
    let pagination: Pagination = accountResponse.pagination ?? defaultPagination
    let message: string = accountResponse.message ?? ''
    return { success, error_code, message, accounts, pagination }

}

export async function getAllAccounts(searchFilter: AccountSearchFilter) {
    const accountResponse = useAccount()
    await accountResponse.getAllAccountsStore(searchFilter)
    let accounts: Account[] = accountResponse.accounts
    let success: boolean = accountResponse.success ?? false
    let error_code: string = accountResponse.error_code ?? ''
    let message: string = accountResponse.message ?? ''
    return { success, error_code, message, accounts }

}
export async function generateTrailBalanceReport() {
    const accountResponse = useAccount()
    let trial_balance: TrialBalance = await accountResponse.generateTrailBalanceReportStore() ?? defaultTrialBalance
    let success: boolean = accountResponse.success ?? false
    let error_code: string = accountResponse.error_code ?? ''
    let message: string = accountResponse.message ?? ''
    return { success, error_code, message, trial_balance }

}

export async function generateBalanceSheetReport() {
    const accountResponse = useAccount()
    let balance_sheet: BalanceSheet = await accountResponse.generateBalanceSheetReportStore() ?? defaultBalanceSheet
    let success: boolean = accountResponse.success ?? false
    let error_code: string = accountResponse.error_code ?? ''
    let message: string = accountResponse.message ?? ''
    return { success, error_code, message, balance_sheet }

}
export async function updateAccountCurrency(account_id: number, updateAccountCurrencyData: UpdateAccountCurrency) {
    const accountResponse = useAccount()
    let account: Account = await accountResponse.updateAccountCurrencyStore(account_id, updateAccountCurrencyData) ?? defaultAccount
    let success: boolean = accountResponse.success ?? false
    let error_code: string = accountResponse.error_code ?? ''
    let message: string = accountResponse.message ?? ''
    return { success, error_code, message, account }

}

export async function changeAccountStatus(accountData: ChangeAccountStatus) {
  const accountResponse = useAccount()
  await accountResponse.changeAccountStatusStore(accountData)
  var success: boolean = accountResponse.success ?? false
  var error_code: string = accountResponse.error_code ?? ''
  var message: string = accountResponse.message ?? ''
  return { success, error_code, message }
}


