<script setup lang="ts">
import { useHead } from '@vueuse/head'

import { useViewWrapper } from '/@src/stores/viewWrapper'
import VTag from '/@src/components/base/tags/VTag.vue'
import FlexTableDropdown from '/@src/components/partials/dropdowns/FlexTableDropdown.vue'
import VFlexTableSortColumn from '/@src/components/base/table/VFlexTableSortColumn.vue'
import VbuttonIcon from '/@src/components/base/button/VIconButton.vue'
import { DepartmentConsts } from '/@src/utils/consts/department'

import VIconButton from '/@src/components/base/button/VIconButton.vue'
import { getDepartmentsList } from '/@src/composable/Others/Department/getDepartmentsList'
import { deleteDepartment } from '/@src/composable/Others/Department/deleteDepartment'
import { useDepartment } from '/@src/stores/Others/Department/departmentStore'
import { Department } from '/@src/utils/api/Others/Department'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Department')
useHead({
  title: 'Department',
})
const { departments } = await getDepartmentsList()

const removeDepartment = async (departmentId: number) => {
  await deleteDepartment(departmentId)
}

const columns = {
  id: {
    searchable: true,
    sortable: true,
  },
  name: {
    sortable: true,
    searchable: true,
  },
  status: {
    label: 'Status',
    renderRow: (row: any) =>
      h(
        VTag,
        {
          rounded: true,
          color:
            row.status === DepartmentConsts.INACTIVE
              ? 'orange'
              : row.status === DepartmentConsts.ACTIVE
              ? 'success'
              : undefined,
        },
        {
          default() {
            return DepartmentConsts.showStatusName(row.status)
          },
        }
      ),
    renderHeader: () =>
      h(VFlexTableSortColumn, {
        label: 'Status',
        id: 'status',
      }),
  },
  actions: {
    label: '',
    align: 'end',
    renderRow: (row: any) =>
      h(FlexTableDropdown, {
        // We can catch all events from vue
        onView: () => {
          console.log('viewing', row)
        },
        onProjects: () => {
          console.log('projects', row)
        },
        onSchedule: () => {
          console.log('schedule', row)
        },

        onRemove: () => {
          removeDepartment(row.id)
          console.log('remove', row)
        },
      }),
  },
} as const
</script>

<template>
  <VIconButton :to="{ name: '/department/add' }" color="danger" raised icon="feather:plus" />
  <VFlexTableWrapper :data="departments" :columns="columns">
    <VFlexTable :clickable="true"></VFlexTable>
  </VFlexTableWrapper>
</template>
