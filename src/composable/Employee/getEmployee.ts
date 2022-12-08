import { useEmployee, defaultEmployee } from '/@src/stores/Employee/employeeStore'
import { Employee } from '/@src/utils/api/Employee'

export async function getEmployee(employee_id: number) {
  const employeeResponse = useEmployee()

  var employee: Employee =
    (await employeeResponse.getEmployeeStore(employee_id)) ?? defaultEmployee

  var success: boolean = employeeResponse.success ?? false
  var error_code: string = employeeResponse.error_code ?? ''
  var message: string = employeeResponse.message ?? ''
  return { success, error_code, message, employee }
}
