import { Attendance, defaultAttendance, defaultJustificationResponseData, JustificationRequestData, JustificationResponseData, UpdateAttendance } from "/@src/models/HR/Attendance/EmployeeAttendance/employeeAttendance";
import { MediaConsts } from "/@src/models/Others/Media/media";
import { useAttendance } from "/@src/stores/HR/Attendance/EmployeeAttendance/attendanceStore";

export async function updateAttendance(attendance_id: number, data: UpdateAttendance) {
    const attendanceResponse = useAttendance()
    let attendance: Attendance = await attendanceResponse.updateAttendanceStore(attendance_id, data) ?? defaultAttendance
    let success: boolean = attendanceResponse.success ?? false
    let error_code: string = attendanceResponse.error_code ?? ''
    let message: string = attendanceResponse.message ?? ''
    return { success, error_code, message, attendance }

}
export async function justifyAttendance(attendance_id: number, justificationRequestData: JustificationRequestData) {
    const attendanceResponse = useAttendance()
    let justificationResponseData: JustificationResponseData = await attendanceResponse.justifyAttendanceStore(attendance_id, justificationRequestData) ?? defaultJustificationResponseData
    let success: boolean = attendanceResponse.success ?? false
    let error_code: string = attendanceResponse.error_code ?? ''
    let message: string = attendanceResponse.message ?? ''
    return { success, error_code, message, justificationResponseData }
}
export async function unjustifyAttendance(attendance_id: number) {
    const attendanceResponse = useAttendance()
    let attendance: Attendance = await attendanceResponse.unjustifyAttendanceStore(attendance_id) ?? defaultAttendance
    let success: boolean = attendanceResponse.success ?? false
    let error_code: string = attendanceResponse.error_code ?? ''
    let message: string = attendanceResponse.message ?? ''
    return { success, error_code, message, attendance }
}
export async function addJustificationProofFile(attendance_justification_id: unknown, fd: FormData) {
    const attendanceResponse = useAttendance()
    const is_featured: unknown = false
    fd.append('model_id', attendance_justification_id as string)
    fd.append('model_type', MediaConsts.ATTENDANCE_JUSTIFICATION_ROUTE)
    fd.append('is_featured', String(is_featured))
    await attendanceResponse.addJustificationProofFileStore(fd) ?? []
    const success: boolean = attendanceResponse.success ?? false
    const error_code: string = attendanceResponse.error_code ?? ''
    const message: string = attendanceResponse.message ?? ''
    return { success, error_code, message }
  }
  


