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

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('City')
useHead({
  title: 'City',
})
const searchFilter = ref(defaultSearchFilter)
const citiesList = ref()
const { cities } = await getCitiesList(searchFilter.value)
citiesList.value = cities
const router = useRouter()
const removeCity = async (cityId: number) => {

  await deleteCity(cityId)


}
const search = async (searchFilter: object) => {

  const { cities } = await getCitiesList(searchFilter)
  console.log(cities)
  citiesList.value = cities

}


const columns = {
  id: {
    align: 'center'
  },
  name: {
    align: 'center'

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
  <CityTableHeader :title="viewWrapper.pageTitle" :button_name="'Add City'" @search="search" />
  <VFlexTableWrapper>

    <VFlexTable :clickable="true" :separators="true" :columns="columns" :data="citiesList"></VFlexTable>
  </VFlexTableWrapper>
</template>
