/**
 * This is a store that hold the messaging-v1 state
 * It uses the useApi composition component to make the api calls
 *
 * @see /src/pages/messaging-v1.vue
 * @see /src/composable/useApi.ts
 * @see /src/components/partials/chat/*.vue
 * @see /src/utils/api/chat
 */

import { ref, computed } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'

import {
  SearchFilter,
  Department,
  getDepartmentsApi,
  deleteDepartmentApi,
  addDepartmentApi,
  editDepartmentApi,
  getDepartmentApi,
} from '/@src/utils/api/Others/Department'
import { useApi } from '/@src/composable/useApi'
import { Pagination, defaultPagination } from '/@src/utils/response'

export const defaultDepartment: Department = {
  id: 0,
  name: '',
  status: 0,
}

export const defaultSearchFilter: SearchFilter = {
  name: undefined,
  status: undefined,
  page: undefined,
  order: undefined,
  order_by: undefined,
}

export const useDepartment = defineStore('department', () => {
  const api = useApi()
  const departments = ref<Department[]>([])
  const pagination = ref<Pagination>(defaultPagination)
  const loading = ref(false)

  async function deleteDepartmentStore(departmentId: number) {
    if (loading.value) return

    loading.value = true

    try {
      const response = await deleteDepartmentApi(api, departmentId)
      departments.value.splice(
        departments.value.findIndex(
          (department: Department) => department.id === departmentId
        ),
        1
      )
    } finally {
      loading.value = false
    }
  }
  async function getDepartmentStore(departmentId: number) {
    if (loading.value) return

    loading.value = true

    try {
      const response = await getDepartmentApi(api, departmentId)
      var returnedDepartment: Department
      returnedDepartment = response.response.data
      return returnedDepartment
    } finally {
      loading.value = false
    }
  }
  async function addDepartmentStore(department: Department) {
    if (loading.value) return

    loading.value = true

    try {
      const response = await addDepartmentApi(api, department)
      var returnedDepartment: Department
      returnedDepartment = response.response.data
      departments.value.push(returnedDepartment)
      console.log('store', departments.value)
      return returnedDepartment
    } finally {
      loading.value = false
    }
  }
  async function editDepartmentStore(department: Department) {
    if (loading.value) return

    loading.value = true

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
      departments.value.push(returnedDepartment)
      console.log('store', departments.value)
    } finally {
      loading.value = false
    }
  }
  async function getDepartmentsStore(searchFilter: SearchFilter) {
    if (loading.value) return

    loading.value = true

    try {
      const returnedResponse = await getDepartmentsApi(api, searchFilter)
      departments.value = returnedResponse.response.data
      pagination.value = returnedResponse.response.pagination
    } finally {
      loading.value = false
    }
  }

  return {
    departments,
    pagination,
    deleteDepartmentStore,
    addDepartmentStore,
    editDepartmentStore,
    getDepartmentStore,
    getDepartmentsStore,
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
