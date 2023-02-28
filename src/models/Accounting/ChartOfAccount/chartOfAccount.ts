import { AccountConsts } from "../Account/account"

export interface ChartOfAccount {
  id: number
  code: string
  name: string
  has_dynamic_account: boolean
  parent?: ChartOfAccount
  account_type: number
}

export const defaultChartOfAccount: ChartOfAccount = {
  id: 0,
  code: '',
  name: '',
  has_dynamic_account: false,
  parent: undefined,
  account_type: AccountConsts.DEBIT_TYPE
}


export interface ChartOfAccountSearchFilter {
  name?: string
}

export const defaultChartOfAccountSearchFilter: ChartOfAccountSearchFilter = {
  name: ''
}

class ChartOfAccountConsts {
  static readonly CASH_CODE = '13'
  static readonly CLIENTS_CODE = '11'
  static readonly SUPPLIER_CODE = '23'
  static readonly CURRENCY_DIFFERENCES_CODE = '33'
  static readonly REVENUE = '4'

}
export { ChartOfAccountConsts }


class ChartConsts {
  static readonly CASH_CODE = '13'
}
export { ChartConsts }

