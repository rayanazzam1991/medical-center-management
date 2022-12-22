import { CustomerGroup, defaultCustomerGroup } from "../../Others/CustomerGroup/customerGroup"
import { Media, MediaConsts } from "../../Others/Media/media"
import { User, CreateUpdateUser, defaultCreateUpdateUser, defaultUser } from "../../Others/User/user"
import { MedicalInfo, defaultMedicalInfo } from "../MedicalInfo/medicalInfo"
import { BaseConsts } from "/@src/utils/consts/base"

export interface Customer {
    id?: number
    emergency_contact_name: string
    emergency_contact_phone: string
    user: User
    medical_info: MedicalInfo
    customer_group: CustomerGroup
    social_medias: Array<CreateUpdateCustomerSocialMediaHelper>
    is_completed?: boolean
}
export interface CreateCustomer {
    id?: number
    emergency_contact_name?: string
    emergency_contact_phone?: string
    user: CreateUpdateUser
    medical_info_id?: number
    customer_group_id?: number
    social_medias: Array<CreateUpdateCustomerSocialMediaHelper>
    is_completed?: boolean
}
export interface UpdateCustomer {
    id?: number
    emergency_contact_name?: string
    emergency_contact_phone?: string
    user: CreateUpdateUser
    medical_info: MedicalInfo
    customer_group_id?: number
    social_medias: Array<CreateUpdateCustomerSocialMediaHelper>
    is_completed?: boolean
}
export interface CreateUpdateCustomerSocialMediaHelper {
    social_media_id: number
    url: string
}
export interface CustomerSearchFilter {
    name?: string
    phone_number?: number
    date_between?: string
    from?: string
    to?: string
    customer_group_id?: number
    is_completed?: boolean
    user_status_id?: number
    page?: number
    per_page?: number
    order_by?: string
    order?: string
    quick_search?: boolean
}
export const defaultCreateCustomer: CreateCustomer = {
    id: 0,
    emergency_contact_name: '',
    emergency_contact_phone: '',
    user: defaultCreateUpdateUser,
    medical_info_id: undefined,
    customer_group_id: 1,
    social_medias: [],
    is_completed: false,

}
export const defaultUpdateCustomer: UpdateCustomer = {
    id: 0,
    emergency_contact_name: '',
    emergency_contact_phone: '',
    user: defaultCreateUpdateUser,
    medical_info: defaultMedicalInfo,
    customer_group_id: 1,
    social_medias: [],
    is_completed: false,

}
export const defaultCustomer: Customer = {
    id: 0,
    emergency_contact_name: '',
    emergency_contact_phone: '',
    user: defaultUser,
    medical_info: defaultMedicalInfo,
    customer_group: defaultCustomerGroup,
    social_medias: [],
    is_completed: false,

}
export const defaultCustomerProfilePic: Media = {
    id: undefined,
    model_id: 0,
    model_type: MediaConsts.CUSTOMER_MODEL_ROUTE,
    relative_path: undefined,
    is_featured: '0',

}

export const defaultCustomerSearchFilter: CustomerSearchFilter = {
    name: undefined,
    phone_number: undefined,
    date_between: undefined,
    from: undefined,
    to: undefined,
    customer_group_id: undefined,
    is_completed: undefined,
    user_status_id: undefined,
    page: undefined,
    per_page: 50,
    order_by: undefined,
    order: undefined,
    quick_search: undefined

}
const CustomerConsts = BaseConsts
export { CustomerConsts }