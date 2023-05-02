import { City, defaultCity } from "../City/city"
import { Room, defaultRoom } from "../Room/room"
import { UserStatus, defaultUserStatus } from "../UserStatus/userStatus"
import { Role } from "/@src/utils/consts/rolesPermissions"

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
    roles?: Role[]
    token?: string
    default_role?: Role
}
export interface CreateUpdateUser {
    id?: number
    first_name: string
    last_name: string
    password: string
    gender?: string
    birth_date?: string
    phone_number: string
    address?: string
    city_id?: number
    room_id?: number
    user_status_id?: number
    default_role_id?: number
    roles: string[]
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
    default_role_id: undefined,
    password: '0000000000',
    roles: []
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
    room: defaultRoom,
    default_role: undefined
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

export enum UserRole {
    ADMIN = 'Admin',
    USER = 'User',
}

export const UserRoles = {
    ADMIN: 'Admin',
    USER: 'User',
}

export const RolePermissions = {
    [UserRole.ADMIN]: ['manageUsers', 'manageSettings'],
    [UserRole.USER]: ['viewProfile', 'editProfile'],
};
