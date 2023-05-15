import { useDashboard } from "/@src/stores/Others/User/dashboardStore"

export async function getAdminDashboardData() {
    const response = useDashboard()
    await response.getAdminDashboardStore()
    const dashboard_data = response.adminDashboard
    const success: boolean = response.success ?? false
    const error_code: string = response.error_code ?? ''
    const message: string = response.message ?? ''
    return { success, error_code, message, dashboard_data }

}
export async function getInventoryDashboardData() {
    const response = useDashboard()
    await response.getInventoryDashboardStore()
    const dashboard_data = response.inventoryDashboard
    const success: boolean = response.success ?? false
    const error_code: string = response.error_code ?? ''
    const message: string = response.message ?? ''
    return { success, error_code, message, dashboard_data }

}
export async function getHumanResourcesDashboardData() {
    const response = useDashboard()
    await response.getHumanResourcesDashboardStore()
    const dashboard_data = response.hrDashboard
    const success: boolean = response.success ?? false
    const error_code: string = response.error_code ?? ''
    const message: string = response.message ?? ''
    return { success, error_code, message, dashboard_data }

}
export async function getAnalystDashboardData() {
    const response = useDashboard()
    await response.getAnalystDashboardStore()
    const analyst_dashboard = response.analystDashboard
    const success: boolean = response.success ?? false
    const error_code: string = response.error_code ?? ''
    const message: string = response.message ?? ''
    return { success, error_code, message, analyst_dashboard }

}
export async function getReceptionistDashboardData() {
    const response = useDashboard()
    await response.getReceptionistDashboardStore()
    const receptionist_dashboard = response.receptionistDashboard
    const success: boolean = response.success ?? false
    const error_code: string = response.error_code ?? ''
    const message: string = response.message ?? ''
    return { success, error_code, message, receptionist_dashboard }

}
export async function getCashierDashboardData() {
    const response = useDashboard()
    await response.getCashierDashboadStore()
    const cashier_dashboard = response.cashierDashboard
    const success: boolean = response.success ?? false
    const error_code: string = response.error_code ?? ''
    const message: string = response.message ?? ''
    return { success, error_code, message, cashier_dashboard }

}
