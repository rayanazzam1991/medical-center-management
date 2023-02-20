

export interface Currency {
  id: number
  name: string
  is_main: boolean
  code: string
  rate: number

}

export const defaultCurrency: Currency = {
  id: 0,
  name: '',
  is_main: false,
  code: '',
  rate: 1

}

export interface CurrencySearchFilter {
  name?: string
}

export const defaultCurrencySearchFilter: CurrencySearchFilter = {
  name: undefined
}


class CurrencyConsts {
  static readonly USD_CODE = "USD"
  static readonly IQD_CODE = "IQD"
}
export { CurrencyConsts }

