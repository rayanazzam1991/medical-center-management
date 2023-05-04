<script lang="ts">
import { useI18n } from "vue-i18n"
import { Account, AccountSearchFilter, defaultAccountSearchFilter, AccountConsts } from "/@src/models/Accounting/Account/account"
import { getAccountsList } from "/@src/services/Accounting/Account/accountService"


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
    search_filter_popup: {
      default: false,
    },
    is_reseted: {
      type: Boolean,
      default: false,
    }
  },
  emits: ['search_filter_popup', 'search', 'resetFilter'],
  setup(props, context) {
    const { t } = useI18n()
    const searchName = ref()
    const searchCode = ref()
    const searchStatus = ref()
    const searchFilter = ref(defaultAccountSearchFilter)
    let search_filter_popup = computed({
      get: () => props.search_filter_popup as boolean,
      set(value) {
        value = false
        context.emit('search_filter_popup', value)
      },
    })
    const search = () => {
      searchFilter.value = {
        name: searchName.value,
        code: searchCode.value,
        status: searchStatus.value,
      }
      context.emit('search', searchFilter.value)
      search_filter_popup.value = false
    }
    const resetFilter = () => {
      searchName.value = undefined
      searchCode.value = undefined
      searchStatus.value = undefined
      searchFilter.value.name = undefined
      searchFilter.value.code = undefined
      searchFilter.value.status = undefined
      context.emit('resetFilter', searchFilter.value)
    }
    return { t, AccountConsts, search, resetFilter, search_filter_popup, searchName, searchCode, searchStatus }
  },
})
</script>

<template>
  <VModal :title="t('account.search_filter.title')" :open="search_filter_popup" actions="center"
    @close="search_filter_popup = false">
    <template #content>
      <form class="form-layout" @submit.prevent="">
        <VField class="column filter">
          <VControl icon="feather:search">
            <input v-model="searchName" type="text" class="input " :placeholder="t('account.search_filter.name')" />
          </VControl>
        </VField>
        <VField class="column filter">
          <VControl icon="feather:search">
            <input v-model="searchCode" type="text" class="input " :placeholder="t('account.search_filter.code')" />
          </VControl>
        </VField>
        <VField class="column filter">
          <VControl>
            <VSelect v-model="searchStatus" class="">
              <VOption value="">{{ t('account.search_filter.status') }}</VOption>
              <VOption value="0">{{ AccountConsts.getAccountStatusName(0) }}</VOption>
              <VOption value="1">{{ AccountConsts.getAccountStatusName(1) }}</VOption>
            </VSelect>
          </VControl>
        </VField>
        <VButton type="submit" @click="search" class="is-hidden" />

      </form>
    </template>
    <template #action="{ close }">
      <VButton icon="fas fa-filter" color="primary" raised @click="search">{{ t('modal.buttons.filter') }}</VButton>
    </template>
  </VModal>
</template>

