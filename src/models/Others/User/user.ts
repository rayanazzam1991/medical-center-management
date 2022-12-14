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
    room: Room
    city: City
    status: UserStatus
    role?: string
    token?: string
}
export interface CreateUpdateUser {
    id?: number
    first_name: string
    last_name: string
    password: string
    gender: string
    birth_date: string
    phone_number: string
    address: string
    room_id?: number
    city_id?: number
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
    room_id?: number
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
    gender: '',
    birth_date: '',
    phone_number: '',
    address: '',
    room_id: undefined,
    city_id: 0,
    user_status_id: 0,
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
    room: defaultRoom,
    city: defaultCity,
    status: defaultUserStatus,
    password: '',
    token: undefined,
}

export const defaultUserSearchFilter: UserSearchFilter = {
    name: undefined,
    gender: undefined,
    phone_number: undefined,
    room_id: undefined,
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
