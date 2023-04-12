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


export interface AdminDashboard {
  clients_in_center: string
  active_clients_count: string
  active_users_count: string
  active_employees_count: string
  active_suppliers_count: string
  active_items_count: string
  cash_amount_stats: AdminDashboardCashStats
  roles_stats: AdminDashboardRoleStats[]
}
export interface AdminDashboardCashStats {
  USD_stats: AdminDashboardCashStat
  IQD_stats: AdminDashboardCashStat
  total_stats: AdminDashboardCashStat
}
export interface AdminDashboardCashStat {
  currency_code: string
  currency_name: string
  amount: string
  is_increase: boolean
  increment_percentage: number
}
export interface AdminDashboardRoleStats {
  name: string
  display_name: string
  users_count: string
}
export const defaultAdminDashboardCashStat: AdminDashboardCashStat = {
  amount: '0',
  currency_code: "",
  currency_name: "",
  increment_percentage: 0,
  is_increase: false

}
export const defaultAdminDashboardCashStats: AdminDashboardCashStats = {
  IQD_stats: defaultAdminDashboardCashStat,
  USD_stats: defaultAdminDashboardCashStat,
  total_stats: defaultAdminDashboardCashStat,
}
export const defaultAdminDashboard: AdminDashboard = {
  clients_in_center: '0',
  active_clients_count: '0',
  active_users_count: '0',
  active_employees_count: '0',
  active_items_count: '0',
  active_suppliers_count: '0',
  cash_amount_stats: defaultAdminDashboardCashStats,
  roles_stats: []
}


export interface AnalystDashboard {
  clients_in_center: string
  active_clients_count: string
  active_users_count: string
  active_employees_count: string
  active_suppliers_count: string
  active_items_count: string
  cash_amount_stats: AnalystDashboardCashStats
  roles_stats: AnalystDashboardRoleStats[]
}
export interface AnalystDashboardCashStats {
  USD_stats: AnalystDashboardCashStat
  IQD_stats: AnalystDashboardCashStat
  total_stats: AnalystDashboardCashStat
}
export interface AnalystDashboardCashStat {
  currency_code: string
  currency_name: string
  amount: string
  is_increase: boolean
  increment_percentage: number
}
export interface AnalystDashboardRoleStats {
  name: string
  display_name: string
  users_count: string
}
export const defaultAnalystDashboardCashStat: AnalystDashboardCashStat = {
  amount: '0',
  currency_code: "",
  currency_name: "",
  increment_percentage: 0,
  is_increase: false

}
export const defaultAnalystDashboardCashStats: AnalystDashboardCashStats = {
  IQD_stats: defaultAnalystDashboardCashStat,
  USD_stats: defaultAnalystDashboardCashStat,
  total_stats: defaultAnalystDashboardCashStat,
}
export const defaultAnalystDashboard: AnalystDashboard = {
  clients_in_center: '0',
  active_clients_count: '0',
  active_users_count: '0',
  active_employees_count: '0',
  active_items_count: '0',
  active_suppliers_count: '0',
  cash_amount_stats: defaultAnalystDashboardCashStats,
  roles_stats: []
}

export interface ReceptionistDashboard {
  clients_in_center: string
  active_clients_count: string
  served_services_stat: ReceptionistDashboardStats
}
export interface ReceptionistDashboardStats {
  count: string
  is_increase: boolean
  increment_percentage: number
}
export const defaultReceptionistDashboardStats: ReceptionistDashboardStats = {
  count: '0',
  increment_percentage: 0,
  is_increase: false

}

export const defaultReceptionistDashboard: ReceptionistDashboard = {
  clients_in_center: '0',
  active_clients_count: '0',
  served_services_stat: defaultReceptionistDashboardStats,
}
