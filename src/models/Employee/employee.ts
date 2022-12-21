import { Media, MediaConsts } from "../Others/Media/media"
import { Nationality, defaultNationality } from "../Others/Nationality/nationality"
import { User, CreateUpdateUser, defaultCreateUpdateUser, defaultUser } from "../Others/User/user"

export interface Employee {
    id?: number
    starting_date: string
    end_date: string
    basic_salary: number
    user: User
    nationality: Nationality
}
export interface CreateEmployee {
    id?: number
    starting_date?: string
    end_date?: string
    user: CreateUpdateUser
    basic_salary?: number
    nationality_id?: number
}
export interface UpdateEmployee {
    id?: number
    starting_date?: string
    end_date?: string
    user: CreateUpdateUser
    basic_salary?: number
    nationality_id?: number
}
export interface EmployeeSearchFilter {
    name?: string
    phone_number?: number
    gender?: string
    date_between?: string
    from?: string
    to?: string
    city_id?: number
    nationality_id?: number
    user_status_id?: number
    page?: number
    per_page?: number
    order_by?: string
    order?: string
    quick_search?: boolean
}
export const defaultCreateEmployee: CreateEmployee = {
    id: 0,
    starting_date: '',
    end_date: '',
    user: defaultCreateUpdateUser,
    nationality_id: 0,
    basic_salary: 0,
}
export const defaultUpdateEmployee: UpdateEmployee = {
    id: 0,
    starting_date: '',
    end_date: '',
    user: defaultCreateUpdateUser,
    nationality_id: 0,
    basic_salary: 0,
}
export const defaultEmployee: Employee = {
    id: 0,
    starting_date: '',
    end_date: '',
    nationality: defaultNationality,
    basic_salary: 0,
    user: defaultUser,
}
export const defaultEmployeeSearchFilter: EmployeeSearchFilter = {
    name: undefined,
    phone_number: undefined,
    gender: undefined,
    date_between: undefined,
    from: undefined,
    to: undefined,
    city_id: undefined,
    nationality_id: undefined,
    user_status_id: undefined,
    page: undefined,
    per_page: undefined,
    order_by: undefined,
    order: undefined,
    quick_search: undefined,
}
export const defaultEmployeePersonalId: Media = {
    id: undefined,
    model_id: 0,
    model_type: MediaConsts.EMPLOYEE_MODEL_ROUTE,
    relative_path: undefined,
    is_featured: '0',

}
