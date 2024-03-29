import { AxiosInstance } from "axios"
import { CustomResponseSingle, CustomResponseCollection } from "../../response"
import { CreateEmployee, UpdateEmployee, EmployeeSearchFilter } from "/@src/models/Employee/employee"
import { EmployeeScheduleSearchFilter, UpdateSchedule } from "../../../models/HR/Attendance/EmployeeSchedule/employeeSchedule"
import { EmployeeAttendanceSearchFilter } from "/@src/models/HR/Attendance/EmployeeAttendance/employeeAttendance"


export async function addEmployeeApi(
  api: AxiosInstance,
  employee: CreateEmployee
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.post(`employee`, employee)
  return { response }
}
export async function updateEmployeeApi(
  api: AxiosInstance,
  employeeId: number,
  employee: UpdateEmployee
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.put(`employee/${employeeId}`, employee)
  return { response }
}
export async function getEmployeeApi(
  api: AxiosInstance,
  employee_id: number
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.get(`employee/${employee_id}`)
  return { response }
}

export async function getEmployeesApi(
  api: AxiosInstance,
  searchFilter: EmployeeSearchFilter
): Promise<{ response: CustomResponseCollection }> {
  const { data: response, headers } = await api.get('employee/getEmployeesList', {
    params: searchFilter,
  })
  return { response }
}
export async function getEmployeesScheduleApi(
  api: AxiosInstance,
  searchFilter: EmployeeScheduleSearchFilter
): Promise<{ response: CustomResponseCollection }> {
  const { data: response, headers } = await api.get('employee/getEmployeesSchedule', {
    params: searchFilter,
  })
  return { response }
}
export async function updateEmployeeScheduleApi(
  api: AxiosInstance,
  employee_id: number,
  date_id: number,
  data: UpdateSchedule
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.put(`employee/${employee_id}/updateEmployeeSchedule/${date_id}`, data)
  return { response }
}
export async function maxEmployeeNumberApi(
  api: AxiosInstance,
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.get(`employee/maxEmployeeNumber`)
  return { response }
}

export async function updateEmployeeNumberApi(
  api: AxiosInstance,
  employee_id: number,
  employee_number: number,
): Promise<{ response: CustomResponseSingle }> {
  const { data: response, headers } = await api.put(`employee/${employee_id}/updateEmployeeNumber`, { "employee_number": employee_number })
  return { response }
}

export async function getEmployeesAttendanceApi(
  api: AxiosInstance,
  searchFilter: EmployeeAttendanceSearchFilter
): Promise<{ response: CustomResponseCollection }> {
  const { data: response, headers } = await api.get('employee/getEmployeeAttendance', {
    params: searchFilter,
  })
  return { response }
}
