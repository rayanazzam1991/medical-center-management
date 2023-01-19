import { Contractor, defaultContractor } from "./contractor"
import { BaseConsts } from "/@src/utils/consts/base"

export interface Wallet {
    id?: number
    amount: number
    status: number
}

export const defaultWallet: Wallet = {
    id: 0,
    amount: 0,
    status: 1,
}
const WalletConsts = BaseConsts
export { WalletConsts }