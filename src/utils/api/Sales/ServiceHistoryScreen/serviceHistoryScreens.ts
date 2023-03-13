import { AxiosInstance } from "axios"
import { ChangeReminderStatus, CreateReminder, ReminderSearchFilter } from "/@src/models/Sales/Reminder/reminder"
import { CreateUpdateServiceHistoryScreen, ServiceHistoryScreenSearchFilter } from "/@src/models/Sales/ServiceHistoryScreen/serviceHistoryScreen"
import { CustomResponseCollection, CustomResponseSingle } from "/@src/utils/response"

export async function createServiceHistoryScreenApi(
    api: AxiosInstance,
    serviceHistoryScreen: CreateUpdateServiceHistoryScreen
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.post('serviceHistoryScreen', serviceHistoryScreen)

    return { response }
}
export async function updateServiceHistoryScreenApi(
    api: AxiosInstance,
    screenId: number,
    serviceHistoryScreen: CreateUpdateServiceHistoryScreen
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.put(`serviceHistoryScreen/${screenId}`, serviceHistoryScreen)

    return { response }
}
export async function getServiceHistoryScreenForEditApi(
    api: AxiosInstance,
    screenId: number,
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.get(`serviceHistoryScreen/getServiceHistoryScreenWithFilters/${screenId}`)

    return { response }
}
export async function getServiceHistoryScreensListApi(
    api: AxiosInstance,
    searchFilter: ServiceHistoryScreenSearchFilter
): Promise<{ response: CustomResponseCollection }> {
    const { data: response, headers } = await api.get('serviceHistoryScreen/getServiceHistoryScreens', {
        params: searchFilter,
    })
    return { response }
}

