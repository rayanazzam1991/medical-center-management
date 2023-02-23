import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { Attendance, JustificationRequestData, JustificationResponseData, UpdateAttendance } from "/@src/models/HR/Attendance/EmployeeAttendance/employeeAttendance"
import { Media } from "/@src/models/Others/Media/media"
import { justifyAttendanceApi, unjustifyAttendanceApi, updateAttendanceApi } from "/@src/utils/api/HR/Attendance/EmployeeAttendance"
import { uploadMediaApi } from "/@src/utils/api/Others/Media"
import sleep from "/@src/utils/sleep"


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
    async function justifyAttendanceStore(attendance_id: number, justificationRequestData: JustificationRequestData) {
        if (loading.value) return

        loading.value = true

        try {
            const returnedResponse = await justifyAttendanceApi(api, attendance_id, justificationRequestData)
            success.value = returnedResponse.response.success
            error_code.value = returnedResponse.response.error_code
            message.value = returnedResponse.response.message
            return returnedResponse.response.data as JustificationResponseData
        } catch (error: any) {
            success.value = error?.response.data.success
            error_code.value = error?.response.data.error_code
            message.value = error?.response.data.message
        }
        finally {
            loading.value = false
        }
    }
    async function unjustifyAttendanceStore(attendance_id: number) {
        if (loading.value) return

        loading.value = true

        try {
            const returnedResponse = await unjustifyAttendanceApi(api, attendance_id)
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
    async function addJustificationProofFileStore(media: FormData) {
        if (loading.value) return
        loading.value = true
        sleep(2000)
        try {
            const response = await uploadMediaApi(api, media)
            let returnedMedia: Media[]
            returnedMedia = response.response.data
            success.value = response.response.success
            error_code.value = response.response.error_code
            message.value = response.response.message

            return returnedMedia

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
        updateAttendanceStore,
        justifyAttendanceStore,
        unjustifyAttendanceStore,
        addJustificationProofFileStore
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
