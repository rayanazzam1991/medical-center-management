<script setup lang="ts">
import MyDropDown from '/@src/components/OurComponents/MyDropDown.vue'
import VTag from '/@src/components/base/tags/VTag.vue'
import { useHead } from '@vueuse/head'
import { getDepartmentsList } from '/@src/services/Others/Department/departmentService'
import { useNotyf } from '/@src/composable/useNotyf'
import { defaultDepartmentSearchFilter, DepartmentSearchFilter, DepartmentConsts, Department } from '/@src/models/Others/Department/department'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { defaultPagination } from '/@src/utils/response'
import { useDepartment } from '/@src/stores/Others/Department/departmentStore'
import sleep from "/@src/utils/sleep"
import { Notyf } from 'notyf'
import { useI18n } from 'vue-i18n'
import AddEditDropDown from '/@src/components/OurComponents/AddEditDropDown.vue'

const viewWrapper = useViewWrapper()
const { t } = useI18n()
viewWrapper.setPageTitle(t('department.table.title'))
useHead({
  title: t('department.table.title'),
})
const notif = useNotyf() as Notyf
const searchFilter = ref(defaultDepartmentSearchFilter)
const departmentsList = ref<Array<Department>>([])
const paginationVar = ref(defaultPagination)
const departmentStore = useDepartment()

const default_per_page = ref(1)
const keyIncrement = ref(0)

const router = useRouter()
onMounted(async () => {
  const { departments, pagination } = await getDepartmentsList(searchFilter.value)
  departmentsList.value = departments
  paginationVar.value = pagination
  keyIncrement.value = keyIncrement.value + 1
  default_per_page.value = pagination.per_page

});


const search = async (searchFilter2: DepartmentSearchFilter) => {
  paginationVar.value.per_page = searchFilter2.per_page ?? paginationVar.value.per_page

  const { departments, pagination } = await getDepartmentsList(searchFilter2)

  departmentsList.value = departments
  paginationVar.value = pagination
  searchFilter.value = searchFilter2

}

const resetFilter = async (searchFilter2: DepartmentSearchFilter) => {
  searchFilter.value = searchFilter2
  await search(searchFilter.value)
}

const getDepartmentsPerPage = async (pageNum: number) => {
  searchFilter.value.page = pageNum
  await search(searchFilter.value)
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
    label: t('department.table.columns.id')

  },
  name: {
    align: 'center',
    sortable: true,
    label: t('department.table.columns.name')


  },
  status: {
    align: 'center',
    label: t('department.table.columns.status'),

    renderRow: (row: any) =>
      h(
        VTag,
        {
          rounded: true,
          color:
            row.status === DepartmentConsts.INACTIVE
              ? 'danger'
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
    label: t('department.table.columns.status'),
    renderRow: (row: any) =>
      h(AddEditDropDown, {
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
  <DepartmentTableHeader :key="keyIncrement" :title="viewWrapper.pageTitle" :button_name="t('department.header_button')"
    @search="search" :pagination="paginationVar" :default_per_page="default_per_page" @resetFilter="resetFilter" />
  <VFlexTableWrapper :columns="columns" :data="departmentsList" @update:sort="departmentSort">

    <VFlexTable separators clickable>
      <template #body>
        <div v-if="departmentStore?.loading" class="flex-list-inner">
          <div v-for="key in paginationVar.per_page" :key="key" class="flex-table-item">
            <VFlexTableCell>
              <VPlaceload />
            </VFlexTableCell>

          </div>
        </div>
        <div v-else-if="departmentsList.length === 0" class="flex-list-inner">
          <VPlaceholderSection :title="t('tables.placeholder.title')" :subtitle="t('tables.placeholder.subtitle')"
            class="my-6">
          </VPlaceholderSection>
        </div>

      </template>
    </VFlexTable>
    <VFlexPagination v-if="(departmentsList.length != 0 && paginationVar.max_page != 1)"
      :current-page="paginationVar.page" class="mt-6" :item-per-page="paginationVar.per_page"
      :total-items="paginationVar.total" :max-links-displayed="3" no-router
      @update:current-page="getDepartmentsPerPage" />
    <h6 class="pt-2 is-size-7" v-if="departmentsList.length != 0 && !departmentStore?.loading">

      {{
        t('tables.pagination_footer', { from_number: paginationVar.page !=
          paginationVar.max_page
          ?
          (1 + ((paginationVar.page - 1) * paginationVar.count)) : paginationVar.page == paginationVar.max_page ? (1 +
            ((paginationVar.page - 1) * paginationVar.per_page)) : paginationVar.page == 1 ? 1 : paginationVar.total
        , to_number: paginationVar.page !=
          paginationVar.max_page ?
          paginationVar.page *
          paginationVar.per_page : paginationVar.total, all_number: paginationVar.total
      })}}</h6>
    <VPlaceloadText v-if="departmentStore?.loading" :lines="1" last-line-width="20%" class="mx-2" />

  </VFlexTableWrapper>

</template>

