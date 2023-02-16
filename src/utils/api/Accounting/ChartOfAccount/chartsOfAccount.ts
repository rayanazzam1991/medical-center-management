import { AxiosInstance } from "axios"
import { ChartOfAccountSearchFilter } from "/@src/models/Accounting/ChartOfAccount/chartOfAccount"
import { CustomResponseCollection } from "/@src/utils/response"



export async function getChartOfAccountsApi(
  api: AxiosInstance,
  searchFilter: ChartOfAccountSearchFilter
): Promise<{ response: CustomResponseCollection }> {
  const { data: response, headers } = await api.get('chartOfAccount/getChartOfAccounts', {
    params: searchFilter,
  })
  return { response }
}
