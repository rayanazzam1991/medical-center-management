
import { Account, CreateAccount, defaultAccount } from "/@src/models/Accounting/Account/account"
import { useAccount } from "/@src/stores/Accounting/Account/accountStore"
import { Pagination } from "/@src/utils/response"


export async function addAccount(accountData: CreateAccount) {
    const accountResponse = useAccount()
    var account: Account = await accountResponse.addAccountStore(accountData) ?? defaultAccount
    var success: boolean = accountResponse.success ?? false
    var error_code: string = accountResponse.error_code ?? ''
    var message: string = accountResponse.message ?? ''
    return { success, error_code, message, account }

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
