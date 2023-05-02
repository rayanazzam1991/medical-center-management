import { AxiosInstance } from "axios"
import { ChangeReminderStatus, CreateReminder, ReminderSearchFilter, UpdateReminder } from "/@src/models/Sales/Reminder/reminder"
import { CustomResponseCollection, CustomResponseSingle } from "/@src/utils/response"

export async function createReminderApi(
    api: AxiosInstance,
    reminder: CreateReminder
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.post('reminder', reminder)

    return { response }
}
export async function updateReminderApi(
    api: AxiosInstance,
    reminderId: number,
    reminder: UpdateReminder
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.put(`reminder/${reminderId}`, reminder)

    return { response }
}
export async function getReminderApi(
    api: AxiosInstance,
    reminderId: number,
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.get(`reminder/${reminderId}`)

    return { response }
}
export async function getRemindersListApi(
    api: AxiosInstance,
    searchFilter: ReminderSearchFilter
): Promise<{ response: CustomResponseCollection }> {
    const { data: response, headers } = await api.get('reminder/getRemindersList', {
        params: searchFilter,
    })
    return { response }
}

export async function changeReminderStatusApi(
    api: AxiosInstance,
    reminder: ChangeReminderStatus
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.put(
        `reminder/changeReminderStatus/${reminder.id}`,
        reminder
    )
    return { response }
}

