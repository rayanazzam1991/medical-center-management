export interface BestClientReportFilter {
    date_from?: string
    date_to?: string
    customer_group_id?: number
    service_id?: number
    count?: number
}
export interface BestServiceProviderFilter {
    date_from?: string
    date_to?: string
    department_id?: number
    room_id?: number
    service_id?: number
    count?: number
}
export interface ServiceProviderMonthlyReportData {
    employee_id: number
    month: number
    year: number
}
export interface BestSoldItemFilter {
    date_from?: string
    date_to?: string
    item_category_id?: number
    parent_category_id?: number
    count?: number
}
export interface MostConsumedItemFilter {
    date_from?: string
    date_to?: string
    item_category_id?: number
    parent_category_id?: number
    count?: number
}
export interface BestAttendingEmployeeFilter {
    date_from?: string
    date_to?: string
    department_id?: number
    room_id?: number
    count?: number
}
export interface WorstAttendingEmployeeFilter {
    date_from?: string
    date_to?: string
    department_id?: number
    room_id?: number
    count?: number
}
export interface AccountHistoryReportFilter {
    date_from?: string
    date_to?: string
    account_id: number
}
