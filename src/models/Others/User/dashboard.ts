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
