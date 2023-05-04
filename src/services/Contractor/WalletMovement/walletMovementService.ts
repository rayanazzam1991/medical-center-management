import { CreateBulkCashOut, CreateWalletMovement, defaultCreateBulkCashOut, defaultWalletMovement, WalletMovement, WalletMovementSearchFilter } from "/@src/models/Contractor/walletMovement"
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

export async function getWalletMovementsList(searchFilter: WalletMovementSearchFilter) {
    const wallet_movement = useWalletMovement()
    await wallet_movement.getWalletMovementsStore(searchFilter)
    let walletMovements: WalletMovement[] = wallet_movement.walletMovements
    let pagination: Pagination = wallet_movement.pagination
    let success: boolean = wallet_movement.success ?? false
    let error_code: string = wallet_movement.error_code ?? ''
    let message: string = wallet_movement.message ?? ''
    return { walletMovements, pagination, success, error_code, message }

}

export async function addBulkCashOutsList(bulkCashOutData: CreateBulkCashOut) {
    const bulkCashOut = useWalletMovement()
    await bulkCashOut.createBulkCashOutStore(bulkCashOutData)
    let success: boolean = bulkCashOut.success ?? false
    let error_code: string = bulkCashOut.error_code ?? ''
    let message: string = bulkCashOut.message ?? ''
    return { success, error_code, message }
}