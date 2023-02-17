
import { Currency, CurrencySearchFilter } from "/@src/models/Accounting/Currency/currency"
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


