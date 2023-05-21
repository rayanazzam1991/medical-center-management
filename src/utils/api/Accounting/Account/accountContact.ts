import { AxiosInstance } from "axios"
import { CustomResponseCollection, CustomResponseSingle } from "/@src/utils/response"
import { GetAccountIdByContactIdRequestData } from "/@src/models/Accounting/AccountContact/accountContact"

export async function getAuthenticatedCashierAccountsApi(
    api: AxiosInstance,
): Promise<{ response: CustomResponseCollection }> {
    const { data: response, headers } = await api.get('accountContact/getAuthenticatedCashierAccounts')
    return { response }
}
export async function getAccountIdByContactIdApi(
    api: AxiosInstance,
    data: GetAccountIdByContactIdRequestData
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.get('accountContact/getAccountByContactId', { params: data })
    return { response }
}
