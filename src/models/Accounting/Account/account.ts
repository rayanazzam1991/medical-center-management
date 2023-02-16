import { ChartOfAccount } from "../ChartOfAccount/chartOfAccount"
import { Currency } from "../Currency/currency"
import { createI18n, DefaultLocaleMessageSchema } from 'vue-i18n';
import messages from "@intlify/vite-plugin-vue-i18n/messages";

const i18n = createI18n<[DefaultLocaleMessageSchema], 'ar' | 'en'>({
  locale: 'ar',
  fallbackLocale: 'en',
  messages: messages
})

export interface Account{
  id?: number
  code:string
  name:string
  balance:number
  status:number
  chart_of_account?: ChartOfAccount
  currency?: Currency
  currency_rate:number
  description?:string
}

export interface CreateAccount{
  name:string
  level2_code: string
  balance:number
  status:number
  currency_id: number
  currency_rate:number
  chart_of_account_id:number
  description?:string
}


export const defaultAccount: Account = {
  id: 0,
  code:'',
  name:'',
  balance: 0,
  status:0,
  chart_of_account: undefined,
  currency: undefined,
  currency_rate:1,
  description:''

}

export const defaultCreateAccount: CreateAccount = {
  level2_code:'',
  name:'',
  balance:0,
  status:1,
  currency_id:0,
  chart_of_account_id: 0,
  currency_rate:1,
  description:''

}

export interface AccountSearchFilter {
  status?: number
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



class AccountConsts {
  static readonly INACTIVE = 0
  static readonly ACTIVE = 1

  public static getAccountStatusName(status: number) {
    if (status == this.ACTIVE)
      return i18n.global.t('status.active')
    if (status == this.INACTIVE)
      return i18n.global.t('status.inactive')
    return ''
  }
}
export { AccountConsts }


