import {RecordAccountDetail} from "../Account/account"

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
} as CreateRecords

class TransactionConsts {
  static readonly ADD_QUANTITY = 1;
  static readonly TRANSFER_CASH = 2;
  static readonly PAY_EXPENSE = 3;
  static readonly CUSTOM_REVENUE = 4;
  static readonly OTHER_RECORD = 5;

}

export {TransactionConsts}

