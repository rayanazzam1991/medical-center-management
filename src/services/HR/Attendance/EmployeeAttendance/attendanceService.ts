import { Attendance, defaultAttendance, UpdateAttendance } from "/@src/models/HR/Attendance/EmployeeAttendance/employeeAttendance";
import { useAttendance } from "/@src/stores/HR/Attendance/EmployeeAttendance/attendanceStore";

export async function updateAttendance(attendance_id: number, data: UpdateAttendance) {
    const attendanceResponse = useAttendance()
    let attendance :Attendance = await attendanceResponse.updateAttendanceStore(attendance_id, data) ?? defaultAttendance
    let success: boolean = attendanceResponse.success ?? false
    let error_code: string = attendanceResponse.error_code ?? ''
    let message: string = attendanceResponse.message ?? ''
    return { success, error_code, message , attendance}

}
export async function justifyAttendance(attendance_id: number, isJustify: boolean) {
    const attendanceResponse = useAttendance()
    let attendance :Attendance = await attendanceResponse.justifyAttendanceStore(attendance_id, isJustify) ?? defaultAttendance
    let success: boolean = attendanceResponse.success ?? false
    let error_code: string = attendanceResponse.error_code ?? ''
    let message: string = attendanceResponse.message ?? ''
    return { success, error_code, message , attendance}

}



