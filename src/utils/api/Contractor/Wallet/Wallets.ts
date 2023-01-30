import { AxiosInstance } from "axios"
import { CustomResponseCollection, CustomResponseSingle } from "/@src/utils/response"
import { WalletSearchFilter } from "/@src/models/Contractor/wallet"

export async function getWalletsApi(
    api: AxiosInstance,
    searchFilter: WalletSearchFilter
): Promise<{ response: CustomResponseCollection }> {
    const { data: response, headers } = await api.get('wallet', {
        params: searchFilter,
    })
    return { response }
}