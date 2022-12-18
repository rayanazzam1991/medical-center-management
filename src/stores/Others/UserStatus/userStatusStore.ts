import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { UserStatus, UserStatusSearchFilter } from "/@src/models/Others/UserStatus/userStatus"
import { deleteUserStatusApi, getUserStatusApi, addUserStatusApi, editUserStatusApi, getUserStatusesApi } from "/@src/utils/api/Others/UserStatus"
import { Pagination, defaultPagination } from "/@src/utils/response"
import sleep from "/@src/utils/sleep";

export const useUserStatus = defineStore('userstatus', () => {
  const api = useApi()
  const userstatuses = ref<UserStatus[]>([])
  const pagination = ref<Pagination>(defaultPagination)
  const loading = ref(false)

  async function deleteUserStatusStore(userstatusId: number) {
    if (loading.value) return

    loading.value = true

    try {
      const response = await deleteUserStatusApi(api, userstatusId)
      userstatuses.value.splice(
        userstatuses.value.findIndex(
          (userstatus: UserStatus) => userstatus.id === userstatusId
        ),
        1
      )
    } finally {
      loading.value = false
    }
  }
  async function getUserStatusStore(userstatusId: number) {
    if (loading.value) return
    loading.value = true
    sleep(2000)
    try {
      const response = await getUserStatusApi(api, userstatusId)
      var returnedUserStatus: UserStatus
      returnedUserStatus = response.response.data
      return returnedUserStatus
    } finally {
      loading.value = false
    }
  }
  async function addUserStatusStore(userstatus: UserStatus) {
    if (loading.value) return
    loading.value = true
    sleep(2000)
    try {
      const response = await addUserStatusApi(api, userstatus)
      var returnedUserStatus: UserStatus
      returnedUserStatus = response.response.data
      userstatuses.value.push(returnedUserStatus)
      return returnedUserStatus
    } finally {
      loading.value = false
    }
  }
  async function editUserStatusStore(userstatus: UserStatus) {
    if (loading.value) return
    loading.value = true
    sleep(2000)
    try {
      const response = await editUserStatusApi(api, userstatus)
      var returnedUserStatus: UserStatus
      returnedUserStatus = response.response.data
      userstatuses.value.splice(
        userstatuses.value.findIndex(
          (userstatusElement) => (userstatusElement.id = userstatus.id)
        ),
        1
      )
      userstatuses.value.push(returnedUserStatus)
    } finally {
      loading.value = false
    }
  }
  async function getUserStatusesStore(searchFilter: UserStatusSearchFilter) {
    if (loading.value) return

    loading.value = true

    try {
      const returnedResponse = await getUserStatusesApi(api, searchFilter)
      userstatuses.value = returnedResponse.response.data
      pagination.value = returnedResponse.response.pagination
    } finally {
      loading.value = false
    }
  }

  return {
    userstatuses,
    pagination,
    deleteUserStatusStore,
    addUserStatusStore,
    editUserStatusStore,
    getUserStatusStore,
    getUserStatusesStore,
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
  import.meta.hot.accept(acceptHMRUpdate(useUserStatus, import.meta.hot))
}
