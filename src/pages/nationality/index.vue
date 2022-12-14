<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import VTag from '/@src/components/base/tags/VTag.vue'
import MyDropDown from '/@src/components/OurComponents/MyDropDown.vue'
import { useNotyf } from '/@src/composable/useNotyf'
import { defaultNationalitySearchFilter, NationalitySearchFilter, NationalityConsts } from '/@src/models/Others/Nationality/nationality'
import { getNationalitiesList, deleteNationality } from '/@src/services/Others/Nationality/nationalityService'
import { defaultPagination } from '/@src/utils/response'
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Nationality')
useHead({
  title: 'Nationality',
})
const notif = useNotyf()
const searchFilter = ref(defaultNationalitySearchFilter)
const nationalitiesList = ref()
const deleteNationalityPopup = ref(false)
const deleteNationalityId = ref()

const paginationVar = ref(defaultPagination)
const { nationalities, pagination } = await getNationalitiesList(searchFilter.value)
nationalitiesList.value = nationalities
paginationVar.value = pagination
const router = useRouter()

const removeNationality = async (nationalityId: number) => {

  await deleteNationality(nationalityId)
  deleteNationalityPopup.value = false
  // @ts-ignore
  notif.success(`${viewWrapper.pageTitle} was deleted successfully`)

}
const search = async (searchFilter2: NationalitySearchFilter) => {

  const { nationalities, pagination } = await getNationalitiesList(searchFilter2)

  nationalitiesList.value = nationalities
  paginationVar.value = pagination
  searchFilter.value = searchFilter2

}

const resetFilter = async (searchFilter2: NationalitySearchFilter) => {
  searchFilter.value = searchFilter2
  search(searchFilter.value)


}

const getNationalitiesPerPage = async (pageNum: number) => {
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
            row?.status === NationalityConsts.INACTIVE
              ? 'orange'
              : row?.status === NationalityConsts.ACTIVE
                ? 'success'
                : undefined,
        },
        {
          default() {
            return NationalityConsts.showStatusName(row?.status)
          },
        }
      ),

  },
  actions: {
    align: 'center',

    renderRow: (row: any) =>
      h(MyDropDown, {

        onRemove: () => {
          deleteNationalityPopup.value = true
          deleteNationalityId.value = row?.id
        },
        onEdit: () => {
          router.push({ path: `/nationality/${row?.id}/edit` })
        },
        onView: () => {
          router.push({ path: `/nationality/${row?.id}` })
        },

      }),

  },
} as const
</script>

<template>
  <NationalityTableHeader :title="viewWrapper.pageTitle" :button_name="`Add ${viewWrapper.pageTitle}`" @search="search"
    :pagination="paginationVar" @resetFilter="resetFilter" />
  <VFlexTableWrapper :columns="columns" :data="nationalitiesList" @update:sort="citySort">

    <VFlexTable v-if="nationalitiesList.length != 0" :clickable="true" :separators="true"></VFlexTable>
    <VFlexPagination v-if="(nationalitiesList.length != 0 && paginationVar.max_page != 1)"
      :current-page="paginationVar.page" class="mt-6" :item-per-page="paginationVar.per_page"
      :total-items="paginationVar.total" :max-links-displayed="3" no-router
      @update:current-page="getNationalitiesPerPage" />
    <h6 v-if="nationalitiesList.length != 0">Showing {{ paginationVar.page != paginationVar.max_page
        ?
        (1 + ((paginationVar.page - 1) * paginationVar.count)) : paginationVar.page == 1 ? 1 : paginationVar.total
    }} to {{
    paginationVar.page !=
      paginationVar.max_page ?
      paginationVar.page *
      paginationVar.per_page : paginationVar.total
}} of {{ paginationVar.total }} entries</h6>

    <h1 v-if="nationalitiesList.length == 0">No Data Returned...</h1>
  </VFlexTableWrapper>
  <VModal title="Remove Nationality" :open="deleteNationalityPopup" actions="center"
    @close="deleteNationalityPopup = false">
    <template #content>
      <VPlaceholderSection title="Are you sure?"
        :subtitle="`you are about to delete this ${viewWrapper.pageTitle} permenantly`" />
    </template>
    <template #action="{ close }">
      <VButton color="primary" raised @click="removeNationality(deleteNationalityId)">Confirm</VButton>
    </template>
  </VModal>

</template>

