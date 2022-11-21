<script setup lang="ts">
import { useHead } from '@vueuse/head'

import { useViewWrapper } from '/@src/stores/viewWrapper'
import VTag from '/@src/components/base/tags/VTag.vue'
import FlexTableDropdown from '/@src/components/partials/dropdowns/FlexTableDropdown.vue'
import VFlexTableSortColumn from '/@src/components/base/table/VFlexTableSortColumn.vue'
import VbuttonIcon from '/@src/components/base/button/VIconButton.vue'
import { CityConsts } from '/@src/utils/consts/city' 


import VIconButton from '/@src/components/base/button/VIconButton.vue'
import { getCitiesList } from '/@src/composable/Others/City/getCitiesList'
import { deleteCity } from '/@src/composable/Others/City/deleteCity'
// import {cities, loadCities} from '/@src/stores/Others/City/cityStore'
import { useCity } from "/@src/stores/Others/City/cityStore";
import { City } from '/@src/utils/api/Others/City'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('City')
useHead({
  title: 'City',
})
const {cities} = await getCitiesList()
// var city =  useCity()
// await city.loadCities()
// var cities = city.cities

const removeCity  = async (cityId :number ) => {
     await deleteCity(cityId)
  

}

//  const removeCity  = async (id : any ) => {
//     await axios
//     .delete(`city/${id}`)
//     .then((response) => {
//         console.log(response)
//         cities.value.splice(cities.value.findIndex((city) => city[id] === id),1)
//     })
//     .catch((error) => {
//         console.log(error)
//     })


// }

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
          removeCity(row.id)
          console.log('remove', row)
        },
      }),

  },
        
      
    

  
} as const
</script>

<template>
      <NavbarLayout>
    <!-- Content Wrapper -->
    <RouterView v-slot="{ Component }">
      <Transition name="fade-fast" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
    <VIconButton :to="{ name: '/city/add' }" color="danger"  raised icon="feather:plus" />
    <VFlexTableWrapper :data="cities" :columns="columns"  >
        <VFlexTable :clickable="true" ></VFlexTable>
    </VFlexTableWrapper>
  </NavbarLayout>

</template>
