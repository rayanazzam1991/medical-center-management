import { ChangeReminderStatus, CreateReminder, defaultReminder, Reminder, ReminderSearchFilter } from "/@src/models/Sales/Reminder/reminder"
import { useReminder } from "/@src/stores/Sales/Reminder/reminderStore"
import { Pagination } from "/@src/utils/response"


export async function createReminder(reminderData: CreateReminder) {
  const reponse = useReminder()
  let reminder: Reminder = await reponse.createReminderStore(reminderData) ?? defaultReminder
  let success: boolean = reponse.success ?? false
  let error_code: string = reponse.error_code ?? ''
  let message: string = reponse.message ?? ''
  return { success, error_code, message, reminder }

}
export async function getRemindersList(searchFilter: ReminderSearchFilter) {
  const reponse = useReminder()
  let reminders: Reminder[] = await reponse.getRemindersStore(searchFilter) ?? []
  let pagination: Pagination = reponse.pagination
  let success: boolean = reponse.success ?? false
  let error_code: string = reponse.error_code ?? ''
  let message: string = reponse.message ?? ''

  return { reminders, pagination, success, error_code, message }

}
export async function changeReminderStatus(reminderData: ChangeReminderStatus) {
  const reminderResponse = useReminder()
  await reminderResponse.changeReminderStatusStore(reminderData)
  var success: boolean = reminderResponse.success ?? false
  var error_code: string = reminderResponse.error_code ?? ''
  var message: string = reminderResponse.message ?? ''
  return { success, error_code, message }
}
export function resetReminderSearchFilter() {
  const blankSearchFilter: ReminderSearchFilter = {
    order: undefined,
    order_by: undefined,
    page: undefined,
    per_page: undefined,
    customer_id: undefined
  }

  return blankSearchFilter

}
