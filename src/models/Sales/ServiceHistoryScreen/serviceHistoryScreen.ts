import { Department } from "../../Others/Department/department"
import { Room } from "../../Others/Room/room"
import { Service } from "../../Others/Service/service"
import { defaultUser, User } from "../../Others/User/user"



export interface CreateUpdateServiceHistoryScreen {
    name: string
    filters: CreateUpdateServiceHistoryScreenFilters
}
export interface ServiceHistoryScreen {
    id: number
    name: string
    filters: ServiceHistoryScreenFilters
    status: number
    created_at: string
    created_by: User
}
export interface CreateUpdateServiceHistoryScreenFilters {
    rooms: number[]
    departments: number[]
    services: number[]
}
export interface ServiceHistoryScreenFilters {
    rooms: Room[]
    departments: Department[]
    services: Service[]
}
export interface CreateUpdateServiceHistoryScreenHelper {
    model_id: number
    model_type: 'Service' | 'Room' | 'Department' | undefined
}

export interface ServiceHistoryScreenSearchFilter {
    page?: number
    per_page?: number
    order_by?: string
    order?: string
}

export const defaultCreateUpdateServiceHistoryScreenFilters: CreateUpdateServiceHistoryScreenFilters = {
    departments: [],
    rooms: [],
    services: []
}

export const defaultCreateUpdateServiceHistoryScreen: CreateUpdateServiceHistoryScreen = {
    name: '',
    filters: defaultCreateUpdateServiceHistoryScreenFilters,

}

export const defaultServiceHistoryScreenFilters: ServiceHistoryScreenFilters = {
    departments: [],
    rooms: [],
    services: []
}
export const defaultServiceHistoryScreen: ServiceHistoryScreen = {
    name: '',
    filters: defaultServiceHistoryScreenFilters,
    created_at: '',
    id: 0,
    status: 1,
    created_by: defaultUser

}
export const defaultServiceHistoryScreenSearchFilter = <ServiceHistoryScreenSearchFilter>{}
