import { defineStore, acceptHMRUpdate } from 'pinia'
import { defaultCreateUpdateUser, defaultUser } from '../Others/User/userStore'
import { defaultNationality } from '../Others/Nationality/nationalityStore'
import { useApi } from '/@src/composable/useApi'
import {
  CreateEmployee,
  UpdateEmployee,
  Employee,
  addEmployeeApi,
  getEmployeesApi,
  EmployeeSearchFilter,
  getEmployeeApi,
  updateEmployeeApi,
} from '/@src/utils/api/Employee'
import { Pagination, defaultPagination } from '/@src/utils/response'

export const defaultCreateEmployee: CreateEmployee = {
  id: 0,
  starting_date: '',
  end_date: '',
  user: defaultCreateUpdateUser,
  nationality_id: 0,
  basic_salary: 0,
}
export const defaultUpdateEmployee: UpdateEmployee = {
  id: 0,
  starting_date: '',
  end_date: '',
  user: defaultCreateUpdateUser,
  nationality_id: 0,
  basic_salary: 0,
}
export const defaultEmployee: Employee = {
  id: 0,
  starting_date: '',
  end_date: '',
  nationality: defaultNationality,
  basic_salary: 0,
  user: defaultUser,
}
export const defaultEmployeeSearchFilter: EmployeeSearchFilter = {
  name: undefined,
  phone_number: undefined,
  gender: undefined,
  date_between: undefined,
  from: undefined,
  to: undefined,
  city_id: undefined,
  nationality_id: undefined,
  user_status_id: undefined,
  page: undefined,
  per_page: undefined,
  order_by: undefined,
  order: undefined,
}

export const useEmployee = defineStore('employee', () => {
  const api = useApi()
  const employees = ref<Employee[]>([])
  const pagination = ref<Pagination>(defaultPagination)
  const success = ref<boolean>()
  const error_code = ref<string>()
  const message = ref<string>()
  const loading = ref(false)

  async function addEmployeeStore(employee: CreateEmployee) {
    if (loading.value) return

    loading.value = true

    try {
      const response = await addEmployeeApi(api, employee)
      console.log(response.response)
      var returnedEmployee: Employee
      returnedEmployee = response.response.data
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message
      employees.value.push(returnedEmployee)
      return returnedEmployee
    } finally {
      loading.value = false
    }
  }
  async function getEmployeeStore(employee_id: number) {
    if (loading.value) return

    loading.value = true

    try {
      const response = await getEmployeeApi(api, employee_id)
      var returnedEmployee: Employee
      returnedEmployee = response.response.data
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message
      return returnedEmployee
    } finally {
      loading.value = false
    }
  }
  async function updateEmployeeStore(employeeId: number, employee: UpdateEmployee) {
    if (loading.value) return

    loading.value = true

    try {
      const response = await updateEmployeeApi(api, employeeId, employee)

      var returnedEmployee: Employee
      returnedEmployee = response.response.data
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message
      employees.value.push(returnedEmployee)
      return returnedEmployee
    } finally {
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
    } finally {
      loading.value = false
    }
  }

  return {
    employees,
    pagination,
    addEmployeeStore,
    getEmployeesStore,
    updateEmployeeStore,
    getEmployeeStore,
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
