import { defineStore, acceptHMRUpdate } from 'pinia'
import { defaultUser } from '../Others/User/userStore'
import { defaultNationality } from '../Others/Nationality/nationalityStore'
import { useApi } from '/@src/composable/useApi'
import {
  CreateUpdateEmployee,
  Employee,
  addEmployeeApi,
  editEmployeeApi,
  getEmployeesApi,
  EmployeeSearchFilter,
} from '/@src/utils/api/Employee'
import { Pagination, defaultPagination } from '/@src/utils/response'

export const defaultCreateUpdateEmployee: CreateUpdateEmployee = {
  id: 0,
  starting_date: '',
  end_date: '',
  user_id: 0,
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

export const useEmployee = defineStore('employee', () => {
  const api = useApi()
  const employees = ref<Employee[]>([])
  const pagination = ref<Pagination>(defaultPagination)

  const loading = ref(false)

  async function addEmployeeStore(employee: CreateUpdateEmployee) {
    if (loading.value) return

    loading.value = true

    try {
      const response = await addEmployeeApi(api, employee)

      var returnedEmployee: Employee
      returnedEmployee = response.response.data
      employees.value.push(returnedEmployee)
      return returnedEmployee
    } finally {
      loading.value = false
    }
  }
  async function editEmployeeStore(employee: CreateUpdateEmployee) {
    if (loading.value) return

    loading.value = true

    try {
      const response = await editEmployeeApi(api, employee)
      var returnedEmployee: Employee
      returnedEmployee = response.response.data
      employees.value.splice(
        employees.value.findIndex((userElement) => (userElement.id = employee.id)),
        1
      )
      employees.value.push(returnedEmployee)
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
    editEmployeeStore,
    getEmployeesStore,
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
