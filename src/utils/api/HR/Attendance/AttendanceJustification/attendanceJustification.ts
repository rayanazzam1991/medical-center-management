import { AxiosInstance } from "axios"
import { AttendanceJustificationSearchFilter } from "/@src/models/HR/Attendance/AttendanceJustification/attendanceJustification"
import { CustomResponseCollection } from "/@src/utils/response"

export async function getAttendanceJustificationsListApi(
  api: AxiosInstance,
  searchFilter: AttendanceJustificationSearchFilter
): Promise<{ response: CustomResponseCollection }> {
  const { data: response, headers } = await api.get('attendanceJustification/getAttendanceJustificationsList', {
    params: searchFilter,
  })
  return { response }
}
