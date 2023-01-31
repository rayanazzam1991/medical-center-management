import { AttendanceJustification, AttendanceJustificationSearchFilter } from "/@src/models/HR/Attendance/AttendanceJustification/attendanceJustification"
import { useAttendanceJustification } from "/@src/stores/HR/Attendance/AttendanceJustification/attendanceJustificationStore"
import { Pagination } from "/@src/utils/response"

export async function getAttendanceJustificationsList(searchFilter: AttendanceJustificationSearchFilter) {
    const attendanceJustification = useAttendanceJustification()
    let attendanceJustifications: AttendanceJustification[] = await attendanceJustification.getAttendanceJustificationsStore(searchFilter) ?? []
    let pagination: Pagination = attendanceJustification.pagination
    let success: boolean = attendanceJustification.success ?? false
    let error_code: string = attendanceJustification.error_code ?? ''
    let message: string = attendanceJustification.message ?? ''

    return { attendanceJustifications, pagination, success, error_code, message }

}
