import { Wallet, WalletSearchFilter } from "/@src/models/Contractor/wallet"
import { useWallet } from "/@src/stores/Contractor/Wallet/walletStore"


export async function getWalletsList(searchFilter: WalletSearchFilter) {
    const wallet_movement = useWallet()
    await wallet_movement.getWalletsStore(searchFilter)
    let wallets: Wallet[] = wallet_movement.wallets
    let success: boolean = wallet_movement.success ?? false
    let error_code: string = wallet_movement.error_code ?? ''
    let message: string = wallet_movement.message ?? ''
    return { wallets, success, error_code, message }

}