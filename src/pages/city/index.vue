<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import VTag from '/@src/components/base/tags/VTag.vue'
import VFlexTableSortColumn from '/@src/components/base/table/VFlexTableSortColumn.vue'
import VbuttonIcon from '/@src/components/base/button/VIconButton.vue'
import { CityConsts } from '/@src/utils/consts/city'
import { defaultSearchFilter } from '/@src/stores/Others/City/cityStore'

import { getCitiesList } from '/@src/composable/Others/City/getCitiesList'
import { deleteCity } from '/@src/composable/Others/City/deleteCity'
import MyDropDown from '/@src/components/OurComponents/MyDropDown.vue'
import { City, SearchFilter } from '/@src/utils/api/Others/City'
import { defaultPagination } from '/@src/utils/response'
import { VFlexTableWrapperColumn } from '/@src/components/base/table/VFlexTableWrapper.vue'
import notyf from '/@src/plugins/notyf'
import { useNotyf } from '/@src/composable/useNotyf'
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('City')
useHead({
  title: 'City',
})
const notif = useNotyf()
const searchFilter = ref(defaultSearchFilter)
const citiesList = ref()
const paginationVar = ref(defaultPagination)
const { cities, pagination } = await getCitiesList(searchFilter.value)
citiesList.value = cities
paginationVar.value = pagination
const router = useRouter()
const removeCity = async (cityId: number) => {

  await deleteCity(cityId)
  notif.success('City was deleted successfully')

}
const search = async (searchFilter2: SearchFilter) => {

  const { cities, pagination } = await getCitiesList(searchFilter2)

  citiesList.value = cities
  paginationVar.value = pagination
  searchFilter.value = searchFilter2

}

const resetFilter = async () => {
  searchFilter.value = defaultSearchFilter
  search(searchFilter.value)
}

const getCitiesPerPage = async (pageNum: number) => {
  searchFilter.value.page = pageNum
  console.log(searchFilter.value)
  search(searchFilter.value)
}
type VFlexTableWrapperSortFunction<T = any> = (parameters: {
  key: string
  column: Partial<VFlexTableWrapperColumn>
  order: 'asc' | 'desc'
  a: T
  b: T
}) => Promise<number>

const citySort: VFlexTableWrapperSortFunction<City> = async ({ order, column }) => {
  console.log(order)
  searchFilter.value.order = order
  searchFilter.value.order_by = column.key
  await search(searchFilter.value)
  return 1
}

const columns = {
  id: {
    align: 'center',
    sortable: true,
    sort: citySort,

  },
  name: {
    align: 'center',
    sortable: true,
    sort: citySort,


  },
  status: {
    align: 'center',

    renderRow: (row: any) =>
      h(
        VTag,
        {
          rounded: true,
          color:
            row.status === CityConsts.INACTIVE
              ? 'orange'
              : row.status === CityConsts.ACTIVE
                ? 'success'
                : undefined,
        },
        {
          default() {
            return CityConsts.showStatusName(row.status)
          },
        }
      ),

  },
  actions: {
    align: 'center',

    renderRow: (row: any) =>
      h(MyDropDown, {

        onRemove: () => {
          removeCity(row.id)
          console.log('remove', row)
        },
        onEdit: () => {
          router.push({ path: `/city/${row.id}/edit` })
          console.log('edit', row)
        },
        onView: () => {
          router.push({ path: `/city/${row.id}` })
          console.log('view', row)
        },

      }),

  },
} as const
</script>

<template>
  <CityTableHeader :title="viewWrapper.pageTitle" :button_name="'Add City'" @search="search"
    @resetFilter="resetFilter" />
  <VFlexTableWrapper :columns="columns" :data="citiesList">

    <VFlexTable v-if="citiesList.length != 0" :clickable="true" :separators="true"></VFlexTable>
    <VFlexPagination v-if="citiesList.length != 0" :current-page="paginationVar.page" class="mt-6"
      :item-per-page="paginationVar.per_page" :total-items="paginationVar.total" :max-links-displayed="3" no-router
      @update:current-page="getCitiesPerPage" />
    <h6 v-if="citiesList.length != 0">Showing {{ 1 + ((paginationVar.page - 1) * pagination.count) }} to {{
        paginationVar.page !=
          pagination.max_page ?
          paginationVar.page *
          paginationVar.per_page : paginationVar.total
    }} of {{ paginationVar.total }} entries</h6>

    <h1 v-if="citiesList.length == 0">No Data Returned...</h1>
  </VFlexTableWrapper>

</template>

