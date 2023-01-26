import { ContractorWithOutWallet, defaultContractorWithOutWallet } from "./contractor"
import { BaseConsts } from "/@src/utils/consts/base"

export interface Wallet {
    id?: number
    amount: number
    status: number
    created_at: string
}
export interface WalletSearchFilter {
    order_by?: string,
    order?: string,
}

export const defaultWallet: Wallet = {
    id: 0,
    amount: 0,
    status: 1,
    created_at: '',
}
export const defaultWalletSearchFilter: WalletSearchFilter = {
    order_by: 'amount',
    order: "desc"
}

const WalletConsts = BaseConsts
export { WalletConsts }