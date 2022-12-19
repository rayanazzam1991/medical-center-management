import { defineStore, acceptHMRUpdate } from "pinia"
import { useApi } from "/@src/composable/useApi"
import { User, CreateUpdateUser, ChangeUserStatus, UserSearchFilter } from "/@src/models/Others/User/user"
import { deleteUserApi, getUserApi, addUserApi, editUserApi, changeUserStatusApi, getUsersApi, phoneExistsCheckApi } from "/@src/utils/api/Others/User"
import { Pagination, defaultPagination } from "/@src/utils/response"
import sleep from "/@src/utils/sleep"


export const useUser = defineStore('user', () => {
  const api = useApi()
  const users = ref<User[]>([])
  const pagination = ref<Pagination>(defaultPagination)
  const loading = ref(false)
  const success = ref<boolean>()
  const error_code = ref<string>()
  const message = ref<string>()

  async function deleteUserStore(userId: number) {
    if (loading.value) return

    loading.value = true

    try {
      const response = await deleteUserApi(api, userId)
      users.value.splice(
        users.value.findIndex((user: User) => user.id === userId),
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
  async function getUserStore(userId: number) {
    if (loading.value) return

    loading.value = true
    sleep(2000)
    try {
      const response = await getUserApi(api, userId)
      var returnedUser: User
      returnedUser = response.response.data
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message

      return returnedUser
    } catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message
    }
    finally {
      loading.value = false
    }
  }
  async function addUserStore(user: CreateUpdateUser) {
    if (loading.value) return

    sleep(2000)
    try {
      const response = await addUserApi(api, user)
      var returnedUser: User
      returnedUser = response.response.data
      users.value.push(returnedUser)
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message

      return returnedUser
    } catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message
    }
    finally {
      loading.value = false
    }
  }
  async function editUserStore(user: CreateUpdateUser) {
    if (loading.value) return
    loading.value = true
    sleep(2000)
    try {
      const response = await editUserApi(api, user)
      var returnedUser: User
      returnedUser = response.response.data
      users.value.splice(
        users.value.findIndex((userElement) => (userElement.id = user.id)),
        1
      )
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message

      users.value.push(returnedUser)
    } catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message
    }
    finally {
      loading.value = false
    }
  }
  async function changeUserStatusStore(user: ChangeUserStatus) {
    if (loading.value) return

    loading.value = true

    try {
      const response = await changeUserStatusApi(api, user)
      var returnedUser: User
      returnedUser = response.response.data
      users.value.splice(
        users.value.findIndex((userElement) => (userElement.id = user.id)),
        1
      )
      success.value = response.response.success
      error_code.value = response.response.error_code
      message.value = response.response.message

      users.value.push(returnedUser)
    } catch (error: any) {
      success.value = error?.response.data.success
      error_code.value = error?.response.data.error_code
      message.value = error?.response.data.message
    }
    finally {
      loading.value = false
    }
  }
  async function getUsersStore(searchFilter: UserSearchFilter) {
    if (loading.value) return

    loading.value = true

    try {
      const returnedResponse = await getUsersApi(api, searchFilter)
      users.value = returnedResponse.response.data
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
  async function phoneExistsCheckStore(phone_number: string) {
    if (loading.value) return

    loading.value = true

    try {
      const returnedResponse = await phoneExistsCheckApi(api, phone_number)
      success.value = returnedResponse.response.success
      error_code.value = returnedResponse.response.error_code
      message.value = returnedResponse.response.message

      return returnedResponse.response.data as string
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
    users,
    pagination,
    loading,
    deleteUserStore,
    addUserStore,
    editUserStore,
    getUserStore,
    getUsersStore,
    phoneExistsCheckStore,
    changeUserStatusStore,
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
  import.meta.hot.accept(acceptHMRUpdate(useUser, import.meta.hot))
}
