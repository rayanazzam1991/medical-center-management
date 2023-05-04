import { ChartOfAccount } from "../ChartOfAccount/chartOfAccount"
import { Currency } from "../Currency/currency"
import { createI18n, DefaultLocaleMessageSchema } from 'vue-i18n';
import messages from "@intlify/vite-plugin-vue-i18n/messages";
import { Account, defaultAccount } from "../Account/account";

const i18n = createI18n<[DefaultLocaleMessageSchema], 'ar' | 'en'>({
    locale: 'ar',
    fallbackLocale: 'en',
    messages: messages
})

export interface AccountContact {
    id: number
    contactable_type: string
    contactable_id: number
    account: Account
    is_expense_account: boolean
}

export const defaultAccountContact: AccountContact = {
    id: 0,
    contactable_type: '',
    contactable_id: 0,
    account: defaultAccount,
    is_expense_account: false,
}




