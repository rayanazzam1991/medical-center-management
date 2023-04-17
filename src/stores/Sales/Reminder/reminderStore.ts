import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { ChangeReminderStatus, CreateReminder, Reminder, ReminderSearchFilter, UpdateReminder } from "/@src/models/Sales/Reminder/reminder"
import { changeReminderStatusApi, createReminderApi, getReminderApi, getRemindersListApi, updateReminderApi } from "/@src/utils/api/Sales/Reminder"
import { Pagination, defaultPagination } from "/@src/utils/response"


export const useReminder = defineStore('reminder', () => {
    const api = useApi()
    const loading = ref(false)
    const success = ref<boolean>()
    const error_code = ref<string>()
    const message = ref<string>()
    const reminders = ref<Reminder[]>([])
    const pagination = ref<Pagination>(defaultPagination)

    async function createReminderStore(reminder: CreateReminder) {
        if (loading.value) return

        loading.value = true

        try {
            const returnedResponse = await createReminderApi(api, reminder)
            success.value = returnedResponse.response.success
            error_code.value = returnedResponse.response.error_code
            message.value = returnedResponse.response.message
            return returnedResponse.response.data as Reminder
        } catch (error: any) {
            success.value = error?.response.data.success
            error_code.value = error?.response.data.error_code
            message.value = error?.response.data.message
        }
        finally {
            loading.value = false
        }
    }
    async function updateReminderStore(reminderId: number, reminder: UpdateReminder) {
        if (loading.value) return

        loading.value = true

        try {
            const returnedResponse = await updateReminderApi(api, reminderId, reminder)
            success.value = returnedResponse.response.success
            error_code.value = returnedResponse.response.error_code
            message.value = returnedResponse.response.message
            return returnedResponse.response.data as Reminder
        } catch (error: any) {
            success.value = error?.response.data.success
            error_code.value = error?.response.data.error_code
            message.value = error?.response.data.message
        }
        finally {
            loading.value = false
        }
    }

    async function getReminderStore(reminderId: number) {
        if (loading.value) return

        loading.value = true

        try {
            const returnedResponse = await getReminderApi(api, reminderId)
            success.value = returnedResponse.response.success
            error_code.value = returnedResponse.response.error_code
            message.value = returnedResponse.response.message
            return returnedResponse.response.data as Reminder
        } catch (error: any) {
            success.value = error?.response.data.success
            error_code.value = error?.response.data.error_code
            message.value = error?.response.data.message
        }
        finally {
            loading.value = false
        }
    }

    async function getRemindersStore(searchFilter: ReminderSearchFilter) {
        if (loading.value) return

        loading.value = true

        try {
            const returnedResponse = await getRemindersListApi(api, searchFilter)
            pagination.value = returnedResponse.response.pagination
            success.value = returnedResponse.response.success
            error_code.value = returnedResponse.response.error_code
            message.value = returnedResponse.response.message
            return returnedResponse.response.data
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
    async function changeReminderStatusStore(reminder: ChangeReminderStatus) {
        if (loading.value) return
        loading.value = true
        try {
            const response = await changeReminderStatusApi(api, reminder)
            var returnedReminder: Reminder
            returnedReminder = response.response.data
            success.value = response.response.success
            error_code.value = response.response.error_code
            message.value = response.response.message

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
        pagination,
        reminders,
        createReminderStore,
        getRemindersStore,
        changeReminderStatusStore,
        updateReminderStore,
        getReminderStore
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
    import.meta.hot.accept(acceptHMRUpdate(useReminder, import.meta.hot))
}
