import { AxiosInstance } from "axios"
import { CustomResponseCollection, CustomResponseSingle } from "/@src/utils/response"
import { CreateWalletMovement, WalletMovementSearchFilter } from "/@src/models/Contractor/walletMovement"


export async function addWalletMovementApi(
    api: AxiosInstance,
    walletMovement: CreateWalletMovement
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.post(`walletMovement`, walletMovement)

    return { response }
}


export async function getWalletMovementsApi(
    api: AxiosInstance,
    searchFilter: WalletMovementSearchFilter
): Promise<{ response: CustomResponseCollection }> {
    const { data: response, headers } = await api.get('walletMovement/getWalletMovementsList', {
        params: searchFilter,
    })
    return { response }
}