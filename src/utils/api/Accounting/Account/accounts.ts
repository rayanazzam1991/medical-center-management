import { AxiosInstance } from "axios"
import { CustomResponseCollection, CustomResponseSingle } from "/@src/utils/response"

export async function generateTrailBalanceReportApi(
    api: AxiosInstance,
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.get('account/generateTrailBalanceReport')
    return { response }
}

export async function generateBalanceSheetReportApi(
    api: AxiosInstance,
): Promise<{ response: CustomResponseSingle }> {
    const { data: response, headers } = await api.get('account/generateBalanceSheetReport')
    return { response }
}