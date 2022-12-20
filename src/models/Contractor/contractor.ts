import { Media, MediaConsts } from "../Others/Media/media"
import { User, CreateUpdateUser, defaultCreateUpdateUser, defaultUser } from "../Others/User/user"
import { BaseConsts } from "/@src/utils/consts/base"

export interface Contractor {
    id?: number
    starting_date: string
    payment_percentage: number
    user: User
    services: Array<CreateUpdateServicesHelper>
    is_completed?: boolean
}
export interface CreateContractor {
    id?: number
    starting_date?: string
    payment_percentage?: number
    user: CreateUpdateUser
    services: Array<CreateUpdateServicesHelper>
    is_completed?: boolean
}
export interface UpdateContractor {
    id?: number
    starting_date?: string
    payment_percentage?: number
    user: CreateUpdateUser
    services: Array<CreateUpdateServicesHelper>
    is_completed?: boolean
}
export interface CreateUpdateServicesHelper {
    service_id: number
    price: number
    contractor_service_amount: number
}
export interface ContractorSearchFilter {
    name?: string
    phone_number?: number
    gender?: string
    date_between?: string
    from?: string
    to?: string
    room_id?: number
    is_completed?: boolean
    user_status_id?: number
    page?: number
    per_page?: number
    order_by?: string
    order?: string
    quick_search?: boolean
}
export const defaultCreateContractor: CreateContractor = {
    id: 0,
    starting_date: '',
    payment_percentage: 0,
    user: defaultCreateUpdateUser,
    services: [],
    is_completed: false,


}
export const defaultUpdateContractor: UpdateContractor = {
    id: 0,
    starting_date: '',
    payment_percentage: 0,
    user: defaultCreateUpdateUser,
    services: [],
    is_completed: false,

}
export const defaultContractor: Contractor = {
    id: 0,
    starting_date: '',
    payment_percentage: 0,
    user: defaultUser,
    services: [],
    is_completed: false,

}

export const defaultContractorSearchFilter: ContractorSearchFilter = {
    name: undefined,
    phone_number: undefined,
    gender: undefined,
    date_between: undefined,
    from: undefined,
    to: undefined,
    room_id: undefined,
    is_completed: undefined,
    user_status_id: undefined,
    page: undefined,
    per_page: 50,
    order_by: undefined,
    order: undefined,
    quick_search: undefined

}

export const defaultContractorPersonalId: Media = {
    id: undefined,
    model_id: 0,
    model_type: MediaConsts.CONTRACTOR_MODEL_ROUTE,
    relative_path: undefined,
    is_featured: '0',

}
const ContractorConsts = BaseConsts
export { ContractorConsts }