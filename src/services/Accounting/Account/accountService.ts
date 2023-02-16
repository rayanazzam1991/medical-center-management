import { TrialBalance, defaultTrialBalance, BalanceSheet, defaultBalanceSheet } from "/@src/models/Accounting/Account/account"
import { useAccount } from "/@src/stores/Accounting/Account/accountStore"


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
