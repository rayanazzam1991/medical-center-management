import { AxiosInstance } from "axios"
import { CreateReminder } from "/@src/models/Sales/Reminder/reminder"
import { CreateTicket, UpdateTicket } from "/@src/models/Sales/Ticket/ticket"
import { CustomResponseCollection, CustomResponseSingle } from "/@src/utils/response"

export async function createReminderApi(
    api: AxiosInstance,
    reminder: CreateReminder
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.post('reminder', reminder)

    return { response }
}
