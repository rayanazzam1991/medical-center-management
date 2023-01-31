import { AxiosInstance } from "axios"
import { JustificationRequestData, UpdateAttendance } from "/@src/models/HR/Attendance/EmployeeAttendance/employeeAttendance"
import { CustomResponseCollection, CustomResponseSingle } from "/@src/utils/response"

export async function updateAttendanceApi(
  api: AxiosInstance,
  attendance_id: number,
  data: UpdateAttendance
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.put(`attendance/${attendance_id}`, data)

  return { response }
}
export async function justifyAttendanceApi(
  api: AxiosInstance,
  attendance_id: number,
  justificationData: JustificationRequestData
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.put(`attendance/${attendance_id}/justifyAttendance`, justificationData)

  return { response }
}
export async function unjustifyAttendanceApi(
  api: AxiosInstance,
  attendance_id: number,
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.put(`attendance/${attendance_id}/unjustifyAttendance`)

  return { response }
}
