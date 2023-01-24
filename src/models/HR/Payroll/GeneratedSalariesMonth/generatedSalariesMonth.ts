import messages from "@intlify/vite-plugin-vue-i18n/messages"
import { createI18n, DefaultLocaleMessageSchema } from "vue-i18n"


const i18n = createI18n<[DefaultLocaleMessageSchema], 'ar' | 'en'>({
    locale: 'ar',
    fallbackLocale: 'en',
    messages: messages
})

export interface GeneratableMonth {
    month: number
    year: number
}
export interface GeneratedSalariesMonth {
    id: number
    generated_from: string
    generated_to: string
    month_number: number
    year: number
    created_at: string
}
export const defaultGeneratableMonth: GeneratableMonth = {
    month: 1,
    year: 1
}
export const defaultGeneratedSalariesMonth: GeneratedSalariesMonth = {
    id: 0,
    generated_from: '',
    generated_to: '',
    month_number: 0,
    year: 0,
    created_at: ''
}


class EmployeeVariablePaymentConsts {


}

export { EmployeeVariablePaymentConsts }