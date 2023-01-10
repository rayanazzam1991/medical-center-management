import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { Attendance, UpdateAttendance } from "/@src/models/HR/Attendance/EmployeeAttendance/employeeAttendance"
import { justifyAttendanceApi, updateAttendanceApi } from "/@src/utils/api/HR/Attendance/EmployeeAttendance"


export const useAttendance = defineStore('attendance', () => {
    const api = useApi()
    const loading = ref(false)
    const success = ref<boolean>()
    const error_code = ref<string>()
    const message = ref<string>()

    async function updateAttendanceStore(attendance_id: number, data: UpdateAttendance) {
        if (loading.value) return

        loading.value = true

        try {
            const returnedResponse = await updateAttendanceApi(api, attendance_id, data)
            success.value = returnedResponse.response.success
            error_code.value = returnedResponse.response.error_code
            message.value = returnedResponse.response.message
            return returnedResponse.response.data as Attendance
        } catch (error: any) {
            success.value = error?.response.data.success
            error_code.value = error?.response.data.error_code
            message.value = error?.response.data.message
        }
        finally {
            loading.value = false
        }
    }
    async function justifyAttendanceStore(attendance_id: number, isJustify: boolean) {
        if (loading.value) return

        loading.value = true

        try {
            const returnedResponse = await justifyAttendanceApi(api, attendance_id, isJustify)
            success.value = returnedResponse.response.success
            error_code.value = returnedResponse.response.error_code
            message.value = returnedResponse.response.message
            return returnedResponse.response.data as Attendance
        } catch (error: any) {
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
        updateAttendanceStore,
        justifyAttendanceStore,
    } as const
})

/**
 * Pinia supports Hot Module replacement so you can edit your stores and
 * interact with them directly in your app without reloading the page.
 *
 * @see https://pinia.esm.dev/cookbook/hot-module-replacement.html
 * @see https://vitejs.dev/guide/api-hmr.html
 */
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useAttendance, import.meta.hot))
}
