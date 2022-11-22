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

import { Department, getDepartments, deleteDepartmentApi } from '/@src/utils/api/Others/Department'
import { useApi } from '/@src/composable/useApi'

const defaultDepartment: Department = {
    id: 0,
    name: '',
    status: 0,
}

export const useDepartment = defineStore('department', () => {
    const api = useApi()
    const departments = ref<Department[]>([])
    const loading = ref(false)

    async function loadDepartments(start = 0, limit = 10) {
        if (loading.value) return

        loading.value = true

        try {
            const returnedResponse = await getDepartments(api, start, limit)
            departments.value = returnedResponse.response.data

        } finally {
            loading.value = false
        }
    }
    async function deleteDepartmentStore(departmentId: number) {
        if (loading.value) return

        loading.value = true

        try {
            const response = await deleteDepartmentApi(api, departmentId)
            departments.value.splice(departments.value.findIndex((department: Department) => department.id === departmentId), 1)

        } finally {
            loading.value = false
        }
    }

    return {
        departments,
        loadDepartments,
        deleteDepartmentStore
    } as const
})

/**
 * Pinia supports Hot Module replacement so you can edit your stores and
 * interact with them directly in your app without reloading the page.
 *
 * @see https://pinia.esm.dev/cookbook/hot-module-replacement.html
 * @see https://vitejs.dev/guide/api-hmr.html
 */
// if (import.meta.hot) {
//     import.meta.hot.accept(acceptHMRUpdate(useDepartment, import.meta.hot))
// }
