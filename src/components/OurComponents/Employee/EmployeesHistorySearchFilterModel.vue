<script lang="ts">
import { useI18n } from "vue-i18n"
import { defaultEmployeeHistorySearchFilter, EmployeeStatusConsts } from "/@src/models/Employee/employeeHistory"


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
    const searchEmployeeName = ref()
    const searchStatus = ref()
    const searchFilter = ref(defaultEmployeeHistorySearchFilter)
    let search_filter_popup = computed({
      get: () => props.search_filter_popup as boolean,
      set(value) {
        value = false
        context.emit('search_filter_popup', value)
      },
    })
    const search = () => {
      searchFilter.value = {
        employee_name: searchEmployeeName.value,
        status: searchStatus.value,
      }
      context.emit('search', searchFilter.value)
      search_filter_popup.value = false
    }
    const resetFilter = () => {
      searchEmployeeName.value = undefined
      searchStatus.value = undefined
      searchFilter.value.employee_name = undefined
      searchFilter.value.status = undefined
      context.emit('resetFilter', searchFilter.value)
    }

    return { t, EmployeeStatusConsts, search, resetFilter, search_filter_popup, searchEmployeeName, searchStatus }
  },
})
</script>

<template>
  <VModal :title="t('dismissed_employee.search_filter.title')" :open="search_filter_popup" actions="center"
    @close="search_filter_popup = false">
    <template #content>
      <form class="form-layout" @submit.prevent="">
        <VField class="column filter">
          <VControl icon="feather:search">
            <input v-model="searchEmployeeName" type="text" class="input "
              :placeholder="t('dismissed_employee.search_filter.employee_name')" />
          </VControl>
        </VField>

        <VField class="column filter">
          <VControl>
            <VSelect v-model="searchStatus" class="">
              <VOption value="">{{ t('dismissed_employee.search_filter.status') }}</VOption>
              <VOption value="1">{{ EmployeeStatusConsts.getStatusName(1) }}</VOption>
              <VOption value="2">{{ EmployeeStatusConsts.getStatusName(2) }}</VOption>
              <VOption value="3">{{ EmployeeStatusConsts.getStatusName(3) }}</VOption>
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

