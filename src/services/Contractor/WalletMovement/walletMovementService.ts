import { CreateWalletMovement, defaultWalletMovement, WalletMovement } from "/@src/models/Contractor/walletMovement"
import { useWalletMovement } from "/@src/stores/Contractor/WalletMovement/walletMovementStore"
import { Pagination } from "/@src/utils/response"

export async function addWalletMovement(
    walletMovementData: CreateWalletMovement,
) {
    const newWalletMovementData: CreateWalletMovement = {
        type: walletMovementData.type,
        action: walletMovementData.action,
        total: walletMovementData.total,
        wallet_id: walletMovementData.wallet_id,
        note: walletMovementData.note,
    }
    const walletMovementResponse = useWalletMovement()
    let walletMovement: WalletMovement = await walletMovementResponse.addWalletMovementStore(newWalletMovementData) ?? defaultWalletMovement
    let success: boolean = walletMovementResponse.success ?? false
    let error_code: string = walletMovementResponse.error_code ?? ''
    let message: string = walletMovementResponse.message ?? ''
    return { success, error_code, message, walletMovement }
}