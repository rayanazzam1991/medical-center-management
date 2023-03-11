import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { CreateReminder, Reminder, ReminderSearchFilter } from "/@src/models/Sales/Reminder/reminder"
import { createReminderApi, getRemindersListApi } from "/@src/utils/api/Sales/Reminder"
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



    return {
        success,
        error_code,
        message,
        loading,
        pagination,
        reminders,
        createReminderStore,
        getRemindersStore
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
