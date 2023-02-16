import { AxiosInstance } from "axios"
import { CreateAccount } from "/@src/models/Accounting/Account/account"
import { CustomResponseCollection, CustomResponseSingle } from "/@src/utils/response"

export async function generateTrailBalanceReportApi(
    api: AxiosInstance,
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.get('account/generateTrailBalanceReport')
    return { response }
}

export async function generateBalanceSheetReportApi(
    api: AxiosInstance,
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.get('account/generateBalanceSheetReport')
    return { response }
}
export async function addAccountApi(
  api: AxiosInstance,
  account: CreateAccount
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.post(`account`, account)
  return { response }
}
