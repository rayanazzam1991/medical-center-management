import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { Department, DepartmentSearchFilter } from "/@src/models/Others/Department/department"
import { deleteDepartmentApi, getDepartmentApi, addDepartmentApi, editDepartmentApi, getDepartmentsApi } from "/@src/utils/api/Others/Department"
import { Pagination, defaultPagination } from "/@src/utils/response"
import sleep from "/@src/utils/sleep"


export const useDepartment = defineStore('department', () => {
  const api = useApi()
  const departments = ref<Department[]>([])
  const pagination = ref<Pagination>(defaultPagination)
  const loading = ref(false)
  const success = ref<boolean>()
  const error_code = ref<string>()
  const message = ref<string>()

  async function deleteDepartmentStore(departmentId: number) {
    if (loading.value) return

    loading.value = true

    try {
      const response = await deleteDepartmentApi(api, departmentId)
      console.log(response.response)
      departments.value.splice(
        departments.value.findIndex(
          (department: Department) => department.id === departmentId
        ),
        1
      )
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message

    } catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message
    }
    finally {
      loading.value = false
    }
  }
  async function getDepartmentStore(departmentId: number) {
    if (loading.value) return
    loading.value = true
    sleep(2000)
    try {
      const response = await getDepartmentApi(api, departmentId)
      var returnedDepartment: Department
      returnedDepartment = response.response.data
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message

      return returnedDepartment
    } catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message
    }
    finally {
      loading.value = false
    }
  }
  async function addDepartmentStore(department: Department) {
    if (loading.value) return
    loading.value = true
    sleep(2000)
    try {
      const response = await addDepartmentApi(api, department)
      var returnedDepartment: Department
      returnedDepartment = response.response.data
      departments.value.push(returnedDepartment)
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message

      return returnedDepartment
    } catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message
    }
    finally {
      loading.value = false
    }
  }
  async function editDepartmentStore(department: Department) {
    if (loading.value) return
    loading.value = true
    sleep(2000)
    try {
      const response = await editDepartmentApi(api, department)
      var returnedDepartment: Department
      returnedDepartment = response.response.data
      departments.value.splice(
        departments.value.findIndex(
          (departmentElement) => (departmentElement.id = department.id)
        ),
        1
      )
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message

      departments.value.push(returnedDepartment)
    } catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message
    }
    finally {
      loading.value = false
    }
  }
  async function getDepartmentsStore(searchFilter: DepartmentSearchFilter) {
    if (loading.value) return

    loading.value = true

    try {
      const returnedResponse = await getDepartmentsApi(api, searchFilter)
      departments.value = returnedResponse.response.data
      pagination.value = returnedResponse.response.pagination
      success.value = returnedResponse.response.success
      error_code.value = returnedResponse.response.error_code
      message.value = returnedResponse.response.message

    } catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message
    }
    finally {
      loading.value = false
    }
  }

  return {
    success,
    error_code,
    message,
    departments,
    pagination,
    loading,
    deleteDepartmentStore,
    addDepartmentStore,
    editDepartmentStore,
    getDepartmentStore,
    getDepartmentsStore,
    loading
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
  import.meta.hot.accept(acceptHMRUpdate(useDepartment, import.meta.hot))
}
