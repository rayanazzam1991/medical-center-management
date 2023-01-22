import { CreateWalletMovement, defaultWalletMovement, WalletMovement } from "/@src/models/Contractor/walletMovement"
import { MediaConsts, Media } from "/@src/models/Others/Media/media"
import { CreateUpdateUser } from "/@src/models/Others/User/user"
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
    var walletMovement: WalletMovement = await walletMovementResponse.addWalletMovementStore(newWalletMovementData) ?? defaultWalletMovement
    var success: boolean = walletMovementResponse.success ?? false
    var error_code: string = walletMovementResponse.error_code ?? ''
    var message: string = walletMovementResponse.message ?? ''
    return { success, error_code, message, walletMovement }
}