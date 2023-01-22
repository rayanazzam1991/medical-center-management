import { Contractor, defaultContractor } from "./contractor"
import { defaultWallet, Wallet } from "./wallet"
import { BaseConsts } from "/@src/utils/consts/base"
import { createI18n, DefaultLocaleMessageSchema } from 'vue-i18n';
import ar from '/@src/locales/ar.json';
import messages from "@intlify/vite-plugin-vue-i18n/messages";


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