import { Currency } from '../Currency/currency'
import { ChartOfAccount } from '../ChartOfAccount/chartOfAccount'
import messages from '@intlify/vite-plugin-vue-i18n/messages'
import { createI18n, DefaultLocaleMessageSchema } from 'vue-i18n'

const i18n = createI18n<[DefaultLocaleMessageSchema], 'ar' | 'en'>({
  locale: 'ar',
  fallbackLocale: 'en',
  messages: messages
})

export interface Account {
  id?: number
  code: string
  name: string
  balance: number
  status: number
  chart_of_account: ChartOfAccount
  currency: Currency
  description?: string
}

export interface CreateAccount {
  code: string
  name: string
  balance: number
  status: number
  currency_id: number
  chart_of_account_id: number
  description?: string
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
}

// export interface AccountingRecord  {
//   account_id: 1,
//   amount: 500,
//   type: 1
// }

export const defaultCreditAccountDetail = {
  account_id: 1,
  amount: 500,
  type: 1
} satisfies RecordAccountDetail

export const defaultDebitAccountDetail = {
  account_id: 1,
  amount: 500,
  type: 2
} satisfies RecordAccountDetail

class AccountConsts {

  static readonly CREDIT_TYPE = 1;
  static readonly DEBIT_TYPE = 2;

  public static getAccountTypeName(type: number) {
    if (type == this.CREDIT_TYPE)
      return i18n.global.t('account_types.credit')
    if (type == this.DEBIT_TYPE)
      return i18n.global.t('account_types.debit')
    else return '';
  }
}
export { AccountConsts }
