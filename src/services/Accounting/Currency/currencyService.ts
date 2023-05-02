
import { Currency, CurrencySearchFilter, defaultCurrency } from "/@src/models/Accounting/Currency/currency"
import { useCurrency } from "/@src/stores/Accounting/Currency/currencyStore"
import { Pagination } from "/@src/utils/response"


export async function getCurrenciesList(searchFilter: CurrencySearchFilter) {
  const currency = useCurrency()
  await currency.getCurrenciesStore(searchFilter)
  let currencies: Currency[] = currency.currencies
  let pagination: Pagination = currency.pagination
  let success: boolean = currency.success ?? false
  let error_code: string = currency.error_code ?? ''
  let message: string = currency.message ?? ''

  return { currencies, pagination, success, error_code, message }
}
export async function getCurrencyByCode(code: string) {
  const currencyResponse = useCurrency()
  let currency: Currency = await currencyResponse.getCurrencyByCodeStore(code) ?? defaultCurrency
  let success: boolean = currencyResponse.success ?? false
  let error_code: string = currencyResponse.error_code ?? ''
  let message: string = currencyResponse.message ?? ''
  return { currency, success, error_code, message }
}
export async function updateCurrencyRate(id: number, rate: number) {
  const currencyResponse = useCurrency()
  let currency: Currency = await currencyResponse.updateCurrencyRateStore(id, rate) ?? defaultCurrency
  let success: boolean = currencyResponse.success ?? false
  let error_code: string = currencyResponse.error_code ?? ''
  let message: string = currencyResponse.message ?? ''
  return { currency, success, error_code, message }
}

export function getCurrenciesFromStorage() {
  const currencyResponse = useCurrency()
  const currencies : Currency[] = currencyResponse.getCurrenciesFromStorage()
  return currencies 

}


