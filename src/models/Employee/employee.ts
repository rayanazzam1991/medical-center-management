import { Media, MediaConsts } from "../Others/Media/media"
import { Nationality, defaultNationality } from "../Others/Nationality/nationality"
import { defaultPosition, Position } from "../Others/Position/position"
import { User, CreateUpdateUser, defaultCreateUpdateUser, defaultUser } from "../Others/User/user"

export interface Employee {
    id?: number
    starting_date: string
    employee_number?: number
    end_date: string
    basic_salary: number
    user: User
    nationality: Nationality
    position: Position
}
export interface CreateEmployee {
    id?: number
    starting_date?: string
    end_date?: string
    user: CreateUpdateUser
    basic_salary?: number
    nationality_id?: number
    position_id?: number
}
export interface UpdateEmployee {
    id?: number
    starting_date?: string
    end_date?: string
    user: CreateUpdateUser
    basic_salary?: number
    nationality_id?: number
    position_id?: number

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
}
export const defaultCreateEmployee: CreateEmployee = {
    id: 0,
    starting_date: '',
    end_date: '',
    user: defaultCreateUpdateUser,
    nationality_id: 0,
    position_id: 0,
    basic_salary: 0,
}
export const defaultUpdateEmployee: UpdateEmployee = {
    id: 0,
    starting_date: '',
    end_date: '',
    user: defaultCreateUpdateUser,
    nationality_id: 0,
    position_id: 0,
    basic_salary: 0,
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
}
export const defaultEmployeeSearchFilter = <Partial<EmployeeSearchFilter>>{}

export const defaultEmployeeProfilePic: Media = {
    id: undefined,
    model_id: 0,
    model_type: MediaConsts.EMPLOYEE_MODEL_ROUTE,
    relative_path: undefined,
    is_featured: '1',
    uploaded_by:undefined

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
    uploaded_by:undefined


}
