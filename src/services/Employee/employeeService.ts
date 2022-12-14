import { addUser } from '../Others/User/userService'
import { useEmployee } from '/@src/stores/Employee/employeeStore'
import {
  CreateEmployee,
  defaultEmployeePersonalId,
  EmployeeSearchFilter,
  Employee,
  UpdateEmployee,
  defaultEmployee
} from '/@src/models/Employee/employee'
import { CreateUpdateUser } from '/@src/models/Others/User/user'
import { Media, MediaConsts } from '/@src/models/Others/Media/media'
import { Pagination } from '/@src/utils/response'

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

export async function getEmployee(employee_id: number) {
  const employeeResponse = useEmployee()

  var employee: Employee =
    (await employeeResponse.getEmployeeStore(employee_id)) ?? defaultEmployee
  var success: boolean = employeeResponse.success ?? false
  var error_code: string = employeeResponse.error_code ?? ''
  var message: string = employeeResponse.message ?? ''
  return { success, error_code, message, employee }
}

export async function getEmployeesList(searchFilter: EmployeeSearchFilter) {
  const employee = useEmployee()
  await employee.getEmployeesStore(searchFilter)
  var employees: Employee[] = employee.employees
  var pagination: Pagination = employee.pagination
  return { employees, pagination }
}

export async function addPersonalId(employee_id: unknown, fd: FormData) {
  const employeeResponse = useEmployee()
  const is_featured: unknown = true
  fd.append('model_id', employee_id as string)
  fd.append('model_type', MediaConsts.EMPLOYEE_MODEL_ROUTE)
  fd.append('is_featured', String(is_featured))
  var media: Media[] = (await employeeResponse.addEmployeePersonalId(fd)) ?? []
  var success: boolean = employeeResponse.success ?? false
  var error_code: string = employeeResponse.error_code ?? ''
  var message: string = employeeResponse.message ?? ''
  return { success, error_code, message, media }
}
export async function deletePersonalId(picture_id: number) {
  const employeeResponse = useEmployee()
  await employeeResponse.deleteEmployeePersonalId(picture_id)
  var success: boolean = employeeResponse.success ?? false
  var error_code: string = employeeResponse.error_code ?? ''
  var message: string = employeeResponse.message ?? ''
  return { success, error_code, message }
}
export async function getPersonalId(employee_id: number) {
  const employeeResponse = useEmployee()
  var mediaParams = defaultEmployeePersonalId
  mediaParams.is_featured = '1'
  mediaParams.model_id = employee_id
  var media: Media[] = (await employeeResponse.getEmployeePersonalId(mediaParams)) ?? []
  media.forEach((element) => {
    element.relative_path = MediaConsts.MEDIA_BASE_URL + element.relative_path
  })
  var success: boolean = employeeResponse.success ?? false
  var error_code: string = employeeResponse.error_code ?? ''
  var message: string = employeeResponse.message ?? ''
  return { success, error_code, message, media }
}
