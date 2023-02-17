import { AxiosInstance } from "axios"
import { CurrencySearchFilter } from "/@src/models/Accounting/Currency/currency"
import { CustomResponseCollection } from "/@src/utils/response"



export async function getCurrenciesApi(
  api: AxiosInstance,
  searchFilter: CurrencySearchFilter
): Promise<{ response: CustomResponseCollection }> {
  const { data: response, headers } = await api.get('currency/getCurrencies', {
    params: searchFilter,
  })
  return { response }
}
