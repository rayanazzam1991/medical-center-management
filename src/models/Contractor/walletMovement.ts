import { Contractor, defaultContractor } from "./contractor"
import { defaultWallet, Wallet } from "./wallet"
import { BaseConsts } from "/@src/utils/consts/base"
import { createI18n, DefaultLocaleMessageSchema } from 'vue-i18n';
import ar from '/@src/locales/ar.json';
import messages from "@intlify/vite-plugin-vue-i18n/messages";
import { User } from "../Others/User/user";
import exp from "constants";


const i18n = createI18n<[DefaultLocaleMessageSchema], 'ar' | 'en'>({
    locale: 'ar',
    fallbackLocale: 'en',
    messages: messages
})

export interface WalletMovement {
    id?: number
    type: string
    action: string
    wallet: Wallet
    total: number
    note?: string
}

export interface CreateWalletMovement {
    id?: number
    type: string
    action: string
    wallet_id: number
    total: number
    note?: string

}
export interface createCashOut {
    wallet_id: number
    total: number
    contractor_id: number
}
export interface CreateBulkCashOut {
    bulkCashOuts: createCashOut[]
}


export interface WalletMovementSearchFilter {
    contractor_name?: string
    created_by?: User
    date_between?: string
    from?: string
    to?: string
    action?: string
    page?: number
    per_page?: number
    order_by?: string
    order?: string
}

export const defaultWalletMovement: WalletMovement = {
    id: 0,
    type: '',
    action: '',
    wallet: defaultWallet,
    total: 0,
    note: ''

}

export const defaultCreateWalletMovement: CreateWalletMovement = {
    id: 0,
    type: '',
    action: '',
    wallet_id: 0,
    total: 0,
    note: ''
}
export const defaultCreateBulkCashOut: CreateBulkCashOut = {
    bulkCashOuts: [],
}

export const defaultWalletMovementSearchFilter: WalletMovementSearchFilter = {
    contractor_name: undefined,
    created_by: undefined,
    date_between: undefined,
    from: undefined,
    to: undefined,
    action: 'cash_out',
    page: undefined,
    per_page: undefined,
    order_by: 'created_at',
    order: 'desc',
}
class WalletMovementConsts extends BaseConsts {
    static readonly OUT = 'out'
    static readonly IN = 'in'
    static readonly CASH_OUT = 'cash_out'

    public static showTypeName(type: string): string {
        if (type === WalletMovementConsts.OUT)
            return i18n.global.t('Wallet_movement_types.out')

        if (type === WalletMovementConsts.IN)
            return i18n.global.t('Wallet_movement_types.in')
        return ''
    }

    public static showActionName(type: string): string {
        if (type === WalletMovementConsts.CASH_OUT)
            return i18n.global.t('Wallet_movement_actions.cash_out')
        return ''
    }
}

export { WalletMovementConsts }