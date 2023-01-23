import { CreateWalletMovement, defaultWalletMovement, WalletMovement } from "/@src/models/Contractor/walletMovement"
import { useWalletMovement } from "/@src/stores/Contractor/WalletMovement/walletMovementStore"
import { Pagination } from "/@src/utils/response"

export async function addWalletMovement(walletMovementData: CreateWalletMovement) {
    const walletMovementResponse = useWalletMovement()
    let walletMovement: WalletMovement = await walletMovementResponse.addWalletMovementStore(walletMovementData) ?? defaultWalletMovement
    let success: boolean = walletMovementResponse.success ?? false
    let error_code: string = walletMovementResponse.error_code ?? ''
    let message: string = walletMovementResponse.message ?? ''
    return { success, error_code, message, walletMovement }
}