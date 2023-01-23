import { AxiosInstance } from "axios"
import { CustomResponseSingle } from "/@src/utils/response"
import { CreateWalletMovement } from "/@src/models/Contractor/walletMovement"


export async function addWalletMovementApi(
    api: AxiosInstance,
    walletMovement: CreateWalletMovement
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.post(`walletMovement`, walletMovement)

    return { response }
}