import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { Employee, CreateEmployee, UpdateEmployee, EmployeeSearchFilter } from "/@src/models/Employee/employee"
import { EmployeeSchedule, EmployeeScheduleSearchFilter, UpdateSchedule } from "../../models/HR/Attendance/EmployeeSchedule/employeeSchedule"
import { Media } from "/@src/models/Others/Media/media"
import { addEmployeeApi, getEmployeeApi, updateEmployeeApi, getEmployeesApi, getEmployeesScheduleApi, updateEmployeeScheduleApi, maxEmployeeNumberApi, updateEmployeeNumberApi, getEmployeesAttendanceApi } from "/@src/utils/api/Employee"
import { uploadMediaApi, getMediaApi, deleteMediaApi } from "/@src/utils/api/Others/Media"
import { Pagination, defaultPagination } from "/@src/utils/response"
import sleep from "/@src/utils/sleep"
import { EmployeeAttendance, EmployeeAttendanceSearchFilter } from "/@src/models/HR/Attendance/EmployeeAttendance/employeeAttendance"


export const useEmployee = defineStore('employee', () => {
  const api = useApi()
  const employees = ref<Employee[]>([])
  const employeesSchedule = ref<EmployeeSchedule[]>([])
  const employeesAttendance = ref<EmployeeAttendance[]>([])
  const pagination = ref<Pagination>(defaultPagination)
  const success = ref<boolean>()
  const error_code = ref<string>()
  const message = ref<string>()
  const loading = ref(false)

  async function addEmployeeStore(employee: CreateEmployee) {
    if (loading.value) return
    loading.value = true
    sleep(2000)
    try {
      const response = await addEmployeeApi(api, employee)
      var returnedEmployee: Employee
      returnedEmployee = response.response.data
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message
      employees.value.push(returnedEmployee)

      return returnedEmployee
    }
    catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message

    }
    finally {
      loading.value = false
    }
  }
  async function getEmployeeStore(employee_id: number) {
    if (loading.value) return
    loading.value = true
    sleep(2000)
    try {
      const response = await getEmployeeApi(api, employee_id)
      var returnedEmployee: Employee
      returnedEmployee = response.response.data
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message
      return returnedEmployee
    }
    catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message

    }
    finally {
      loading.value = false
    }
  }
  async function updateEmployeeStore(employeeId: number, employee: UpdateEmployee) {
    if (loading.value) return
    loading.value = true
    sleep(2000)
    try {
      const response = await updateEmployeeApi(api, employeeId, employee)

      var returnedEmployee: Employee
      returnedEmployee = response.response.data
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message
      employees.value.push(returnedEmployee)
      return returnedEmployee
    }
    catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message

    }
    finally {
      loading.value = false
    }
  }
  async function getEmployeesStore(searchFilter: EmployeeSearchFilter) {
    if (loading.value) return

    loading.value = true

    try {
      const returnedResponse = await getEmployeesApi(api, searchFilter)
      employees.value = returnedResponse.response.data
      pagination.value = returnedResponse.response.pagination
      success.value = returnedResponse.response.success
      error_code.value = returnedResponse.response.error_code
      message.value = returnedResponse.response.message

    }
    catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message

    }
    finally {
      loading.value = false
    }
  }

  async function addEmployeePersonalId(media: FormData) {
    if (loading.value) return
    loading.value = true
    sleep(2000)
    try {
      const response = await uploadMediaApi(api, media)
      var returnedMedia: Media[]
      returnedMedia = response.response.data
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message

      return returnedMedia

    }
    catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message

    } finally {
      loading.value = false
    }
  }

  async function getEmployeePersonalId(media: Media) {
    if (loading.value) return
    loading.value = true
    sleep(2000)
    try {
      const response = await getMediaApi(api, media)
      var returnedMedia: Media[]
      returnedMedia = response.response.data
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message

      return returnedMedia

    }
    catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message

    } finally {
      loading.value = false
    }
  }
  async function getEmployeeProfilePicture(media: Media) {
    if (loading.value) return
    loading.value = true
    sleep(2000)
    try {
      const response = await getMediaApi(api, media)
      var returnedMedia: Media[]
      returnedMedia = response.response.data
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message
      return returnedMedia
    }
    catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message
    }

    finally {
      loading.value = false
    }
  }
  async function getEmployeeFilesStore(media: Media) {
    if (loading.value) return
    loading.value = true
    sleep(2000)
    try {
      const response = await getMediaApi(api, media)
      var returnedMedia: Media[]
      returnedMedia = response.response.data
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message

      return returnedMedia

    }
    catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message

    }

    finally {
      loading.value = false
    }
  }

  async function addEmployeeFileStore(media: FormData) {
    if (loading.value) return
    loading.value = true
    sleep(2000)
    try {
      const response = await uploadMediaApi(api, media)
      var returnedMedia: Media[]
      returnedMedia = response.response.data
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message

      return returnedMedia

    }
    catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message

    }

    finally {
      loading.value = false
    }
  }

  async function deleteEmployeeFile(picture_id: number) {
    if (loading.value) return
    loading.value = true
    sleep(2000)
    try {
      const response = await deleteMediaApi(api, picture_id)
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message

      return response

    }
    catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message

    }

    finally {
      loading.value = false
    }
  }

  async function getEmployeesScheduleStore(searchFilter: EmployeeScheduleSearchFilter) {
    if (loading.value) return

    loading.value = true

    try {
      const returnedResponse = await getEmployeesScheduleApi(api, searchFilter)
      employeesSchedule.value = returnedResponse.response.data
      pagination.value = returnedResponse.response.pagination
      success.value = returnedResponse.response.success
      error_code.value = returnedResponse.response.error_code
      message.value = returnedResponse.response.message

    }
    catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message

    }
    finally {
      loading.value = false
    }
  }
  async function updateEmployeeScheduleStore(employee_id: number, date_id: number, data: UpdateSchedule) {
    if (loading.value) return

    loading.value = true

    try {
      const returnedResponse = await updateEmployeeScheduleApi(api, employee_id, date_id, data)
      success.value = returnedResponse.response.success
      error_code.value = returnedResponse.response.error_code
      message.value = returnedResponse.response.message

    }
    catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message

    }
    finally {
      loading.value = false
    }
  }
  async function getMaxEmployeeNumberStore() {
    if (loading.value) return

    loading.value = true

    try {
      const returnedResponse = await maxEmployeeNumberApi(api)
      success.value = returnedResponse.response.success
      error_code.value = returnedResponse.response.error_code
      message.value = returnedResponse.response.message
      return returnedResponse.response.data

    }
    catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message

    }
    finally {
      loading.value = false
    }
  }

  async function updateEmployeeNumberStore(employee_id: number, employee_number: number) {
    if (loading.value) return

    loading.value = true

    try {
      const returnedResponse = await updateEmployeeNumberApi(api, employee_id, employee_number)
      success.value = returnedResponse.response.success
      error_code.value = returnedResponse.response.error_code
      message.value = returnedResponse.response.message

    }
    catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message

    }
    finally {
      loading.value = false
    }
  }
  async function getEmployeesAttendanceStore(searchFilter: EmployeeAttendanceSearchFilter) {
    if (loading.value) return

    loading.value = true

    try {
      const returnedResponse = await getEmployeesAttendanceApi(api, searchFilter)
      employeesAttendance.value = returnedResponse.response.data
      pagination.value = returnedResponse.response.pagination
      success.value = returnedResponse.response.success
      error_code.value = returnedResponse.response.error_code
      message.value = returnedResponse.response.message

    }
    catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message

    }
    finally {
      loading.value = false
    }
  }


  return {
    employees,
    employeesSchedule,
    employeesAttendance,
    pagination,
    loading,
    addEmployeeStore,
    getEmployeesStore,
    updateEmployeeStore,
    getEmployeeStore,
    deleteEmployeeFile,
    addEmployeeFileStore,
    getEmployeeFilesStore,
    getEmployeeProfilePicture,
    addEmployeePersonalId,
    getEmployeesScheduleStore,
    updateEmployeeScheduleStore,
    getMaxEmployeeNumberStore,
    updateEmployeeNumberStore,
    getEmployeesAttendanceStore,
    success,
    error_code,
    message,
  } as const
})

/**
 * Pinia supports Hot Module replacement so you can edit your stores and
 * interact with them directly in your app without reloading the page.
 *
 * @see https://pinia.esm.dev/cookbook/hot-module-replacement.html
 * @see https://vitejs.dev/guide/api-hmr.html
 */
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useEmployee, import.meta.hot))
}
