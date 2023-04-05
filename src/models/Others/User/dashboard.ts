export interface InventoryDashboard {
    active_items_count: string
    withdraw_stats: InventoryStatDashboard
    add_stats: InventoryStatDashboard
}
export interface InventoryStatDashboard {
    quantity: string
    is_increase: boolean
    increment_percentage: number
}
export const defaultInventoryStatDashboard: InventoryStatDashboard = {
    increment_percentage: 0,
    is_increase: false,
    quantity: '0'

}
export const defaultInventoryDashboard: InventoryDashboard = {
    active_items_count: '0',
    add_stats: defaultInventoryStatDashboard,
    withdraw_stats: defaultInventoryStatDashboard,
}
export interface HRDashboard {
    active_employee_count: string
    attendance_employee_count: string
    service_providers_count: string
    absence_hours_stats: HRStatDashboard
    justified_absence_hours_stats: HRStatDashboard
    unjustified_absence_hours_stats: HRStatDashboard
    remaining_days_for_generate: string
}
export interface HRStatDashboard {
    absenece_hours: string
    is_increase: boolean
    increment_percentage: number
}
export const defaultHRStatDashboard: HRStatDashboard = {
    increment_percentage: 0,
    is_increase: false,
    absenece_hours: '0'

}
export const defaultHRDashboard: HRDashboard = {
    active_employee_count: '0',
    absence_hours_stats: defaultHRStatDashboard,
    attendance_employee_count: '0',
    justified_absence_hours_stats: defaultHRStatDashboard,
    remaining_days_for_generate: '0',
    service_providers_count: '0',
    unjustified_absence_hours_stats: defaultHRStatDashboard
}
