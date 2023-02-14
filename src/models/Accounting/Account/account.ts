import { Currency } from '../Currency/currency'
 import { ChartOfAccount } from '../ChartOfAccount/chartOfAccount'


export interface Account{
  id?: number
  code:string
  name:string
  balance:number
  status:number
  chart_of_account: ChartOfAccount
  currency: Currency
  description?:string
}

export interface CreateAccount{
  code:string
  name:string
  balance:number
  status:number
  currency_id:number
  chart_of_account_id:number
  description?:string
}

 export const defaultAccount : Account = {
  id: 0
  code:undefined
  name:undefined
  balance:undefined
  status:undefined
  chart_of_account: undefined
  currency: undefined
  description :undefined

 }

 export const defaultCreateAccount:CreateAccount = {
  code:undefined
  name:undefined
  balance:undefined
  status:undefined
  currency_id:undefined
  chart_of_account_id:undefined
  description:undefined
 }

