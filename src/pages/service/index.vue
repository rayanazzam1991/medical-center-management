<script setup lang="ts">
import { useHead } from '@vueuse/head';
import VTag from '/@src/components/base/tags/VTag.vue';
import MyDropDown from '/@src/components/OurComponents/MyDropDown.vue';
import { deleteService } from '/@src/composable/Others/Services/deleteService';
import { getServicesList } from '/@src/composable/Others/Services/getServicesList';
import { useNotyf } from '/@src/composable/useNotyf';
import { defaultServiceSearchFilter } from '/@src/stores/Others/Service/serviceStore';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { ServiceSearchFilter } from '/@src/utils/api/Others/Service';
import { ServiceConsts } from '/@src/utils/consts/service';
import { defaultPagination } from '/@src/utils/response';

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Service')
useHead({
  title: 'Service',
})
const notif = useNotyf()
const searchFilter = ref(defaultServiceSearchFilter)
const servicesList = ref()
const deleteServicePopup = ref(false)
const deleteServiceId = ref()
const paginationVar = ref(defaultPagination)
const { services, pagination } = await getServicesList(searchFilter.value)
servicesList.value = services
paginationVar.value = pagination
const router = useRouter()

const removeService = async (serviceId: number) => {

  await deleteService(serviceId)
  deleteServicePopup.value = false
  // @ts-ignore
  notif.success(`${viewWrapper.pageTitle} was deleted successfully`)

}

const search = async (searchFilter2: ServiceSearchFilter) => {

  const { services, pagination } = await getServicesList(searchFilter2)

  servicesList.value = services
  paginationVar.value = pagination
  searchFilter.value = searchFilter2

}

const resetFilter = async (searchFilter2: ServiceSearchFilter) => {
  searchFilter.value = searchFilter2
  search(searchFilter.value)
}

const getServicesPerPage = async (pageNum: number) => {
  searchFilter.value.page = pageNum
  search(searchFilter.value)
}
const serviceSort = async (value: string) => {
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
  duration_minutes: {
    label: 'Duration',
    align: 'center',
    sortable: true,

  },
  service_price: {
    label: `Price (${ServiceConsts.PRICE_DOLLAR})`,
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
            row?.status === ServiceConsts.INACTIVE
              ? 'orange'
              : row?.status === ServiceConsts.ACTIVE
                ? 'success'
                : undefined,
        },
        {
          default() {
            return ServiceConsts.showStatusName(row?.status)
          },
        }
      ),

  },
  actions: {
    align: 'center',

    renderRow: (row: any) =>
      h(MyDropDown, {

        onRemove: () => {
          deleteServicePopup.value = true
          deleteServiceId.value = row?.id
        },
        onEdit: () => {
          router.push({ path: `/service/${row?.id}/edit` })
        },
        onView: () => {
          router.push({ path: `/service/${row?.id}` })
        },

      }),

  },
} as const
</script>

<template>
  <ServiceTableHeader :title="viewWrapper.pageTitle" :button_name="`Add ${viewWrapper.pageTitle}`" @search="search"
    :pagination="paginationVar" @resetFilter="resetFilter" />
  <VFlexTableWrapper :columns="columns" :data="servicesList" @update:sort="serviceSort" :limit="searchFilter.per_page">

    <VFlexTable v-if="servicesList.length != 0" :clickable="true" :separators="true">
    </VFlexTable>
    <VFlexPagination v-if="servicesList.length != 0 && paginationVar.max_page != 1" :current-page="paginationVar.page"
      class="mt-6" :item-per-page="paginationVar.per_page" :total-items="paginationVar.total" :max-links-displayed="3"
      no-router @update:current-page="getServicesPerPage" />
    <h6 v-if="servicesList.length != 0">Showing {{ paginationVar.page != paginationVar.max_page
        ?
        (1 + ((paginationVar.page - 1) * paginationVar.count)) : paginationVar.page == 1 ? 1 : paginationVar.total
    }} to {{
    paginationVar.page !=
      paginationVar.max_page ?
      paginationVar.page *
      paginationVar.per_page : paginationVar.total
}} of {{ paginationVar.total }} entries</h6>

    <h1 v-if="servicesList.length == 0">No Data Returned...</h1>
  </VFlexTableWrapper>
  <VModal title="Remove Service" :open="deleteServicePopup" actions="center" @close="deleteServicePopup = false">
    <template #content>
      <VPlaceholderSection title="Are you sure?"
        :subtitle="`you are about to delete this ${viewWrapper.pageTitle} permenantly`" />
    </template>
    <template #action="{ close }">
      <VButton color="primary" raised @click="removeService(deleteServiceId)">Confirm</VButton>
    </template>
  </VModal>

</template>

