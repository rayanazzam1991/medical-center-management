<script lang="ts">
import { defaultPagination } from "/@src/utils/response"
import { useI18n } from "vue-i18n"
import { ActivityLogSearchFilter, defaultActivityLogSearchFilter } from "/@src/models/Others/ActivityLog/activityLog"
import { getUsersList, getUsersWithoutCustomerList } from "/@src/services/Others/User/userService"
import { User, UserSearchFilter } from "/@src/models/Others/User/user"

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
    },
    with_title: {
      type: Boolean,
      default: false,
    },

  },
  setup(props, context) {
    const { t } = useI18n()

    const searchFilterPop = ref(false)
    const keyTest = ref(0)
    const default_per_page = props.default_per_page
    const pagination = props.pagination
    const searchSubjectTypeView = ref<string | undefined>(undefined)
    const searchUserId = ref<number | undefined>(undefined)
    const perPage = ref(pagination.per_page)
    const searchFilter = ref(defaultActivityLogSearchFilter)
    const usersList = ref<User[]>([])
    const search = () => {
      searchFilter.value = {
        subject_type_view: searchSubjectTypeView.value,
        user_id: searchUserId.value,
        per_page: perPage.value
      }
      context.emit('search', searchFilter.value)
    }
    onMounted(async () => {
      const { users } = await getUsersWithoutCustomerList(searchFilter.value)
      usersList.value = users
    })

    const resetFilter = () => {
      searchSubjectTypeView.value = undefined
      searchUserId.value = undefined
      searchFilter.value.subject_type_view = undefined
      searchFilter.value.user_id = undefined
      keyTest.value++
      context.emit('resetFilter', searchFilter.value)

    }
    const search_filter = (value: ActivityLogSearchFilter) => {
      searchFilter.value = value
      searchFilter.value.per_page = perPage.value
      searchFilter.value.page = 1

      context.emit('search', searchFilter.value)
    }
    const resetFilter_popup = (value: ActivityLogSearchFilter) => {
      searchFilter.value.subject_type_view = undefined
      context.emit('resetFilter', searchFilter.value)

    }
    return { t, resetFilter, resetFilter_popup, usersList, getUsersList, getUsersWithoutCustomerList, searchUserId, search_filter, searchFilterPop, search, default_per_page, searchSubjectTypeView, keyTest, perPage, pagination }
  },
})
</script>

<template>
  <form class="form-layout" v-on:submit.prevent="search">
    <div class="form-outer">
      <div class="form-header stuck-header">
        <h1 v-if="$props.with_title" class="title">
          {{ t('activityLog.table.title') }}
        </h1>
        <div class="form-header-inner">
          <div class="left my-4 mx-2 ">
            <div class="columns is-flex is-align-items-center">

              <VControl class="mr-2" icon="feather:search">
                <VInput v-model="searchSubjectTypeView" type="text"
                  :placeholder="t('activityLog.search_filter.class_name')" />
              </VControl>
              <VControl class="width mr-2">
                <Multiselect :key="keyTest" v-model="searchUserId" mode="single"
                  :placeholder="t('activityLog.search_filter.select_user')" :close-on-select="true" ref="user_id"
                  :filter-results="false" :min-chars="0" :resolve-on-load="false" :infinite="true" :limit="20" :rtl="true"
                  :max="1" :clear-on-search="true" :delay="0" :searchable="true" :canClear="true" :options="async (query: any) => {
                    let userSearchFilter = {
                      name: query,
                    } as UserSearchFilter
                    const data = await getUsersWithoutCustomerList(userSearchFilter)
                    //@ts-ignore
                    return data.users.map((user: User) => {
                      return { value: user.id, label: user.first_name + ' ' + user.last_name }
                    })
                  }" @open="(select$: any) => { if (select$.noOptions) { select$.resolveOptions() } }" />
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

