import { AxiosInstance } from "axios"
import { AccountHistoryReportFilter, BestAttendingEmployeeFilter, BestClientReportFilter, BestServiceProviderFilter, BestSoldItemFilter, MostConsumedItemFilter, ServiceProviderMonthlyReportData, WorstAttendingEmployeeFilter } from "/@src/models/Others/Report/report"


export async function getBestClientReportApi(
    api: AxiosInstance,
    filter: BestClientReportFilter
) {
    const { data: response } = await api.get(
        `report/getBestClientReport`,
        {
            params: filter,
            responseType: 'arraybuffer'
        }
    )
    return { response }
}
export async function getBestServiceProviderReportApi(
    api: AxiosInstance,
    filter: BestServiceProviderFilter
) {
    const { data: response } = await api.get(
        `report/getBestServiceProviderReport`,
        {
            params: filter,
            responseType: 'arraybuffer'
        }
    )
    return { response }
}
export async function getServiceProviderMonthlyReportApi(
    api: AxiosInstance,
    data: ServiceProviderMonthlyReportData
) {
    const { data: response } = await api.get(
        `report/getServiceProviderMonthlyReport`,
        {
            params: data,
            responseType: 'arraybuffer'
        }
    )
    return { response }
}
export async function getBestSoldItemReportApi(
    api: AxiosInstance,
    filter: BestSoldItemFilter
) {
    const { data: response } = await api.get(
        `report/getBestSoldItemReport`,
        {
            params: filter,
            responseType: 'arraybuffer'
        }
    )
    return { response }
}
export async function getMostConsumedItemReportApi(
    api: AxiosInstance,
    filter: MostConsumedItemFilter
) {
    const { data: response } = await api.get(
        `report/getMostConsumedItemReport`,
        {
            params: filter,
            responseType: 'arraybuffer'
        }
    )
    return { response }
}
export async function getBestAttendingEmployeeReportApi(
    api: AxiosInstance,
    filter: BestAttendingEmployeeFilter
) {
    const { data: response } = await api.get(
        `report/getBestAttendingEmployeeReport`,
        {
            params: filter,
            responseType: 'arraybuffer'
        }
    )
    return { response }
}
export async function getWorstAttendingEmployeeReportApi(
    api: AxiosInstance,
    filter: WorstAttendingEmployeeFilter
) {
    const { data: response } = await api.get(
        `report/getWorstAttendingEmployeeReport`,
        {
            params: filter,
            responseType: 'arraybuffer'
        }
    )
    return { response }
}
export async function getAccountHistoryReportApi(
    api: AxiosInstance,
    filter: AccountHistoryReportFilter
) {
    const { data: response } = await api.get(
        `report/getAccountHistoryReport`,
        {
            params: filter,
            responseType: 'arraybuffer'
        }
    )
    return { response }
}
