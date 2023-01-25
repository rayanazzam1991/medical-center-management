import { BaseConsts } from "/@src/utils/consts/base"
import ar from '/@src/locales/ar.json';
import messages from '@intlify/vite-plugin-vue-i18n/messages';
import { createI18n, DefaultLocaleMessageSchema } from "vue-i18n";
import { defaultEmployee, Employee } from "/@src/models/Employee/employee";
import { defaultVariablePayment, VariablePayment } from "../VariablePayment/variablePayment";
import { defaultUser, User } from "/@src/models/Others/User/user";


const i18n = createI18n<[DefaultLocaleMessageSchema], 'ar' | 'en'>({
    locale: 'ar',
    fallbackLocale: 'en',
    messages: messages
})

export interface EmployeeVariablePayment {
    id: number
    employee: Employee
    variable_payment: VariablePayment
    amount: number
    note?: string
    due_date?: string
    release_date?: string
    status: number
    created_at: string
    created_by: User
}
export interface UpdateEmployeeVariablePayment {
    employee_id?: number
    variable_payment_id?: number
    amount?: number
    note?: string
    due_date?: string
    status?: number
}
export interface CreateEmployeeVariablePayment {
    employee_id: number
    variable_payment_id: number
    amount: number
    note?: string
    due_date?: string
    status: number
}
export interface EmployeeVariablePaymentSearchFilter {

    name?: string
    type?: number
    status?: number
    from?: string
    to?: string
    page?: number
    per_page?: number
    order_by?: string
    order?: string
}

export const defaultEmployeeVariablePayment: EmployeeVariablePayment = {
    id: 0,
    employee: defaultEmployee,
    variable_payment: defaultVariablePayment,
    amount: 0,
    note: undefined,
    due_date: undefined,
    release_date: undefined,
    status: 1,
    created_at: '',
    created_by: defaultUser

}
export const defaultUpdateEmployeeVariablePayment = <UpdateEmployeeVariablePayment>{}
export const defaultCreateEmployeeVariablePayment = <CreateEmployeeVariablePayment>{}
export const defaultEmployeeVariablePaymentSearchFilter = <EmployeeVariablePaymentSearchFilter>{}


class EmployeeVariablePaymentConsts {
    static readonly PENDING = 1;
    static readonly APPROVED = 2;
    static readonly WAITING = 3;
    static readonly RELEASED = 4;
    static readonly INACTIVE = 5;

    public static getStatusName(status: number) {
        if (status == this.PENDING)
            return i18n.global.t('employee_variable_payment_statuses.pending')
        if (status == this.APPROVED)
            return i18n.global.t('employee_variable_payment_statuses.approved')
        if (status == this.WAITING)
            return i18n.global.t('employee_variable_payment_statuses.waiting')
        if (status == this.RELEASED)
            return i18n.global.t('employee_variable_payment_statuses.released')
        if (status == this.INACTIVE)
            return i18n.global.t('employee_variable_payment_statuses.inactive')
        else return '';
    }
    public static getStatusColor(status: number) {
        if (status == this.PENDING)
            return 'orange'
        if (status == this.APPROVED)
            return 'green'
        if (status == this.WAITING)
            return 'blue'
        if (status == this.RELEASED)
            return 'primary'
        if (status == this.INACTIVE)
            return 'danger'
        else return undefined;
    }


}

export { EmployeeVariablePaymentConsts }