import { CreateUpdateServiceHistoryScreen, defaultServiceHistoryScreen, ServiceHistoryScreen, ServiceHistoryScreenSearchFilter } from "/@src/models/Sales/ServiceHistoryScreen/serviceHistoryScreen"
import { useServiceHistoryScreen } from "/@src/stores/Sales/ServiceHistoryScreen/serviceHistoryScreenStore"
import { Pagination } from "/@src/utils/response"


export async function createServiceHistoryScreen(screenData: CreateUpdateServiceHistoryScreen) {
    const response = useServiceHistoryScreen()
    let screen: ServiceHistoryScreen = await response.createServiceHistoryScreenStore(screenData) ?? defaultServiceHistoryScreen
    let success: boolean = response.success ?? false
    let error_code: string = response.error_code ?? ''
    let message: string = response.message ?? ''
    return { success, error_code, message, screen }
}
export async function updateServiceHistoryScreen(screenId: number, screenData: CreateUpdateServiceHistoryScreen) {
    const response = useServiceHistoryScreen()
    let screen: ServiceHistoryScreen = await response.updateServiceHistoryScreenStore(screenId, screenData) ?? defaultServiceHistoryScreen
    let success: boolean = response.success ?? false
    let error_code: string = response.error_code ?? ''
    let message: string = response.message ?? ''
    return { success, error_code, message, screen }
}
export async function getServiceHistoryScreenForEdit(screenId: number) {
    const response = useServiceHistoryScreen()
    let screen: ServiceHistoryScreen = await response.getServiceHistoryScreenForEditStore(screenId) ?? defaultServiceHistoryScreen
    let success: boolean = response.success ?? false
    let error_code: string = response.error_code ?? ''
    let message: string = response.message ?? ''
    return { success, error_code, message, screen }
}
export async function getServiceHistoryScreensList(searchFilter: ServiceHistoryScreenSearchFilter) {
    const reponse = useServiceHistoryScreen()
    let screens: ServiceHistoryScreen[] = await reponse.getServiceHistoryScreensStore(searchFilter) ?? []
    let pagination: Pagination = reponse.pagination
    let success: boolean = reponse.success ?? false
    let error_code: string = reponse.error_code ?? ''
    let message: string = reponse.message ?? ''

    return { screens, pagination, success, error_code, message }

}
