<script lang="ts">
import { defaultPagination } from "/@src/utils/response"
import { useI18n } from "vue-i18n"
import { getUsersList, getUsersWithoutCustomerList } from "/@src/services/Others/User/userService"
import { User, UserSearchFilter } from "/@src/models/Others/User/user"
import { defaultEmployeeHistoriesSearchFilter, EmployeeHistoriesSearchFilter } from "/@src/models/Employee/employeeHistories"

export default defineComponent({
  props: {
    title: {
      type: String,
      default: '',
    },
    button_name: {
      type: String,
      default: '',
    },
    pagination: {
      default: defaultPagination,
    },
    default_per_page: {
      type: Number,
      default: 1,
    }

  },
  setup(props, context) {
    const { t } = useI18n()

    const searchFilterPop = ref(false)
    const keyTest = ref(0)
    const default_per_page = props.default_per_page
    const pagination = props.pagination
    const searchEmployeeName = ref<string | undefined>(undefined)
    const searchNotes = ref<string | undefined>(undefined)
    const perPage = ref(pagination.per_page)
    const searchFilter = ref(defaultEmployeeHistoriesSearchFilter)
    const usersList = ref<User[]>([])
    const search = () => {
      searchFilter.value = {
        employee_name: searchEmployeeName.value,
        notes: searchNotes.value,
        per_page: perPage.value
      }
      context.emit('search', searchFilter.value)
    }
    onMounted(async () => {
      const { users } = await getUsersWithoutCustomerList(searchFilter.value)
      usersList.value = users
    })

    const resetFilter = () => {
      searchEmployeeName.value = undefined
      searchNotes.value = undefined
      searchFilter.value.employee_name = undefined
      searchFilter.value.notes = undefined
      keyTest.value++
      context.emit('resetFilter', searchFilter.value)

    }
    const search_filter = (value: EmployeeHistoriesSearchFilter) => {
      searchFilter.value = value
      searchFilter.value.per_page = perPage.value
      searchFilter.value.page = 1

      context.emit('search', searchFilter.value)
    }
    const resetFilter_popup = (value: EmployeeHistoriesSearchFilter) => {
      searchFilter.value.employee_name = undefined
      searchFilter.value.notes = undefined
      context.emit('resetFilter', searchFilter.value)

    }
    return { t, resetFilter, resetFilter_popup, usersList, getUsersList, getUsersWithoutCustomerList, searchNotes, search_filter, searchFilterPop, search, default_per_page, searchEmployeeName, keyTest, perPage, pagination }
  },
})
</script>

<template>
  <form class="form-layout" v-on:submit.prevent="search">
    <div class="form-outer">
      <div class="form-header stuck-header">
        <div class="form-header-inner">
          <div class="left my-4 mx-2 ">
            <div class="columns is-flex is-align-items-center">

              <VControl class="mr-2" icon="feather:search">
                <VInput v-model="searchEmployeeName" type="text"
                  :placeholder="t('dismissed_employee.search_filter.employee_name')" />
              </VControl>
              <VControl class="mr-2" icon="feather:search">
                <VInput v-model="searchNotes" type="text" :placeholder="t('dismissed_employee.search_filter.notes')" />
              </VControl>

              <VIconButton class="mr-2" type="submit" v-on:click="search" icon="feather:search" />
              <VIconButton class="mr-2" type="submit" v-on:click="resetFilter" icon="feather:rotate-ccw" :raised="false"
                color="danger" />
            </div>
          </div>
          <div class="left my-4 mx-2">
            <div class="columns is-flex is-align-items-center">
              <VControl class="mr-2 ">
                <div class="select">

                  <select v-model="perPage" @change="search">
                    <VOption :value="default_per_page * 0.1">{{ default_per_page *
                      0.1
                    }}
                    </VOption>
                    <VOption :value="default_per_page * 0.5">{{ default_per_page * 0.5 }}
                    </VOption>
                    <VOption :value="default_per_page">{{ default_per_page }}
                    </VOption>
                    <VOption :value="default_per_page * 2">{{ default_per_page * 2 }}
                    </VOption>
                    <VOption :value="default_per_page * 10">{{ default_per_page * 10 }}
                    </VOption>
                  </select>
                </div>
              </VControl>
            </div>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<style   lang="scss">
@import '/@src/scss/styles/tableHeader.scss';

.width {
  width: 200px;
}
</style>

