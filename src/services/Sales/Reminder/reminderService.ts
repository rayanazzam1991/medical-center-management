import { CreateReminder, defaultReminder, Reminder } from "/@src/models/Sales/Reminder/reminder"
import { useReminder } from "/@src/stores/Sales/Reminder/reminderStore"


export async function createReminder(reminderData: CreateReminder) {
    const reponse = useReminder()
    let reminder: Reminder = await reponse.createReminderStore(reminderData) ?? defaultReminder
    let success: boolean = reponse.success ?? false
    let error_code: string = reponse.error_code ?? ''
    let message: string = reponse.message ?? ''
    return { success, error_code, message, reminder }

}
