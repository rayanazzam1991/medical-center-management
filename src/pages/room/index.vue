<script setup lang="ts">
import { useHead } from '@vueuse/head'

import { useViewWrapper } from '/@src/stores/viewWrapper'
import VTag from '/@src/components/base/tags/VTag.vue'
import FlexTableDropdown from '/@src/components/partials/dropdowns/FlexTableDropdown.vue'
import VFlexTableSortColumn from '/@src/components/base/table/VFlexTableSortColumn.vue'
import VbuttonIcon from '/@src/components/base/button/VIconButton.vue'
import { RoomConsts } from '/@src/utils/consts/room' 


import VIconButton from '/@src/components/base/button/VIconButton.vue'
import { getRoomsList } from '/@src/composable/Others/Room/getRoomsList'
import { deleteRoom } from '/@src/composable/Others/Room/deleteRoom'
import { useRoom } from "/@src/stores/Others/Room/roomStore";
import { Room } from '/@src/utils/api/Others/Room'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Room')
useHead({
  title: 'Room',
})
const {rooms} = await getRoomsList()


const removeRoom  = async (roomId :number ) => {
     await deleteRoom(roomId)

}


const columns = {
  id: {
    searchable: true,
    sortable: true,
  },
  number: {
    sortable: true,
    searchable: true,

  },
  floor: {
    sortable: true,
    searchable: true,

  },
  department: {
    sortable: true,
    searchable: true,
    label: 'Deoartment',
    renderRow: (row: any) =>
      h('span',row.department_id.name)
  },
  status: {
    label: 'Status',
    renderRow: (row: any) =>
      h(
        VTag,
        {
          rounded: true,
          color:
            row.status === RoomConsts.INACTIVE
              ? 'orange'
              : row.status === RoomConsts.ACTIVE
              ? 'success'
              : undefined,
        },
        {
          default() {
            return RoomConsts.showStatusName(row.status)
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
          removeRoom(row.id)
          console.log('remove', row)
        },
      }),

  },
        
      
    

  
} as const
</script>

<template>
  
    <VIconButton :to="{ name: '/room/add' }" color="danger"  raised icon="feather:plus" />
    <VFlexTableWrapper :data="rooms" :columns="columns"  >
        <VFlexTable :clickable="true" ></VFlexTable>
    </VFlexTableWrapper>

</template>
