import { AxiosInstance } from "axios"
import { CreateAttendance, EmployeeAttendanceSearchFilter, JustificationRequestData, UpdateAttendance } from "/@src/models/HR/Attendance/EmployeeAttendance/employeeAttendance"
import { CustomResponseCollection, CustomResponseSingle } from "/@src/utils/response"

export async function updateAttendanceApi(
  api: AxiosInstance,
  attendance_id: number,
  data: UpdateAttendance
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.put(`attendance/${attendance_id}`, data)

  return { response }
}
export async function createAttendanceApi(
  api: AxiosInstance,
  data: CreateAttendance
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.post(`attendance`, data)

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

export async function getPendingAttendanceListApi(
  api: AxiosInstance,
  searchFilter: EmployeeAttendanceSearchFilter
): Promise<{ response: CustomResponseCollection }> {
  const { data: response, headers } = await api.get('attendance/getPendingAttendanceList', {
    params: searchFilter,
  })
  return { response }
}

