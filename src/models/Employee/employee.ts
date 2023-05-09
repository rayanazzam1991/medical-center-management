import messages from "@intlify/vite-plugin-vue-i18n/messages"
import { createI18n, DefaultLocaleMessageSchema } from "vue-i18n"
import { Media, MediaConsts } from "../Others/Media/media"
import { Nationality, defaultNationality } from "../Others/Nationality/nationality"
import { defaultPosition, Position } from "../Others/Position/position"
import { defaultService, Service } from "../Others/Service/service"
import { User, CreateUpdateUser, defaultCreateUpdateUser, defaultUser } from "../Others/User/user"

const i18n = createI18n<[DefaultLocaleMessageSchema], 'ar' | 'en'>({
    locale: 'ar',
    fallbackLocale: 'en',
    messages: messages
})

export interface Employee {
    id?: number
    starting_date: string
    employee_number?: number
    end_date: string
    basic_salary: number
    user: User
    nationality: Nationality
    position: Position
    payment_percentage: number
    type: number,
    is_dismissed: boolean
    services: EmployeeService[],
    media?: Media[]
}
export interface CreateEmployee {
    id?: number
    starting_date?: string
    end_date?: string
    user: CreateUpdateUser
    basic_salary?: number
    nationality_id?: number
    position_id?: number
    type: number
    payment_percentage: number
}
export interface UpdateEmployee {
    id?: number
    starting_date?: string
    end_date?: string
    user: CreateUpdateUser
    basic_salary?: number
    nationality_id?: number
    position_id?: number
    type: number
    payment_percentage: number,
    services: CreateUpdateServicesHelper[]
}
export interface EmployeeSearchFilter {
    name?: string
    phone_number?: number
    position_id?: number
    date_between?: string
    from?: string
    to?: string
    user_status_id?: number
    page?: number
    per_page?: number
    order_by?: string
    order?: string
    quick_search?: boolean
    is_salaries_related?: boolean
}
export interface EmployeeService {
    id: number
    service: Service
    price: number
}
export const defaultCreateEmployee: CreateEmployee = {
    id: 0,
    starting_date: '',
    end_date: '',
    user: defaultCreateUpdateUser,
    nationality_id: 0,
    position_id: 0,
    basic_salary: 0,
    type: 1,
    payment_percentage: 0
}
export interface CreateUpdateServicesHelper {
    service_id: number
    price: number
}

export const defaultUpdateEmployee: UpdateEmployee = {
    id: 0,
    starting_date: '',
    end_date: '',
    user: defaultCreateUpdateUser,
    nationality_id: 0,
    position_id: 0,
    basic_salary: 0,
    type: 1,
    payment_percentage: 1,
    services: []
}
export const defaultEmployeeService: EmployeeService = {
    id: 0,
    price: 0,
    service: defaultService
}
export const defaultEmployee: Employee = {
    id: 0,
    starting_date: '',
    end_date: '',
    nationality: defaultNationality,
    position: defaultPosition,
    basic_salary: 0,
    user: defaultUser,
    employee_number: undefined,
    payment_percentage: 0,
    type: 1,
    services: [],
    is_dismissed: false,
    media: undefined
}
export const defaultEmployeeSearchFilter = <Partial<EmployeeSearchFilter>>{}

export const defaultEmployeeProfilePic: Media = {
    id: undefined,
    model_id: 0,
    model_type: MediaConsts.EMPLOYEE_MODEL_ROUTE,
    relative_path: undefined,
    is_featured: '1',
    uploaded_by: undefined

}
export const defaultEmployeeFiles: Media = {
    id: undefined,
    model_id: 0,
    model_type: MediaConsts.EMPLOYEE_MODEL_ROUTE,
    relative_path: undefined,
    is_featured: '0',
    file_name: undefined,
    mime_type: undefined,
    size: undefined,
    created_at: undefined,
    uploaded_by: undefined
}
class EmployeeConsts {
    static readonly TYPE_SALARIED_EMPLOYEE = 1;
    static readonly TYPE_COMMISSION_BASED_EMPLOYEE = 2;
    static readonly TYPE_HYBRID_EMPLOYEE = 3;

    static readonly EMPLOYEE_TYPES = [this.TYPE_SALARIED_EMPLOYEE, this.TYPE_COMMISSION_BASED_EMPLOYEE, this.TYPE_HYBRID_EMPLOYEE]

    public static getTypeName(type: number) {
        if (type == this.TYPE_SALARIED_EMPLOYEE)
            return i18n.global.t('employee_types.salaried')
        if (type == this.TYPE_COMMISSION_BASED_EMPLOYEE)
            return i18n.global.t('employee_types.commission_based')
        if (type == this.TYPE_HYBRID_EMPLOYEE)
            return i18n.global.t('employee_types.hybrid')
        else return '';
    }
}
export { EmployeeConsts }
