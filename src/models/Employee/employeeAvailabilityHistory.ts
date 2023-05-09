import messages from '@intlify/vite-plugin-vue-i18n/messages';
import { createI18n, DefaultLocaleMessageSchema } from "vue-i18n";
import { Employee } from './employee';
import { User } from '../Others/User/user';


const i18n = createI18n<[DefaultLocaleMessageSchema], 'ar' | 'en'>({
    locale: 'ar',
    fallbackLocale: 'en',
    messages: messages
})
export interface EmployeeAvailabilityHistorySearchFilter {
    employees_id?: number[]
    is_available?: boolean
    page?: number
    per_page?: number
    order_by?: string
    order?: string
}
export interface EmployeeAvailabilityHistory {
    id: number
    employee: Employee
    is_available: boolean
    creation_date: string
    creation_time: string
    created_by?: User
}

export const defaultemployeeAvailabilityHistorySearchFilter = <EmployeeAvailabilityHistorySearchFilter>{}





