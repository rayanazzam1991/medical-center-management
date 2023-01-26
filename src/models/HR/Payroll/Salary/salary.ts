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
export interface DeliveringSalariesSearchFilter {
    page?: number
    per_page?: number
    order_by?: string
    order?: string
}
export interface OnholdSalariesSearchFilter {
    page?: number
    per_page?: number
    order_by?: string
    order?: string
}
export interface SalarySearchFilter {
    name?: string
    department_id?: number
    from?: string
    to?: string
    page?: number
    per_page?: number
    order_by?: string
    order?: string
}
export interface DeliveringSalary {
    id: number
    employee: Employee
    net_salary: number
    status: number
    updated_at?: string
    created_at?: string
}
export interface OnholdSalary {
    id: number
    employee: Employee
    net_salary: number
    status: number
    updated_at?: string
    created_at?: string
}
export interface Salary {
    id: number
    employee: Employee
    basic_salary: number
    variable_payments: EmployeeVariablePayment[]
    attendance_deduction: number
    net_salary: number
    status: number
    updated_at?: string
    created_at?: string
}

export const defaultDeliveringSalariesSearchFilter = <Partial<DeliveringSalariesSearchFilter>>{}
export const defaultOnholdSalariesSearchFilter = <Partial<OnholdSalariesSearchFilter>>{}
export const defaultSalarySearchFilter = <Partial<SalarySearchFilter>>{}

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
export const defaultSalary: Salary = {
    id: 0,
    employee: defaultEmployee,
    basic_salary: 0.00,
    variable_payments: [],
    attendance_deduction: 0.00,
    net_salary: 0.00,
    status: 1,
    updated_at: undefined,
    created_at: undefined,
}
export const defaultDeliveringSalary: DeliveringSalary = {
    id: 0,
    employee: defaultEmployee,
    net_salary: 0.00,
    status: 1,
    updated_at: undefined,
    created_at: undefined,
}
export const defaultOnholdSalary: OnholdSalary = {
    id: 0,
    employee: defaultEmployee,
    net_salary: 0.00,
    status: 3,
    updated_at: undefined,
    created_at: undefined,
}


class SalaryConsts {

    static readonly PENDING = 1;
    static readonly PAID = 2;
    static readonly ONHOLD = 3;
    static readonly RETURNED = 4;

    public static getStatusName(status: number) {
        if (status == this.PENDING)
            return i18n.global.t('salary_statuses.pending')
        if (status == this.PAID)
            return i18n.global.t('salary_statuses.paid')
        if (status == this.ONHOLD)
            return i18n.global.t('salary_statuses.onhold')
        if (status == this.RETURNED)
            return i18n.global.t('salary_statuses.returned')
        else return '';
    }
    public static getStatusColor(status: number) {
        if (status == this.PENDING)
            return 'orange'
        if (status == this.PAID)
            return 'success'
        if (status == this.ONHOLD)
            return 'warning'
        if (status == this.RETURNED)
            return 'danger'
        else return undefined;
    }
}
export { SalaryConsts }
