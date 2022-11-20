<script setup lang="ts">
import { useHead } from '@vueuse/head'

import { useViewWrapper } from '/@src/stores/viewWrapper'
import VTag from '/@src/components/base/tags/VTag.vue'
import FlexTableDropdown from '/@src/components/partials/dropdowns/FlexTableDropdown.vue'
import VFlexTableSortColumn from '/@src/components/base/table/VFlexTableSortColumn.vue'
import VbuttonIcon from '/@src/components/base/button/VIconButton.vue'


import axios from 'axios'
import VIconButton from '/@src/components/base/button/VIconButton.vue'
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Add City')
var cities = ref([])
useHead({
  title: 'Add city',
})


 const removeCity  = async (id : any ) => {
    await axios
    .delete(`city/${id}`)
    .then((response) => {
        console.log(response)
        cities.value.splice(cities.value.findIndex((city) => city[id] === id),1)
    })
    .catch((error) => {
        console.log(error)
    })


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
            row.status === 0
              ? 'orange'
              : row.status === 1
              ? 'success'
              : undefined,
        },
        {
          default() {
            return `${row.status}`
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
    <VField label="City Name" horizontal>
    <VControl fullwidth>
      <VInput type="text" placeholder="Name..."  />
    </VControl>
  </VField>
  </NavbarLayout>

</template>
