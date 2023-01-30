import { Employee } from "/@src/models/Employee/employee"
import { defaultPosition, Position } from "/@src/models/Others/Position/position"
import { User, defaultUser } from "/@src/models/Others/User/user"
import { BaseConsts } from "/@src/utils/consts/base"

export interface EmployeeAttendance {
    id?: number
    user: User
    position: Position
    attendances: Array<Attendance>
}
export interface Attendance {
    id: number
    date: string
    check_in?: string
    check_out?: string
    status: number
    employee?: Employee
}
export interface UpdateAttendance {
    check_in: string
    check_out: string
}
export interface JustificationRequestData {
    reason: string
}
export interface JustificationResponseData {
    id: number
}


export const defaultEmployeeAttendance: EmployeeAttendance = {
    id: undefined,
    user: defaultUser,
    position: defaultPosition,
    attendances: []
}
export const defaultAttendance: Attendance = {
    id: 0,
    date: '',
    check_in: undefined,
    check_out: undefined,
    status: 0,
    employee: undefined
}
export const defaultUpdateAttendance: UpdateAttendance = {
    check_in: "00:00:00",
    check_out: "00:00:00"
}
export const defaultJustificationRequestData: JustificationRequestData = {
    reason: "",
}
export const defaultJustificationResponseData: JustificationResponseData = {
    id: 0,
}
export interface EmployeeAttendanceSearchFilter {
    phone_number?: number
    name?: string
    position_id?: number
    attendance_from?: string
    attendance_to?: string
    department_id?: number
    user_status_id?: number
    page?: number
    per_page?: number
    order_by?: string
    order?: string
    quick_search?: boolean
}

export const defaultEmployeeAttendanceSearchFilter: EmployeeAttendanceSearchFilter = {
    phone_number: undefined,
    name: undefined,
    position_id: undefined,
    attendance_from: undefined,
    attendance_to: undefined,
    department_id: undefined,
    user_status_id: undefined,
    page: undefined,
    per_page: undefined,
    order_by: undefined,
    order: undefined,
    quick_search: undefined
}

class AttendanceConsts extends BaseConsts {
    static readonly ATTEND = 1;
    static readonly PENDING_ABSENCE = 2;
    static readonly JUSTIFIED_ABSENCE = 3;
    static readonly UNJUTIFIED_ABSENCE = 4;
    static readonly PENDING_PARTIAL_ABSENCE = 5;
    static readonly JUSTIFIED_PARTIAL_ABSENCE = 6;
    static readonly UNJUSTIFIED_PARTIAL_ABSENCE = 7;
    static readonly MISSING_CHECK = 8;
    static readonly VACATION = 9;

    public static getAttendanceStatusName(status: number) {
        if (status == 1)
            return 'Attend';
        if (status == 2)
            return 'Pending Absence';
        if (status == 3)
            return 'Justified Absence';
        if (status == 4)
            return 'Unjustified Absence';
        if (status == 5)
            return 'Pending Partial Absence';
        if (status == 6)
            return 'Justified Partial Absence';
        if (status == 7)
            return 'Unjustified Partial Absence';
        if (status == 8)
            return 'Missing Check';
        if (status == 9)
            return 'Vacation';
        else return 'No Data';
    }

    public static getAttendanceStatusIcon(status: number) {
        if (status == 1)
            return '✓';
        if (status == 2)
            return '✗';
        if (status == 3)
            return '✗';
        if (status == 4)
            return '✗';
        if (status == 5)
            return '/';
        if (status == 6)
            return '/';
        if (status == 7)
            return '/';
        if (status == 8)
            return '!';
        if (status == 9)
            return '◯';
        else return '-';
    }
    public static getAttendanceStatusColor(status: number) {
        if (status == 1)
            return 'blue';
        if (status == 2)
            return 'grey';
        if (status == 3)
            return 'green';
        if (status == 4)
            return 'red';
        if (status == 5)
            return 'grey';
        if (status == 6)
            return 'green';
        if (status == 7)
            return 'red';
        if (status == 8)
            return 'yellow';
        if (status == 9)
            return 'blue';
        else return 'grey';
    }


}

export { AttendanceConsts }