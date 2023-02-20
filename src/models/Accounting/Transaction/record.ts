import { defaultCreditAccountDetail, defaultDebitAccountDetail, RecordAccountDetail } from "../Account/account"

export interface CreateRecords {
    title: string,
    amount: number,
    accounts: Array<RecordAccountDetail>,
    currency_id: number,
    currency_rate: number,
    transaction_type_id: number,
    note: string,
    date: string,
    recordType: number
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
} satisfies CreateRecords

class TransactionConsts {
    static readonly ADD_QUANTITY = 1;
    static readonly TRANSFER_CASH = 2;
    static readonly PAY_EXPENSE = 3;
    static readonly OTHER = 4;

}
export { TransactionConsts }

