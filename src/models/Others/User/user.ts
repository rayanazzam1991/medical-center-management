import { City, defaultCity } from "../City/city"
import { Room, defaultRoom } from "../Room/room"
import { UserStatus, defaultUserStatus } from "../UserStatus/userStatus"

export interface User {
    id?: number
    first_name: string
    last_name: string
    password: string
    gender: string
    birth_date?: string
    phone_number: string
    address: string
    city: City
    room: Room
    status: UserStatus
    role?: string
    token?: string
}
export interface CreateUpdateUser {
    id?: number
    first_name: string
    last_name: string
    password: string
    gender?: string
    birth_date?: string
    phone_number: string
    address: string
    city_id?: number
    room_id?: number
    user_status_id?: number
}
export interface ChangeUserStatus {
    id?: number
    user_status_id?: number
}
export interface UserSearchFilter {
    name?: string
    gender?: string
    phone_number?: string
    city_id?: number
    user_status_id?: number
    page?: number
    per_page?: number
    order_by?: string
    order?: string
}
export const defaultCreateUpdateUser: CreateUpdateUser = {
    id: undefined,
    first_name: '',
    last_name: '',
    gender: undefined,
    birth_date: '',
    phone_number: '',
    address: '',
    city_id: undefined,
    room_id: undefined,
    user_status_id: undefined,
    password: '0000000000',
}
export const defaultChangeStatusUser: ChangeUserStatus = {
    id: undefined,
    user_status_id: 0,
}
export const defaultUser: User = {
    id: 0,
    first_name: '',
    last_name: '',
    gender: '',
    birth_date: '',
    phone_number: '',
    address: '',
    city: defaultCity,
    status: defaultUserStatus,
    password: '',
    token: undefined,
    room: defaultRoom
}

export const defaultUserSearchFilter: UserSearchFilter = {
    name: undefined,
    gender: undefined,
    phone_number: undefined,
    city_id: undefined,
    user_status_id: undefined,
    page: undefined,
    order: undefined,
    order_by: undefined,
    per_page: undefined,
}
const staticNumber = Object.freeze({
    Syria: '963',
    Iraq: '964',
})
