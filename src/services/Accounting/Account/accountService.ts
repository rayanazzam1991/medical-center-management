
import { Account, AccountSearchFilter, BalanceSheet, ChangeAccountStatus, CreateAccount, defaultAccount, defaultBalanceSheet, defaultIncomeStatment, defaultTrialBalance, IncomeStatment, ResetCashAccountsData, TrialBalance, UpdateAccountCurrency } from "/@src/models/Accounting/Account/account"
import { GetAccountIdByContactIdRequestData } from "/@src/models/Accounting/AccountContact/accountContact"
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

export async function generateIncomeStatmentReport() {
    const accountResponse = useAccount()
    let income_statment: IncomeStatment = await accountResponse.generateIncomeStatmentReportStore() ?? defaultIncomeStatment
    let success: boolean = accountResponse.success ?? false
    let error_code: string = accountResponse.error_code ?? ''
    let message: string = accountResponse.message ?? ''
    return { success, error_code, message, income_statment }

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


export async function getAuthenticatedCashierAccounts() {
    const accountResponse = useAccount()
    await accountResponse.getAuthenticatedCashierAccountsStore()
    const cashierAccounts = accountResponse.cashierAccounts
    const success: boolean = accountResponse.success ?? false
    const error_code: string = accountResponse.error_code ?? ''
    const message: string = accountResponse.message ?? ''
    return { success, error_code, message, cashierAccounts }
}

export async function getAccountIdByContactId(data: GetAccountIdByContactIdRequestData) {
    const accountResponse = useAccount()
    await accountResponse.getAccountIdByContactIdStore(data)
    const account_id = accountResponse.accountIdByContactId
    const success: boolean = accountResponse.success ?? false
    const error_code: string = accountResponse.error_code ?? ''
    const message: string = accountResponse.message ?? ''
    return { success, error_code, message, account_id }
}


export async function getCashierAccountsByAccountId(accountId: number) {
    const accountResponse = useAccount()
    await accountResponse.getCashierAccountsByAccountIdStore(accountId)
    const cashier_accounts = accountResponse.cashierAccounts
    const success: boolean = accountResponse.success ?? false
    const error_code: string = accountResponse.error_code ?? ''
    const message: string = accountResponse.message ?? ''
    return { success, error_code, message, cashier_accounts }
}
export async function getCashierAccountsByCashierId(cashierId: number) {
    const accountResponse = useAccount()
    await accountResponse.getCashierAccountsByCashierIdStore(cashierId)
    const cashier_accounts = accountResponse.cashierAccounts
    const success: boolean = accountResponse.success ?? false
    const error_code: string = accountResponse.error_code ?? ''
    const message: string = accountResponse.message ?? ''
    return { success, error_code, message, cashier_accounts }
}
export async function resetCashAccounts(data: ResetCashAccountsData) {
    const accountResponse = useAccount()
    await accountResponse.resetCashAccountsStore(data)
    const success: boolean = accountResponse.success ?? false
    const error_code: string = accountResponse.error_code ?? ''
    const message: string = accountResponse.message ?? ''
    return { success, error_code, message }
}

export function resetResetCashAccountsData() {
    const blank: ResetCashAccountsData = {
        date: new Date().toISOString().substring(0, 10),
        iqd_source_account_id: undefined,
        iqd_target_account_id: undefined,
        note: undefined,
        usd_source_account_id: undefined,
        usd_target_account_id: undefined
    }

    return blank

}
