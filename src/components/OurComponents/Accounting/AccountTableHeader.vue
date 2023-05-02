<script lang="ts">
import { defaultPagination } from "/@src/utils/response"
import { useI18n } from "vue-i18n"
import { defaultAccountSearchFilter, AccountConsts, AccountSearchFilter } from "/@src/models/Accounting/Account/account"
import { Permissions } from "/@src/utils/consts/rolesPermissions"
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
    const onOpen = () => {
      searchFilterPop.value = !searchFilterPop.value
      context.emit('onOpen', searchFilterPop.value)
    }
    const popUpTrigger = (value: boolean) => {
      searchFilterPop.value = value
    }
    const searchFilterPop = ref(false)
    const keyTest = ref(0)
    const default_per_page = props.default_per_page
    const pagination = props.pagination
    const searchName = ref('')
    const searchCode = ref('')
    const searchStatus = ref()
    const perPage = ref(pagination.per_page)
    const searchFilter = ref(defaultAccountSearchFilter)
    const search = () => {
      searchFilter.value = {
        name: searchName.value,
        status: searchStatus.value,
        code: searchCode.value,
        per_page: perPage.value
      }
      context.emit('search', searchFilter.value)

    }
    const resetFilter = () => {
      searchName.value = ''
      searchCode.value = ''
      searchStatus.value = undefined
      searchFilter.value.name = undefined
      searchFilter.value.code = undefined
      searchFilter.value.status = undefined
      keyTest.value++
      context.emit('resetFilter', searchFilter.value)

    }
    const search_filter = (value: AccountSearchFilter) => {
      searchFilter.value = value
      searchFilter.value.per_page = perPage.value
      searchFilter.value.page = 1

      context.emit('search', searchFilter.value)
    }
    const resetFilter_popup = (value: AccountSearchFilter) => {
      searchFilter.value.name = undefined
      searchFilter.value.code = undefined
      searchFilter.value.status = undefined
      context.emit('resetFilter', searchFilter.value)

    }
    return { t, resetFilter, popUpTrigger, resetFilter_popup, search_filter, Permissions, searchFilterPop, search, default_per_page, searchName, onOpen, keyTest, searchStatus, searchCode, perPage, pagination, AccountConsts }
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
              <VControl class="mr-2 status-input">
                <VSelect v-model="searchStatus">
                  <VOption value="">{{ t('account.search_filter.status') }}</VOption>
                  <VOption value="0">{{ AccountConsts.getAccountStatusName(0) }}</VOption>
                  <VOption value="1">{{ AccountConsts.getAccountStatusName(1) }}</VOption>
                </VSelect>
              </VControl>
              <VIconButton class="mr-2" type="submit" v-on:click="search" icon="feather:search" />
              <VIconButton class="mr-2" type="submit" v-on:click="resetFilter" icon="feather:rotate-ccw" :raised="false"
                color="danger" />
              <VIconButton class="mr-2" @click.prevent="onOpen" icon="fas fa-filter" />

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
              <VControl>
                <VButton v-permission="Permissions.ACCOUNT_CREATE" class="ml-2" to="/account/add" color="primary">{{
                  button_name }}
                </VButton>
              </VControl>
              <VControl>
                <VButton v-permission="Permissions.ACCOUNT_CREATE" class="" to="/account/add-cash-account"
                  color="primary">{{ t('account.header_button2') }}
                </VButton>
              </VControl>
            </div>
          </div>
        </div>
      </div>
    </div>
    <AccountSearchFilterModel :key="keyTest" :search_filter_popup="searchFilterPop" @search_filter_popup="popUpTrigger"
      @search="search_filter" @resetFilter="resetFilter_popup" />
  </form>
</template>

<style   lang="scss">
@import '/@src/scss/styles/tableHeader.scss';
</style>

