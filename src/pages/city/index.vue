<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import VTag from '/@src/components/base/tags/VTag.vue'
import { CityConsts } from '/@src/utils/consts/city'
import { defaultCitySearchFilter } from '/@src/stores/Others/City/cityStore'

import { getCitiesList } from '/@src/composable/Others/City/getCitiesList'
import { deleteCity } from '/@src/composable/Others/City/deleteCity'
import MyDropDown from '/@src/components/OurComponents/MyDropDown.vue'
import { CitySearchFilter } from '/@src/utils/api/Others/City'
import { defaultPagination } from '/@src/utils/response'
import { useNotyf } from '/@src/composable/useNotyf'
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('City')
useHead({
  title: 'City',
})
const notif = useNotyf()
const searchFilter = ref(defaultCitySearchFilter)
const citiesList = ref()
const deleteCityPopup = ref(false)
const deleteCityId = ref()
const paginationVar = ref(defaultPagination)
const { cities, pagination } = await getCitiesList(searchFilter.value)
citiesList.value = cities
paginationVar.value = pagination
const router = useRouter()

const removeCity = async (cityId: number) => {

  await deleteCity(cityId)
  deleteCityPopup.value = false
  // @ts-ignore
  notif.success(`${viewWrapper.pageTitle} was deleted successfully`)

}

const search = async (searchFilter2: CitySearchFilter) => {

  const { cities, pagination } = await getCitiesList(searchFilter2)

  citiesList.value = cities
  paginationVar.value = pagination
  searchFilter.value = searchFilter2

}

const resetFilter = async (searchFilter2: CitySearchFilter) => {
  searchFilter.value = searchFilter2
  search(searchFilter.value)
}

const getCitiesPerPage = async (pageNum: number) => {
  searchFilter.value.page = pageNum
  search(searchFilter.value)
}
const citySort = async (value: string) => {
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
            row?.status === CityConsts.INACTIVE
              ? 'orange'
              : row?.status === CityConsts.ACTIVE
                ? 'success'
                : undefined,
        },
        {
          default() {
            return CityConsts.showStatusName(row?.status)
          },
        }
      ),

  },
  actions: {
    align: 'center',

    renderRow: (row: any) =>
      h(MyDropDown, {

        onRemove: () => {
          deleteCityPopup.value = true
          deleteCityId.value = row?.id
        },
        onEdit: () => {
          router.push({ path: `/city/${row?.id}/edit` })
        },
        onView: () => {
          router.push({ path: `/city/${row?.id}` })
        },

      }),

  },
} as const
</script>

<template>
  <CityTableHeader :title="viewWrapper.pageTitle" :button_name="`Add ${viewWrapper.pageTitle}`" @search="search"
    :pagination="paginationVar" @resetFilter="resetFilter" />
  <VFlexTableWrapper :columns="columns" :data="citiesList" @update:sort="citySort">

    <VFlexTable v-if="citiesList.length != 0" :clickable="true" :separators="true"></VFlexTable>
    <VFlexPagination v-if="citiesList.length != 0" :current-page="paginationVar.page" class="mt-6"
      :item-per-page="paginationVar.per_page" :total-items="paginationVar.total" :max-links-displayed="3" no-router
      @update:current-page="getCitiesPerPage" />
    <h6 v-if="citiesList.length != 0">Showing {{ paginationVar.page != paginationVar.max_page
        ?
        (1 + ((paginationVar.page - 1) * paginationVar.count)) : paginationVar.page == 1 ? 1 : paginationVar.total
    }} to {{
    paginationVar.page !=
      paginationVar.max_page ?
      paginationVar.page *
      paginationVar.per_page : paginationVar.total
}} of {{ paginationVar.total }} entries</h6>

    <h1 v-if="citiesList.length == 0">No Data Returned...</h1>
  </VFlexTableWrapper>
  <VModal title="Remove City" :open="deleteCityPopup" actions="center" @close="deleteCityPopup = false">
    <template #content>
      <VPlaceholderSection title="Are you sure?"
        :subtitle="`you are about to delete this ${viewWrapper.pageTitle} permenantly`" />
    </template>
    <template #action="{ close }">
      <VButton color="primary" raised @click="removeCity(deleteCityId)">Confirm</VButton>
    </template>
  </VModal>

</template>

