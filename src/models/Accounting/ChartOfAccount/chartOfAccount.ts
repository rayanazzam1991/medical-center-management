import { AccountConsts } from "../Account/account"

export interface ChartOfAccount{
    id:number
    code:string
  name: string
  has_dynamic_account: boolean
  parent?: ChartOfAccount
  account_type :number
}

export const defaultChartOfAccount: ChartOfAccount = {
  id: 0,
  code:'',
  name: '',
  has_dynamic_account: false,
  parent: undefined,
  account_type: AccountConsts.DEBIT_TYPE
}


export interface ChartOfAccountSearchFilter {
  name?:string
}

export const defaultChartOfAccountSearchFilter: ChartOfAccountSearchFilter= {
  name:''
}

class ChartConsts {
  static readonly CASH_CODE= '13'
}
export { ChartConsts }

