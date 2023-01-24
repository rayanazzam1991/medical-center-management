import { BaseConsts } from "/@src/utils/consts/base"
import ar from '/@src/locales/ar.json';
import messages from '@intlify/vite-plugin-vue-i18n/messages';
import { createI18n, DefaultLocaleMessageSchema } from "vue-i18n";
import { defaultEmployee, Employee } from "/@src/models/Employee/employee";
import { defaultVariablePayment, VariablePayment } from "../VariablePayment/variablePayment";
import { defaultUser, User } from "/@src/models/Others/User/user";
import { EmployeeVariablePayment } from "../EmployeVariablePayment/employeeVariablePayment";


const i18n = createI18n<[DefaultLocaleMessageSchema], 'ar' | 'en'>({
    locale: 'ar',
    fallbackLocale: 'en',
    messages: messages
})

export interface ReviewGenerateSalariesRequestBody {
    month: number
    year: number
}
export interface ReviewSalaries {
    salaries: ReviewSalary[]
    salaries_sum: number
}
export interface ReviewSalary {
    employee: Employee
    basic_salary: number
    unjustified_hours: number
    attendance_deduction: number
    variable_payments: EmployeeVariablePayment[]
    net_salary: number
}

export const defaultReviewGenerateSalariesRequestBody: ReviewGenerateSalariesRequestBody = {
    month: new Date().getMonth(),
    year: new Date().getFullYear()
}
export const defaultReviewSalaries: ReviewSalaries = {
    salaries: [],
    salaries_sum: 0.00
}
export const defaultReviewSalary: ReviewSalary = {
    employee: defaultEmployee,
    basic_salary: 0.00,
    unjustified_hours: 0.00,
    attendance_deduction: 0.00,
    variable_payments: [],
    net_salary: 0.00
}


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
            return 'light'
        if (status == this.APPROVED)
            return 'green'
        if (status == this.WAITING)
            return 'blue'
        if (status == this.RELEASED)
            return 'success'
        if (status == this.INACTIVE)
            return 'danger'
        else return undefined;
    }


}

export { EmployeeVariablePaymentConsts }