<script setup lang="ts">


import MyDropDown from '/@src/components/OurComponents/MyDropDown.vue'
import VTag from '/@src/components/base/tags/VTag.vue'
import { useHead } from '@vueuse/head'
import { deleteDepartment } from '/@src/composable/Others/Department/deleteDepartment'
import { getDepartmentsList } from '/@src/composable/Others/Department/getDepartmentsList'
import { useNotyf } from '/@src/composable/useNotyf'
import { defaultDepartmentSearchFilter, DepartmentSearchFilter, DepartmentConsts } from '/@src/models/Others/Department/department'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { defaultPagination } from '/@src/utils/response'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Department')
useHead({
  title: 'Department',
})
const notif = useNotyf()
const searchFilter = ref(defaultDepartmentSearchFilter)
const departmentsList = ref()
const deleteDepartmentPopup = ref(false)
const deleteDepartmentId = ref()
const paginationVar = ref(defaultPagination)
const { departments, pagination } = await getDepartmentsList(searchFilter.value)
departmentsList.value = departments
paginationVar.value = pagination
const router = useRouter()

const removeDepartment = async (departmentId: number) => {

  await deleteDepartment(departmentId)
  deleteDepartmentPopup.value = false
  // @ts-ignore
  notif.success(`${viewWrapper.pageTitle} was deleted successfully`)

}

const search = async (searchFilter2: DepartmentSearchFilter) => {

  const { departments, pagination } = await getDepartmentsList(searchFilter2)

  departmentsList.value = departments
  paginationVar.value = pagination
  searchFilter.value = searchFilter2

}

const resetFilter = async (searchFilter2: DepartmentSearchFilter) => {
  searchFilter.value = searchFilter2
  search(searchFilter.value)
}

const getDepartmentsPerPage = async (pageNum: number) => {
  searchFilter.value.page = pageNum
  search(searchFilter.value)
}
const departmentSort = async (value: string) => {
  if (value != undefined) {
    const [sortField, sortOrder] = value.split(':') as [string, 'desc' | 'asc']

    searchFilter.value.order_by = sortField
    searchFilter.value.order = sortOrder
  }
  else {
    searchFilter.value.order = undefined
    searchFilter.value.order_by = undefined
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
          deleteDepartmentPopup.value = true
          deleteDepartmentId.value = row.id
        },
        onEdit: () => {
          router.push({ path: `/department/${row.id}/edit` })
        },
        onView: () => {
          router.push({ path: `/department/${row.id}` })
        },

      }),

  },
} as const
</script>

<template>
  <DepartmentTableHeader :title="viewWrapper.pageTitle" :button_name="`Add ${viewWrapper.pageTitle}`" @search="search"
    :pagination="paginationVar" @resetFilter="resetFilter" />
  <VFlexTableWrapper :columns="columns" :data="departmentsList" @update:sort="departmentSort">

    <VFlexTable v-if="departmentsList.length != 0" :clickable="true" :separators="true"></VFlexTable>
    <VFlexPagination v-if="(departmentsList.length != 0 && paginationVar.max_page != 1)"
      :current-page="paginationVar.page" class="mt-6" :item-per-page="paginationVar.per_page"
      :total-items="paginationVar.total" :max-links-displayed="3" no-router
      @update:current-page="getDepartmentsPerPage" />
    <h6 v-if="departmentsList.length != 0">Showing {{ paginationVar.page != paginationVar.max_page
        ?
        (1 + ((paginationVar.page - 1) * paginationVar.count)) : paginationVar.page == 1 ? 1 : paginationVar.total
    }} to {{
    paginationVar.page !=
      paginationVar.max_page ?
      paginationVar.page *
      paginationVar.per_page : paginationVar.total
}} of {{ paginationVar.total }} entries</h6>

    <h1 v-if="departmentsList.length == 0">No Data Returned...</h1>
  </VFlexTableWrapper>
  <VModal title="Remove Department" :open="deleteDepartmentPopup" actions="center"
    @close="deleteDepartmentPopup = false">
    <template #content>
      <VPlaceholderSection title="Are you sure?"
        :subtitle="`you are about to delete this ${viewWrapper.pageTitle} permenantly`" />
    </template>
    <template #action="{ close }">
      <VButton color="primary" raised @click="removeDepartment(deleteDepartmentId)">Confirm</VButton>
    </template>
  </VModal>

</template>

