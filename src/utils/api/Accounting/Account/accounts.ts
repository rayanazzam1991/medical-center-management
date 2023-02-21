import { AxiosInstance } from "axios"
import { AccountSearchFilter, ChangeAccountStatus, CreateAccount, UpdateAccountCurrency } from "/@src/models/Accounting/Account/account"
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

export async function getAccountsListApi(
    api: AxiosInstance,
    searchFilter: AccountSearchFilter
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.get(`account/getAccountsList`, {
        params: searchFilter
    })
    return { response }
}

export async function getAllAccountsApi(
    api: AxiosInstance,
    searchFilter: AccountSearchFilter
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.get(`account/getAllAccounts`, {
        params: searchFilter
    })
    return { response }
}
export async function changeAccountStatusApi(
  api: AxiosInstance,
  account: ChangeAccountStatus
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.put(
      `account/changeAccountStatus/${account.id}`,
      account
  )
  return { response }
}


export async function updateAccountCurrencyApi(
    api: AxiosInstance,
    account_id: number,
    updateAccountCurrencyData: UpdateAccountCurrency
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.put(`account/${account_id}/updateAccountCurrency`, updateAccountCurrencyData)
    return { response }
}
