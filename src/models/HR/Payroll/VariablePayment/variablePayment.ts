import { BaseConsts } from "/@src/utils/consts/base"
import ar from '/@src/locales/ar.json';
import messages from '@intlify/vite-plugin-vue-i18n/messages';
import { createI18n, DefaultLocaleMessageSchema } from "vue-i18n";


const i18n = createI18n<[DefaultLocaleMessageSchema], 'ar' | 'en'>({
    locale: 'ar',
    fallbackLocale: 'en',
    messages: messages
})

export interface VariablePayment {
    id: number
    name: string
    type: number
    status: number
    created_at: string
}
export interface UpdateVariablePayment {
    name?: string
    type: number
    status?: number
}
export interface CreateVariablePayment {
    name: string
    type: number
    status?: number

}
export interface VariablePaymentSearchFilter {

    name?: string
    type?: number
    status?: number
    date_between?: string
    from?: string
    to?: string
    page?: number
    per_page?: number
    order_by?: string
    order?: string
}

export const defaultVariablePayment: VariablePayment = {
    id: 0,
    name: '',
    type: 1,
    status: 1,
    created_at: ''

}
export const defaultUpdateVariablePayment = <UpdateVariablePayment>{}
export const defaultCreateVariablePayment = <CreateVariablePayment>{}
export const defaultVariablePaymentSearchFilter = <VariablePaymentSearchFilter>{}


class VariablePaymentConsts extends BaseConsts {
    static readonly INCREMENT_TYPE = 1;
    static readonly DECREMENT_TYPE = 2;

    public static getTypeName(type: number) {
        if (type == this.INCREMENT_TYPE)
            return i18n.global.t('variable_payment_types.increment')
        if (type == this.DECREMENT_TYPE)
            return i18n.global.t('variable_payment_types.decrement')
        else return '';
    }


}

export { VariablePaymentConsts }