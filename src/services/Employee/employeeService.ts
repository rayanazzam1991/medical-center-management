import { addUser } from '../Others/User/userService'
import { useEmployee } from '/@src/stores/Employee/employeeStore'
import {
  CreateEmployee,
  defaultEmployeeFiles,
  defaultEmployeeProfilePic,
  EmployeeSearchFilter,
  Employee,
  UpdateEmployee,
  defaultEmployee
} from '/@src/models/Employee/employee'
import { CreateUpdateUser } from '/@src/models/Others/User/user'
import { Media, MediaConsts } from '/@src/models/Others/Media/media'
import { Pagination } from '/@src/utils/response'
import { EmployeeSchedule, EmployeeScheduleSearchFilter, UpdateSchedule } from '../../models/HR/Attendance/EmployeeSchedule/employeeSchedule'
import { EmployeeAttendance, EmployeeAttendanceSearchFilter } from '/@src/models/HR/Attendance/EmployeeAttendance/employeeAttendance'

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
    position_id: employeeData.position_id,
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
    position_id: employeeData.position_id,
    user: userData,
  }
  const employeeResponse = useEmployee()
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
export async function getProfilePicture(employee_id: number) {
  const employeeResponse = useEmployee()
  var mediaParams = defaultEmployeeProfilePic
  mediaParams.is_featured = '1'
  mediaParams.model_id = employee_id
  var media: Media[] = await employeeResponse.getEmployeeProfilePicture(mediaParams) ?? []
  media.forEach(element => {
    element.file_name = element.relative_path
    element.relative_path = MediaConsts.MEDIA_BASE_URL + element.relative_path
  });

  var success: boolean = employeeResponse.success ?? false
  var error_code: string = employeeResponse.error_code ?? ''
  var message: string = employeeResponse.message ?? ''
  return { success, error_code, message, media }
}
export async function getEmployeesList(searchFilter: EmployeeSearchFilter) {
  const employee = useEmployee()
  await employee.getEmployeesStore(searchFilter)
  var employees: Employee[] = employee.employees
  var pagination: Pagination = employee.pagination
  return { employees, pagination }
}


export async function getEmployeeFiles(employeee_id: number) {
  const employeeeResponse = useEmployee()
  var mediaParams = defaultEmployeeFiles
  mediaParams.is_featured = '0'
  mediaParams.model_id = employeee_id
  var media: Media[] = await employeeeResponse.getEmployeeFilesStore(mediaParams) ?? []
  media.forEach(element => {
    element.file_name = element.relative_path
    element.relative_path = MediaConsts.MEDIA_BASE_URL + element.relative_path
  });
  var success: boolean = employeeeResponse.success ?? false
  var error_code: string = employeeeResponse.error_code ?? ''
  var message: string = employeeeResponse.message ?? ''
  return { success, error_code, message, media }
}

export async function addEmployeeFile(employeee_id: unknown, fd: FormData) {
  const employeeeResponse = useEmployee()
  const is_featured: unknown = false
  fd.append('model_id', employeee_id as string)
  fd.append('model_type', MediaConsts.EMPLOYEE_MODEL_ROUTE)
  fd.append('is_featured', String(is_featured))
  var media: Media[] = await employeeeResponse.addEmployeeFileStore(fd) ?? []
  var success: boolean = employeeeResponse.success ?? false
  var error_code: string = employeeeResponse.error_code ?? ''
  var message: string = employeeeResponse.message ?? ''
  return { success, error_code, message, media }
}

export async function deleteFile(picture_id: number) {
  const employeeeResponse = useEmployee()
  await employeeeResponse.deleteEmployeeFile(picture_id)
  var success: boolean = employeeeResponse.success ?? false
  var error_code: string = employeeeResponse.error_code ?? ''
  var message: string = employeeeResponse.message ?? ''
  return { success, error_code, message }
}

export async function addProfilePicture(employeee_id: unknown, fd: FormData) {
  const employeeeResponse = useEmployee()
  const is_featured: unknown = true
  fd.append('model_id', employeee_id as string)
  fd.append('model_type', MediaConsts.EMPLOYEE_MODEL_ROUTE)
  fd.append('is_featured', String(is_featured))
  var media: Media[] = await employeeeResponse.addEmployeeFileStore(fd) ?? []
  var success: boolean = employeeeResponse.success ?? false
  var error_code: string = employeeeResponse.error_code ?? ''
  var message: string = employeeeResponse.message ?? ''
  return { success, error_code, message, media }
}

export async function getEmployeesSchedule(searchFilter: EmployeeScheduleSearchFilter) {
  const employee = useEmployee()
  await employee.getEmployeesScheduleStore(searchFilter)
  const employeesSchedule: EmployeeSchedule[] = employee.employeesSchedule
  const pagination: Pagination = employee.pagination
  const success: boolean = employee.success ?? false
  const error_code: string = employee.error_code ?? ''
  const message: string = employee.message ?? ''

  return { employeesSchedule, pagination, success, message }
}

export async function updateEmployeeSchedule(employee_id: number, date_id: number, data: UpdateSchedule) {
  const employee = useEmployee()
  await employee.updateEmployeeScheduleStore(employee_id, date_id, data)
  const success: boolean = employee.success ?? false
  const error_code: string = employee.error_code ?? ''
  const message: string = employee.message ?? ''

  return { error_code, success, message }
}
export async function getMaxEmployeeNumber() {
  const employee = useEmployee()
  const result = await employee.getMaxEmployeeNumberStore()
  const success: boolean = employee.success ?? false
  const error_code: string = employee.error_code ?? ''
  const message: string = employee.message ?? ''

  return { error_code, success, message, result }
}
export async function updateEmployeeNumber(employee_id: number, employee_number: number) {
  const employee = useEmployee()
  await employee.updateEmployeeNumberStore(employee_id, employee_number)
  const success: boolean = employee.success ?? false
  const error_code: string = employee.error_code ?? ''
  const message: string = employee.message ?? ''

  return { error_code, success, message }
}
export async function getEmployeesAttendance(searchFilter: EmployeeAttendanceSearchFilter) {
  const employee = useEmployee()
  await employee.getEmployeesAttendanceStore(searchFilter)
  const employeesAttendance: EmployeeAttendance[] = employee.employeesAttendance
  const pagination: Pagination = employee.pagination
  const success: boolean = employee.success ?? false
  const error_code: string = employee.error_code ?? ''
  const message: string = employee.message ?? ''

  return { employeesAttendance, pagination, success, message, error_code }
}


