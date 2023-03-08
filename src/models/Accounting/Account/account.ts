import { ChartOfAccount } from "../ChartOfAccount/chartOfAccount"
import { Currency } from "../Currency/currency"
import { createI18n, DefaultLocaleMessageSchema } from 'vue-i18n';
import messages from "@intlify/vite-plugin-vue-i18n/messages";

const i18n = createI18n<[DefaultLocaleMessageSchema], 'ar' | 'en'>({
  locale: 'ar',
  fallbackLocale: 'en',
  messages: messages
})

export interface Account {
  id?: number
  code: string
  name: string
  balance: string
  status: number
  chart_account?: ChartOfAccount
  currency?: Currency
  currency_rate: number
  description?: string
}

export interface CreateAccount {
  name: string
  level2_code: string
  status: number
  currency_id: number
  currency_rate: number
  chart_of_account_id: number
  description?: string
}
export interface UpdateAccountCurrency {
  currency_id: number
  currency_rate: number
}



export const defaultAccount: Account = {
  id: 0,
  code: '',
  name: '',
  balance: '',
  status: 0,
  chart_account: undefined,
  currency: undefined,
  currency_rate: 1,
  description: ''

}

export const defaultCreateAccount: CreateAccount = {
  level2_code: '',
  name: '',
  status: 1,
  currency_id: 0,
  chart_of_account_id: 0,
  currency_rate: 1,
  description: ''

}

export interface AccountSearchFilter {
  status?: number
  name?: string
  code?: string
  page?: number
  per_page?: number
  order_by?: string
  order?: string
}

export const defaultAccountSearchFilter: AccountSearchFilter = {
  status: undefined,
  page: undefined,
  order: undefined,
  order_by: undefined,
  per_page: undefined,
}


// Trial Balance Interfaces And Defaults
export interface TrialBalance {
  main_charts: TrialBalanceLvl1Chart[]
  total_credits: string
  total_debits: string
}
export interface TrialBalanceLvl1Chart {
  id: number
  name: string
  code: string
  account_type: number
  children: TrialBalanceLvl2Chart[]
  total_credits: string
  total_debits: string
}
export interface TrialBalanceLvl2Chart {
  id: number
  name: string
  code: string
  account_type: number
  accounts: TrialBalanceAccount[]
  total_credits: string
  total_debits: string
}
export interface TrialBalanceAccount {
  id: number
  name: string
  code: string
  absolute_type: number
  absolute_balance: string
}
export const defaultTrialBalance: TrialBalance = {
  main_charts: [],
  total_credits: "",
  total_debits: ""
}


// Balance Sheet Interfaces And Defaults

export interface BalanceSheet {
  assets: BalanceSheetAssetsLiabilites
  liabilities: BalanceSheetAssetsLiabilites
  total_assets_balances: string
  total_liabilities_balances: string
}
export interface BalanceSheetAssetsLiabilites {
  id: number
  name: string
  code: string
  account_type: number
  children: BalanceSheetLvl2Chart[]
  total_balances: string
}
export interface BalanceSheetLvl2Chart {
  id: number
  name: string
  code: string
  account_type: number
  accounts: BalanceSheetAccount[]
  total_balances: string
}
export interface BalanceSheetAccount {
  id: number
  name: string
  code: string
  type: number
  balance: string
}


//Income Statment Interfaces And Defaults

export interface IncomeStatment {
  revenues: IncomeStatmentLvl1Chart
  other_expenses: IncomeStatmentLvl1Chart
  costs: IncomeStatmentLvl2Chart
  gross_profit: string
  net_income: string
}
export interface IncomeStatmentLvl1Chart {
  id: number
  name: string
  code: string
  account_type: number
  children: IncomeStatmentLvl2Chart[]
  total_balances: string
}
export interface IncomeStatmentLvl2Chart {
  id: number
  name: string
  code: string
  account_type: number
  accounts: IncomeStatmentAccount[]
  total_balances: string
}
export interface IncomeStatmentAccount {
  id: number
  name: string
  code: string
  type: number
  balance: string
}


export const defaultIncomeStatmentLvl1Chart: IncomeStatmentLvl1Chart = {
  id: 0,
  name: '',
  code: '',
  account_type: 1,
  children: [],
  total_balances: ''
}
export const defaultIncomeStatmentLvl2Chart: IncomeStatmentLvl2Chart = {
  id: 0,
  name: '',
  code: '',
  account_type: 1,
  accounts: [],
  total_balances: ''
}
export const defaultIncomeStatment: IncomeStatment = {
  revenues: defaultIncomeStatmentLvl1Chart,
  other_expenses: defaultIncomeStatmentLvl1Chart,
  costs: defaultIncomeStatmentLvl2Chart,
  gross_profit: '',
  net_income: ''
}





export const defaultBalanceSheetAssetsLiabilites: BalanceSheetAssetsLiabilites = {
  id: 0,
  name: '',
  code: '',
  account_type: 1,
  children: [],
  total_balances: '',
}

export const defaultBalanceSheet: BalanceSheet = {
  assets: defaultBalanceSheetAssetsLiabilites,
  liabilities: defaultBalanceSheetAssetsLiabilites,
  total_assets_balances: '',
  total_liabilities_balances: '',
}

export interface RecordAccountDetail {
  account_id?: number,
  amount?: number,
  type?: number
}

export interface RecordAccountAmountDetail {
  account_id?: number,
  credit_amount?: number,
  debit_amount?: number,
  type?: number
  has_remove_btn?: boolean
  difference_amount: number
}
export interface ChangeAccountStatus {
  id: number
  status: number
}

export const defaultChangeAccountStatus: ChangeAccountStatus = {
  id: 0,
  status: 0
}

export const defaultCreditAccountDetail = {
  account_id: 1,
  amount: 500,
  type: 1
} satisfies RecordAccountDetail

export const defaultDebitAccountDetail = {
  account_id: 1,
  amount: 0,
  type: 2
} satisfies RecordAccountDetail

class AccountConsts {
  static readonly INACTIVE = 0
  static readonly ACTIVE = 1
  static readonly ACCOUNT_STATUSES = [this.ACTIVE, this.INACTIVE]
  static readonly CREDIT_TYPE = 1
  static readonly DEBIT_TYPE = 2
  static readonly CASH_CODE = '13'
  static readonly CLIENTS_CODE = '11'
  static readonly EXPENSES_CODE = '3'
  static readonly SUPPLIER_CODE = '22'

  public static getAccountStatusName(status: number) {
    if (status == this.ACTIVE)
      return i18n.global.t('status.active')
    if (status == this.INACTIVE)
      return i18n.global.t('status.inactive')
    return ''
  }
  public static getAccountTypeName(type: number | undefined) {
    if (type == this.CREDIT_TYPE)
      return i18n.global.t('account_types.credit')
    if (type == this.DEBIT_TYPE)
      return i18n.global.t('account_types.debit')
    return ''
  }
}
export { AccountConsts }


