

export interface Currency{
  id: number
  name: string
  is_main:boolean

}

export const defaultCurrency: Currency = {
  id: 0,
  name: '',
  is_main:false

}

export interface CurrencySearchFilter {
  name?: string
}

export const defaultCurrencySearchFilter: CurrencySearchFilter= {
  name:''
}


