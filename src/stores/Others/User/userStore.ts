import { ref } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'

import {
  UserSearchFilter,
  User,
  CreateUpdateUser,
  getUsersApi,
  deleteUserApi,
  addUserApi,
  editUserApi,
  getUserApi,
  phoneExistsCheckApi,
} from '/@src/utils/api/Others/User'
import { useApi } from '/@src/composable/useApi'
import { Pagination, defaultPagination } from '/@src/utils/response'
import { defaultCity } from '../City/cityStore'
import { defaultUserStatus } from '../UserStatus/userStatusStore'
import { defaultRoom } from '../Room/roomStore'
import { defaultDepartment } from '../Department/departmentStore'

export const defaultCreateUpdateUser: CreateUpdateUser = {
  id: undefined,
  first_name: '',
  last_name: '',
  gender: '',
  birth_date: '',
  phone_number: '',
  address: '',
  room_id: 0,
  city_id: 0,
  user_status_id: 0,
  password: '0000000000',
}
export const defaultUser: User = {
  id: 0,
  first_name: '',
  last_name: '',
  gender: '',
  birth_date: '',
  phone_number: '',
  address: '',
  room: defaultRoom,
  city: defaultCity,
  status: defaultUserStatus,
  password: '',
  token:undefined
}

export const defaultUserSearchFilter: UserSearchFilter = {
  name: undefined,
  gender: undefined,
  phone_number: undefined,
  room_id: undefined,
  city_id: undefined,
  user_status_id: undefined,
  page: undefined,
  order: undefined,
  order_by: undefined,
  per_page: undefined,
}

export const useUser = defineStore('user', () => {
  const api = useApi()
  const users = ref<User[]>([])
  const pagination = ref<Pagination>(defaultPagination)
  const loading = ref(false)

  async function deleteUserStore(userId: number) {
    if (loading.value) return

    loading.value = true

    try {
      const response = await deleteUserApi(api, userId)
      users.value.splice(
        users.value.findIndex((user: User) => user.id === userId),
        1
      )
    } finally {
      loading.value = false
    }
  }
  async function getUserStore(userId: number) {
    if (loading.value) return

    loading.value = true

    try {
      const response = await getUserApi(api, userId)
      var returnedUser: User
      returnedUser = response.response.data
      return returnedUser
    } finally {
      loading.value = false
    }
  }
  async function addUserStore(user: CreateUpdateUser) {
    if (loading.value) return

    loading.value = true

    try {
      const response = await addUserApi(api, user)
      var returnedUser: User
      returnedUser = response.response.data
      users.value.push(returnedUser)
      return returnedUser
    } finally {
      loading.value = false
    }
  }
  async function editUserStore(user: CreateUpdateUser) {
    if (loading.value) return

    loading.value = true

    try {
      const response = await editUserApi(api, user)
      var returnedUser: User
      returnedUser = response.response.data
      users.value.splice(
        users.value.findIndex((userElement) => (userElement.id = user.id)),
        1
      )
      users.value.push(returnedUser)
    } finally {
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
    } finally {
      loading.value = false
    }
  }
  async function phoneExistsCheckStore(phone_number: string) {
    if (loading.value) return

    loading.value = true

    try {
      const returnedResponse = await phoneExistsCheckApi(api, phone_number)
      return returnedResponse.response.data as string
    } finally {
      loading.value = false
    }
  }

  return {
    users,
    pagination,
    deleteUserStore,
    addUserStore,
    editUserStore,
    getUserStore,
    getUsersStore,
    phoneExistsCheckStore,
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
