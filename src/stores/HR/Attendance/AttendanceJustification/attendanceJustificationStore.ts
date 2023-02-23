import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { AttendanceJustification, AttendanceJustificationSearchFilter } from "/@src/models/HR/Attendance/AttendanceJustification/attendanceJustification"
import { getAttendanceJustificationsListApi } from "/@src/utils/api/HR/Attendance/AttendanceJustification"
import { Pagination, defaultPagination } from "/@src/utils/response"


export const useAttendanceJustification = defineStore('attendanceJustification', () => {
    const api = useApi()
    const loading = ref(false)
    const success = ref<boolean>()
    const error_code = ref<string>()
    const message = ref<string>()
    const pagination = ref<Pagination>(defaultPagination)
    const attendanceJustifications = ref<AttendanceJustification[]>()
    async function getAttendanceJustificationsStore(searchFilter: AttendanceJustificationSearchFilter) {
        if (loading.value) return

        loading.value = true

        try {
            const returnedResponse = await getAttendanceJustificationsListApi(api, searchFilter)
            attendanceJustifications.value = returnedResponse.response.data
            pagination.value = returnedResponse.response.pagination
            success.value = returnedResponse.response.success
            error_code.value = returnedResponse.response.error_code
            message.value = returnedResponse.response.message
            return returnedResponse.response.data as AttendanceJustification[]
        }
        catch (error: any) {
            success.value = error?.response.data.success
            error_code.value = error?.response.data.error_code
            message.value = error?.response.data.message

        }
        finally {
            loading.value = false
        }
    }

    return {
        success,
        error_code,
        message,
        loading,
        pagination,
        attendanceJustifications,
        getAttendanceJustificationsStore
    } as const
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useAttendanceJustification, import.meta.hot))
}
