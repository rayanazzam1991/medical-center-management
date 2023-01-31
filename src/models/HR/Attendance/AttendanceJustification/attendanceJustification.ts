import { Attendance, defaultAttendance } from "../EmployeeAttendance/employeeAttendance"
import { Media } from "/@src/models/Others/Media/media"
import { defaultPosition, Position } from "/@src/models/Others/Position/position"
import { User, defaultUser } from "/@src/models/Others/User/user"
import { BaseConsts } from "/@src/utils/consts/base"

export interface AttendanceJustification {
    id: number
    attendance: Attendance
    reason: string
    proof?: Media
    absence_hours: number
    created_by: User
    created_at: string
    
}


export const defaultAttendanceJustification: AttendanceJustification = {
    id: 0,
    attendance: defaultAttendance,
    reason: '',
    proof: undefined,
    absence_hours: 0.00,
    created_by: defaultUser,
    created_at: ''
}
export interface AttendanceJustificationSearchFilter {
    name?: string
    creator_name?: string
    page?: number
    per_page?: number
    order_by?: string
    order?: string
}

export const defaultAttendanceJustificationSearchFilter: AttendanceJustificationSearchFilter = {
    name: undefined,
    creator_name: undefined,
    page: undefined,
    per_page: undefined,
    order_by: undefined,
    order: undefined,
}

