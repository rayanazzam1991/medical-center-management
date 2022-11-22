<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import VTag from '/@src/components/base/tags/VTag.vue'
import VFlexTableSortColumn from '/@src/components/base/table/VFlexTableSortColumn.vue'
import VbuttonIcon from '/@src/components/base/button/VIconButton.vue'
import { CityConsts } from '/@src/utils/consts/city'


import { getCitiesList } from '/@src/composable/Others/City/getCitiesList'
import { deleteCity } from '/@src/composable/Others/City/deleteCity'
import MyDropDown from '/@src/components/OurComponents/MyDropDown.vue'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('City')
useHead({
  title: 'City',
})
const { cities } = await getCitiesList()
const router = useRouter()
const removeCity = async (cityId: number) => {

  await deleteCity(cityId)


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
      h(MyDropDown, {
        
        onRemove: () => {
          removeCity(row.id)
          console.log('remove', row)
        },
        onEdit: () => { 
          router.push({path: `/city/${row.id}`})
          console.log('edit', row)
        },
        onView: () => {
          console.log('view', row)
        },

      }),
    renderHeader: () =>
      h(VbuttonIcon, {
        to: { name: '/city/add' },
        color: "primary",
        icon: "feather:plus",
      }),
  },
} as const
</script>

<template>
  <VFlexTableWrapper :data="cities" :columns="columns">
    <VFlexTable :clickable="true"></VFlexTable>
  </VFlexTableWrapper>
</template>
