import { useDashboard } from "/@src/stores/Others/User/dashboardStore"


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
