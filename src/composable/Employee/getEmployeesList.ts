import { useEmployee } from '/@src/stores/Employee/employeeStore'
import { Employee, EmployeeSearchFilter } from '/@src/utils/api/Employee'
import { Pagination } from '/@src/utils/response'

export async function getEmployeesList(searchFilter: EmployeeSearchFilter) {
  const employee = useEmployee()
  await employee.getEmployeesStore(searchFilter)

  var employees: Employee[] = employee.employees
  var pagination: Pagination = employee.pagination
  return { employees, pagination }
}
