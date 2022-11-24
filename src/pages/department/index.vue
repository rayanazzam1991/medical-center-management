<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import VTag from '/@src/components/base/tags/VTag.vue'
import VFlexTableSortColumn from '/@src/components/base/table/VFlexTableSortColumn.vue'
import VbuttonIcon from '/@src/components/base/button/VIconButton.vue'
import { DepartmentConsts } from '/@src/utils/consts/department'
import { defaultSearchFilter } from '/@src/stores/Others/Department/departmentStore'

import { getDepartmentsList } from '/@src/composable/Others/Department/getDepartmentsList'
import { deleteDepartment } from '/@src/composable/Others/Department/deleteDepartment'
import MyDropDown from '/@src/components/OurComponents/MyDropDown.vue'
import { Department, SearchFilter } from '/@src/utils/api/Others/Department'
import { defaultPagination } from '/@src/utils/response'
import { VFlexTableWrapperColumn } from '/@src/components/base/table/VFlexTableWrapper.vue'
import notyf from '/@src/plugins/notyf'
import { useNotyf } from '/@src/composable/useNotyf'
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Department')
useHead({
  title: 'Department',
})
const notif = useNotyf()
const searchFilter = ref(defaultSearchFilter)
const departmentsList = ref()
const paginationVar = ref(defaultPagination)
const { departments, pagination } = await getDepartmentsList(searchFilter.value)
console.log("lllllllllll", pagination)
departmentsList.value = departments
paginationVar.value = pagination
const router = useRouter()
const removeDepartment = async (departmentId: number) => {

  await deleteDepartment(departmentId)
  notif.success('Deoartment was deleted successfully')

}
const search = async (searchFilter2: SearchFilter) => {

  const { departments, pagination } = await getDepartmentsList(searchFilter2)

  departmentsList.value = departments
  paginationVar.value = pagination
  searchFilter.value = searchFilter2

}

const resetFilter = async () => {
  searchFilter.value = defaultSearchFilter
  search(searchFilter.value)
}

const getDepartmentsPerPage = async (pageNum: number) => {
  searchFilter.value.page = pageNum
  console.log("dd", searchFilter.value)
  search(searchFilter.value)
}
type VFlexTableWrapperSortFunction<T = any> = (parameters: {
  key: string
  column: Partial<VFlexTableWrapperColumn>
  order: 'asc' | 'desc'
  a: T
  b: T
}) => Promise<number>

const departmentSort = async (value: string) => {
  if (value != undefined) {
    const [sortField, sortOrder] = value.split(':') as [string, 'desc' | 'asc']
    searchFilter.value.order_by = sortField
    searchFilter.value.order = sortOrder
  }
  else {
    searchFilter.value.order_by = undefined
    searchFilter.value.order = undefined
  }
  await search(searchFilter.value)
}

const columns = {
  id: {
    align: 'center',
    sortable: true,

  },
  name: {
    align: 'center',
    sortable: true,


  },
  status: {
    align: 'center',

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

  },
  actions: {
    align: 'center',

    renderRow: (row: any) =>
      h(MyDropDown, {

        onRemove: () => {
          removeDepartment(row.id)
          console.log('remove', row)
        },
        onEdit: () => {
          router.push({ path: `/department/${row.id}/edit` })
          console.log('edit', row)
        },
        onView: () => {
          router.push({ path: `/department/${row.id}` })
          console.log('view', row)
        },

      }),

  },
} as const
</script>

<template>
  <DepartmentTableHeader :title="viewWrapper.pageTitle" :button_name="'Add Department'" @search="search"
    @resetFilter="resetFilter" />
  <VFlexTableWrapper :columns="columns" :data="departmentsList" @update:sort="departmentSort">
    <VFlexTable v-if="departmentsList.length != 0" :clickable="true" :separators="true"></VFlexTable>
    <VFlexPagination v-if="departmentsList.length != 0" :current-page="paginationVar.page" class="mt-6"
      :item-per-page="paginationVar.per_page" :total-items="paginationVar.total" :max-links-displayed="3" no-router
      @update:current-page="getDepartmentsPerPage" />
    <h6 v-if="departmentsList.length != 0">Showing {{ 1 + ((paginationVar.page - 1) * pagination.count) }} to {{
        paginationVar.page !=
          pagination.max_page ?
          paginationVar.page *
          paginationVar.per_page : paginationVar.total
    }} of {{ paginationVar.total }} entries</h6>

    <h1 v-if="departmentsList.length == 0">No Data Returned...</h1>
  </VFlexTableWrapper>

</template>

