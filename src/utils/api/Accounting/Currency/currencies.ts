import { AxiosInstance } from "axios"
import { CurrencySearchFilter } from "/@src/models/Accounting/Currency/currency"
import { CustomResponseCollection, CustomResponseSingle } from "/@src/utils/response"



export async function getCurrenciesApi(
  api: AxiosInstance,
  searchFilter: CurrencySearchFilter
): Promise<{ response: CustomResponseCollection }> {
  const { data: response, headers } = await api.get('currency/getCurrencies', {
    params: searchFilter,
  })
  return { response }
}
export async function getCurrencyByCodeApi(
  api: AxiosInstance,
  code: string
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.get(`currency/getCurrnecyByCode/${code}`)
  return { response }
}
export async function updateCurrencyRateApi(
  api: AxiosInstance,
  id: number,
  rate: number
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.put(`currency/${id}/`, { rate: rate })
  return { response }
}
