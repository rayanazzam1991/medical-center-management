import { addUser } from '../Others/User/addUser'
import { defaultEmployee, useEmployee } from '/@src/stores/Employee/employeeStore'
import { Employee, UpdateEmployee } from '/@src/utils/api/Employee'
import { CreateUpdateUser } from '/@src/utils/api/Others/User'

export async function updateEmployee(
  employee_id: number,
  employeeData: UpdateEmployee,
  userData: CreateUpdateUser
) {
  const newEmployeeData: UpdateEmployee = {
    starting_date: employeeData.starting_date,
    end_date: employeeData.end_date,
    basic_salary: employeeData.basic_salary,
    nationality_id: employeeData.nationality_id,
    user: userData,
  }
  const employeeResponse = useEmployee()
  console.log(newEmployeeData)
  var employee: Employee =
    (await employeeResponse.updateEmployeeStore(employee_id, newEmployeeData)) ??
    defaultEmployee

  var success: boolean = employeeResponse.success ?? false
  var error_code: string = employeeResponse.error_code ?? ''
  var message: string = employeeResponse.message ?? ''
  return { success, error_code, message, employee }
}
