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


export interface AdminDashboard {
  clients_have_active_ticket_count: string
  active_users_count: string
  active_clients_count: string
  active_employees_count: string
  active_supplier_count: string
  active_item_count: string
  cash_amount: AdminCashAmountStats
  users_count_for_each_role: UsersRole
}

export interface AdminCashAmountStats{
  USD_stats: AdminCashStat
  IQD_stats: AdminCashStat
  total_stats: AdminCashStat
}

export interface AdminCashStat{
  amount: string
  is_increase: boolean
  increment_percentage:number
}
export const  defaultAdminCashStat : AdminCashStat = {
  amount: '0',
  is_increase: false,
  increment_percentage:0
}

export const defaultAdminCashAmountStats: AdminCashAmountStats = {
  USD_stats: defaultAdminCashStat,
  IQD_stats: defaultAdminCashStat,
  total_stats: defaultAdminCashStat,
}


export interface UsersRole{
  name: string
  sum:number
}

export const defaultUserRole : UsersRole ={
  name: '',
  sum:0
}

export const defaultAdminDashboard : AdminDashboard= {
  clients_have_active_ticket_count: '0',
  active_users_count: '0',
  active_clients_count: '0',
  active_employees_count: '0',
  active_supplier_count: '0',
  active_item_count: '0',
  cash_amount: defaultAdminCashAmountStats,
  users_count_for_each_role: defaultUserRole
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
