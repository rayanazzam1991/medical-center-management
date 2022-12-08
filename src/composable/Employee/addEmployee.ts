import { addUser } from '../../Others/User/addUser'
import { useEmployee } from '/@src/stores/Employee/employeeStore'
import { CreateUpdateEmployee } from '/@src/utils/api/Employee/Employee'
import { CreateUpdateUser } from '/@src/utils/api/Others/User'

export async function addEmployee(
  employeeData: CreateUpdateEmployee,
  userData: CreateUpdateUser
) {
  userData.password = '1231313'

  const userRespone = await addUser(userData)

  const newEmployeeData: CreateUpdateEmployee = {
    starting_date: employeeData.starting_date,
    end_date: employeeData.end_date,
    nationality_id: employeeData.nationality_id,
    user_id: userRespone?.id ?? 0,
    basic_salary: employeeData.basic_salary,
  }
  const employee = useEmployee()
  return await employee.addEmployeeStore(newEmployeeData)
}
