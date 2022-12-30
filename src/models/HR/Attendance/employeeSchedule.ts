import { defaultPosition, Position } from "../../Others/Position/position"
import { defaultUser, User } from "../../Others/User/user"

export interface EmployeeSchedule {
    id?: number
    user: User
    position: Position
    schedules: Array<Schedule>
}
export interface Schedule {
    id: number
    full_date: string
    day_of_week: string
    month_name: string
    month_number: number
    is_weekend: boolean
    is_holiday: boolean
    is_vacation: boolean
    start_time?: string
    end_time?: string
}
export interface UpdateSchedule {
    is_vacation: boolean
    start_time: string
    end_time: string
}
export const defaultEmployeeSchedule: EmployeeSchedule = {
    id: undefined,
    user: defaultUser,
    position: defaultPosition,
    schedules: []
}
export const defaultSchedule: Schedule = {
    id: 0,
    full_date: '',
    day_of_week: '',
    month_name: '',
    month_number: 0,
    is_weekend: false,
    is_holiday: false,
    is_vacation: false,
    start_time: undefined,
    end_time: undefined,
}
export const defaultUpdateSchedule: UpdateSchedule = {
    is_vacation: false,
    start_time: '00:00:00',
    end_time: '00:00:00',
}

export interface EmployeeScheduleSearchFilter {
    phone_number?: number
    name?: string
    position_id?: number
    schedule_from?: string
    schedule_to?: string
    department_id?: number
    user_status_id?: number
    page?: number
    per_page?: number
    order_by?: string
    order?: string
    quick_search?: boolean
}

export const defaultEmployeeScheduleSearchFilter: EmployeeScheduleSearchFilter = {
    phone_number: undefined,
    name: undefined,
    position_id: undefined,
    schedule_from: undefined,
    schedule_to: undefined,
    department_id: undefined,
    user_status_id: undefined,
    page: undefined,
    per_page: undefined,
    order_by: undefined,
    order: undefined,
    quick_search: undefined
}
