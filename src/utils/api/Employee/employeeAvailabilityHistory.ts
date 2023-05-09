import { AxiosInstance } from "axios"
import { CustomResponseCollection } from "../../response"
import { EmployeeAvailabilityHistorySearchFilter } from "/@src/models/Employee/employeeAvailabilityHistory"

export async function getEmployeeAvailabilityHistoryListApi(
    api: AxiosInstance,
    searchFilter: EmployeeAvailabilityHistorySearchFilter
): Promise<{ response: CustomResponseCollection }> {
    const { data: response, headers } = await api.get('employeeAvailabilityHistory/getEmployeeAvailabilityHistoryList', {
        params: searchFilter,
    })
    return { response }
}
