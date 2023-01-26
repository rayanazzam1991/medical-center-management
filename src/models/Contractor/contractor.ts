import { Media, MediaConsts } from "../Others/Media/media"
import { defaultSpeciality, Speciality } from "../Others/Speciality/speciality"
import { User, CreateUpdateUser, defaultCreateUpdateUser, defaultUser } from "../Others/User/user"
import { defaultWallet, Wallet } from "./wallet"
import { BaseConsts } from "/@src/utils/consts/base"

export interface Contractor {
    id?: number
    starting_date: string
    end_date: string
    speciality: Speciality
    payment_percentage: number
    user: User
    services: Array<CreateUpdateServicesHelper>
    is_completed?: boolean
}
export interface CreateContractor {
    id?: number
    starting_date: string
    end_date?: string
    speciality_id: number
    payment_percentage?: number
    user: CreateUpdateUser
    services: Array<CreateUpdateServicesHelper>
    is_completed?: boolean
}
export interface UpdateContractor {
    id?: number
    starting_date: string
    end_date?: string
    speciality_id: number
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
    date_between?: string
    from?: string
    to?: string
    room_id?: number
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
    end_date: undefined,
    speciality_id: 0,


}
export const defaultUpdateContractor: UpdateContractor = {
    id: 0,
    starting_date: '',
    payment_percentage: 0,
    user: defaultCreateUpdateUser,
    services: [],
    is_completed: false,
    end_date: '',
    speciality_id: 0

}
export const defaultContractor: Contractor = {
    id: 0,
    starting_date: '',
    payment_percentage: 0,
    user: defaultUser,
    services: [],
    is_completed: false,
    end_date: '',
    speciality: defaultSpeciality,
}

export const defaultContractorSearchFilter: ContractorSearchFilter = {
    name: undefined,
    phone_number: undefined,
    date_between: undefined,
    from: undefined,
    to: undefined,
    room_id: undefined,
    user_status_id: undefined,
    page: undefined,
    per_page: 50,
    order_by: undefined,
    order: undefined,
    quick_search: undefined

}

export const defaultContractorProfilePic: Media = {
    id: undefined,
    model_id: 0,
    model_type: MediaConsts.CONTRACTOR_MODEL_ROUTE,
    relative_path: undefined,
    is_featured: '1',
    uploaded_by: undefined

}
export const defaultContractorFiles: Media = {
    id: undefined,
    model_id: 0,
    model_type: MediaConsts.CONTRACTOR_MODEL_ROUTE,
    relative_path: undefined,
    is_featured: '0',
    file_name: undefined,
    mime_type: undefined,
    size: undefined,
    created_at: undefined,
    uploaded_by: undefined

}

const ContractorConsts = BaseConsts
export { ContractorConsts }