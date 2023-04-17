import { AccountHistoryReportFilter, BestSoldItemFilter } from "/@src/models/Others/Report/report"
import { BestAttendingEmployeeFilter } from "/@src/models/Others/Report/report"
import { WorstAttendingEmployeeFilter } from "/@src/models/Others/Report/report"
import { MostConsumedItemFilter } from "/@src/models/Others/Report/report"
import { BestClientReportFilter, BestServiceProviderFilter, ServiceProviderMonthlyReportData } from "/@src/models/Others/Report/report"
import { useReport } from "/@src/stores/Others/Report/reportStore"


export async function getBestClientReport(filter: BestClientReportFilter) {
    const reportStore = useReport()
    const report = await reportStore.getBestClientReportStore(filter)
    const success: boolean = reportStore.success ?? true
    const error_code: string = reportStore.error_code ?? ''
    const message: string = reportStore.message ?? ''
    return { success, error_code, message, report }
}
export function resetBestClientFilter() {
    const blankSearchFilter: BestClientReportFilter = {
        count: 99999,
        customer_group_id: undefined,
        date_from: undefined,
        date_to: undefined,
        service_id: undefined
    }
    return blankSearchFilter
}


export async function getBestServiceProviderReport(filter: BestServiceProviderFilter) {
    const reportStore = useReport()
    const report = await reportStore.getBestServiceProviderReportStore(filter)
    const success: boolean = reportStore.success ?? true
    const error_code: string = reportStore.error_code ?? ''
    const message: string = reportStore.message ?? ''
    return { success, error_code, message, report }
}
export function resetBestServiceProviderFilter() {
    const blankSearchFilter: BestServiceProviderFilter = {
        count: 99999,
        department_id: undefined,
        room_id: undefined,
        date_from: undefined,
        date_to: undefined,
        service_id: undefined
    }
    return blankSearchFilter
}


export async function getServiceProviderMonthlyReport(data: ServiceProviderMonthlyReportData) {
    const reportStore = useReport()
    const report = await reportStore.getServiceProviderMonthlyReportStore(data)
    const success: boolean = reportStore.success ?? true
    const error_code: string = reportStore.error_code ?? ''
    const message: string = reportStore.message ?? ''
    return { success, error_code, message, report }
}
export function resetServiceProviderMonthlyReportData() {
    const blankSearchFilter: ServiceProviderMonthlyReportData = {
        employee_id: 0,
        month: 1,
        year: 2023
    }
    return blankSearchFilter
}


export async function getBestSoldItemReport(filter: BestSoldItemFilter) {
    const reportStore = useReport()
    const report = await reportStore.getBestSoldItemReportStore(filter)
    const success: boolean = reportStore.success ?? true
    const error_code: string = reportStore.error_code ?? ''
    const message: string = reportStore.message ?? ''
    return { success, error_code, message, report }
}
export function resetBestSoldItemFilter() {
    const blankSearchFilter: BestSoldItemFilter = {
        count: 99999,
        item_category_id: undefined,
        parent_category_id: undefined,
        date_from: undefined,
        date_to: undefined,
    }
    return blankSearchFilter
}


export async function getMostConsumedItemReport(filter: MostConsumedItemFilter) {
    const reportStore = useReport()
    const report = await reportStore.getMostConsumedItemReportStore(filter)
    const success: boolean = reportStore.success ?? true
    const error_code: string = reportStore.error_code ?? ''
    const message: string = reportStore.message ?? ''
    return { success, error_code, message, report }
}
export function resetMostConsumedItemFilter() {
    const blankSearchFilter: MostConsumedItemFilter = {
        count: 99999,
        item_category_id: undefined,
        parent_category_id: undefined,
        date_from: undefined,
        date_to: undefined,
    }
    return blankSearchFilter
}


export async function getBestAttendingEmployeeReport(filter: BestAttendingEmployeeFilter) {
    const reportStore = useReport()
    const report = await reportStore.getBestAttendingEmployeeReportStore(filter)
    const success: boolean = reportStore.success ?? true
    const error_code: string = reportStore.error_code ?? ''
    const message: string = reportStore.message ?? ''
    return { success, error_code, message, report }
}
export function resetBestAttendingEmployeeFilter() {
    const blankSearchFilter: BestAttendingEmployeeFilter = {
        count: 99999,
        department_id: undefined,
        room_id: undefined,
        date_from: undefined,
        date_to: undefined,
    }
    return blankSearchFilter
}

export async function getWorstAttendingEmployeeReport(filter: WorstAttendingEmployeeFilter) {
    const reportStore = useReport()
    const report = await reportStore.getWorstAttendingEmployeeReportStore(filter)
    const success: boolean = reportStore.success ?? true
    const error_code: string = reportStore.error_code ?? ''
    const message: string = reportStore.message ?? ''
    return { success, error_code, message, report }
}
export function resetWorstAttendingEmployeeFilter() {
    const blankSearchFilter: WorstAttendingEmployeeFilter = {
        count: 99999,
        department_id: undefined,
        room_id: undefined,
        date_from: undefined,
        date_to: undefined,
    }
    return blankSearchFilter
}


export async function getAccountHistoryReport(filter: AccountHistoryReportFilter) {
    const reportStore = useReport()
    const report = await reportStore.getAccountHistoryReportStore(filter)
    const success: boolean = reportStore.success ?? true
    const error_code: string = reportStore.error_code ?? ''
    const message: string = reportStore.message ?? ''
    return { success, error_code, message, report }
}
export function resetAccountHistoryReportFilter() {
    const blankSearchFilter: AccountHistoryReportFilter = {
        account_id: 0,
        date_from: undefined,
        date_to: undefined,
    }
    return blankSearchFilter
}
