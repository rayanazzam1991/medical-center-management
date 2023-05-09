import { Pagination } from '/@src/utils/response'
import { useEmployeeAvaialabilityHistory } from '/@src/stores/Employee/employeeAvailabilityHistoryStore'
import { EmployeeAvailabilityHistory, EmployeeAvailabilityHistorySearchFilter } from '/@src/models/Employee/employeeAvailabilityHistory'

export async function getEmployeeAvailabilityHistoryList(searchFilter: EmployeeAvailabilityHistorySearchFilter) {
    const employee = useEmployeeAvaialabilityHistory()
    await employee.getEmployeeAvailabilityHistoryListStore(searchFilter)
    const employee_availability_history_list: EmployeeAvailabilityHistory[] = employee.employeeAvailabilityHistoryList
    const pagination: Pagination = employee.pagination
    const success: boolean = employee.success ?? false
    const error_code: string = employee.error_code ?? ''
    const message: string = employee.message ?? ''
    return { employee_availability_history_list, pagination, success, message, error_code }
}



export function resetEmployeesAvailabilityHistorySearchFilter() {
    const blankSearchFilter: EmployeeAvailabilityHistorySearchFilter = {
        employees_id: undefined,
        is_available: undefined,
    }
    return blankSearchFilter
}

