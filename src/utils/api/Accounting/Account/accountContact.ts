import { AxiosInstance } from "axios"
import { AccountSearchFilter, ChangeAccountStatus, CreateAccount, UpdateAccountCurrency } from "/@src/models/Accounting/Account/account"
import { CustomResponseCollection, CustomResponseSingle } from "/@src/utils/response"

export async function getAuthenticatedCashierAccountsApi(
    api: AxiosInstance,
): Promise<{ response: CustomResponseCollection }> {
    const { data: response, headers } = await api.get('accountContact/getAuthenticatedCashierAccounts')
    return { response }
}
