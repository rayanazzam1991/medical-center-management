import { CreateWalletMovement, defaultWalletMovement, WalletMovement, WalletMovementSearchFilter } from "/@src/models/Contractor/walletMovement"
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
    const category = useWalletMovement()
    await category.getWalletMovementsStore(searchFilter)
    var walletMovements: WalletMovement[] = category.walletMovements
    var pagination: Pagination = category.pagination
    var success: boolean = category.success ?? false
    var error_code: string = category.error_code ?? ''
    var message: string = category.message ?? ''
    return { walletMovements, pagination, success, error_code, message }

}