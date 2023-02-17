import { CreateRecords } from "/@src/models/Accounting/Transaction/record"
import { useTransaction } from "/@src/stores/Accounting/Transaction/transactionStore"
import { RecordAccountDetail, RecordAccountAmountDetail } from '/@src/models/Accounting/Account/account';
import { AccountConsts } from '/@src/models/Accounting/Account/account';


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

export function getRecordsData(values: RecordAccountAmountDetail[]) {
    let recordsData: CreateRecords = <CreateRecords>({})
    let accounts: RecordAccountDetail[] = []
    values.forEach((element) => {
        let accountDetails: RecordAccountDetail = {}
        accountDetails.account_id = element.account_id
        accountDetails.amount = element.credit_amount ?? element.debit_amount
        accountDetails.type = element.credit_amount === undefined ? AccountConsts.DEBIT_TYPE : AccountConsts.CREDIT_TYPE
        accounts.push(accountDetails)
    });
    recordsData.accounts = accounts
    recordsData.amount = 500
    recordsData.currency_id = 1
    recordsData.currency_rate = 1500
    recordsData.date = "2023-02-14 18:22:24"
    recordsData.note = "note"
    recordsData.recordType = 1
    recordsData.transaction_type_id = 1
    recordsData.title
    return recordsData
}