export interface UserStatus {
    id?: number
    name: string
}
export interface UserStatusSearchFilter {
    name?: string
    page?: number
    per_page?: number
    order_by?: string
    order?: string
}
export const defaultUserStatus: UserStatus = {
    id: 0,
    name: '',
}

export const defaultUserStatusSearchFilter: UserStatusSearchFilter = {
    name: undefined,
    page: undefined,
    order: undefined,
    order_by: undefined,
    per_page: undefined,
}
