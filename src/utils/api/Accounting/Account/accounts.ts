
import { AxiosInstance } from "axios"
import { CreateAccount } from "/@src/models/Accounting/Account/account"
import { CustomResponseSingle } from "/@src/utils/response"

export async function addAccountApi(
  api: AxiosInstance,
  account: CreateAccount
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.post(`account`, account)
  return { response }
}


