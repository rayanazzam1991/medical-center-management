import { addUser } from '../Others/User/addUser'
import { defaultEmployee, useEmployee } from '/@src/stores/Employee/employeeStore'
import { CreateEmployee, Employee } from '/@src/utils/api/Employee'
import { CreateUpdateUser } from '/@src/utils/api/Others/User'

export async function addEmployee(
  employeeData: CreateEmployee,
  userData: CreateUpdateUser
) {
  userData.password = '1231313'

  const newEmployeeData: CreateEmployee = {
    starting_date: employeeData.starting_date,
    end_date: employeeData.end_date,
    basic_salary: employeeData.basic_salary,
    nationality_id: employeeData.nationality_id,
    user: userData,
  }
  const employeeResponse = useEmployee()

  var employee: Employee =
    (await employeeResponse.addEmployeeStore(newEmployeeData)) ?? defaultEmployee

  var success: boolean = employeeResponse.success ?? false
  var error_code: string = employeeResponse.error_code ?? ''
  var message: string = employeeResponse.message ?? ''
  return { success, error_code, message, employee }
}
