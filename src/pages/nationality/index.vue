<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import VTag from '/@src/components/base/tags/VTag.vue'
import MyDropDown from '/@src/components/OurComponents/MyDropDown.vue'
import { useNotyf } from '/@src/composable/useNotyf'
import { defaultNationalitySearchFilter, NationalitySearchFilter, NationalityConsts, Nationality } from '/@src/models/Others/Nationality/nationality'
import { getNationalitiesList, deleteNationality } from '/@src/services/Others/Nationality/nationalityService'
import { defaultPagination } from '/@src/utils/response'
import { useNationality } from '/@src/stores/Others/Nationality/nationalityStore'
import sleep from '/@src/utils/sleep'
import { Notyf } from 'notyf'
import { useI18n } from 'vue-i18n'
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Nationality')
useHead({
  title: 'Nationality',
})
const { t } = useI18n()
const notif = useNotyf() as Notyf
const searchFilter = ref(defaultNationalitySearchFilter)
const nationalitiesList = ref<Array<Nationality>>([])
const deleteNationalityPopup = ref(false)
const deleteNationalityId = ref()
const paginationVar = ref(defaultPagination)
const router = useRouter()
const nationalityStore = useNationality()
const default_per_page = ref(1)
const keyIncrement = ref(0)
onMounted(async () => {
  const { nationalities, pagination } = await getNationalitiesList(searchFilter.value)
  nationalitiesList.value = nationalities
  paginationVar.value = pagination
  keyIncrement.value = keyIncrement.value + 1
  default_per_page.value = pagination.per_page
});


const removeNationality = async (nationalityId: number) => {

  const { message, success } = await deleteNationality(nationalityId)
  await search(searchFilter.value)

  deleteNationalityPopup.value = false
  if (success) {

    // @ts-ignore
    await sleep(200);

    notif.success(t('toast.success.remove'))
  } else {
    await sleep(200);
    notif.error(message)

  }
}

const search = async (searchFilter2: NationalitySearchFilter) => {
  paginationVar.value.per_page = searchFilter2.per_page ?? paginationVar.value.per_page

  const { nationalities, pagination } = await getNationalitiesList(searchFilter2)

  nationalitiesList.value = nationalities
  paginationVar.value = pagination
  searchFilter.value = searchFilter2

}

const resetFilter = async (searchFilter2: NationalitySearchFilter) => {
  searchFilter.value = searchFilter2
  await search(searchFilter.value)


}

const getNationalitiesPerPage = async (pageNum: number) => {
  searchFilter.value.page = pageNum
  await search(searchFilter.value)
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
              ? 'danger'
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
  <NationalityTableHeader :key="keyIncrement" :title="viewWrapper.pageTitle"
    :button_name="`Add ${viewWrapper.pageTitle}`" @search="search" :pagination="paginationVar"
    :default_per_page="default_per_page" @resetFilter="resetFilter" />
  <VFlexTableWrapper :columns="columns" :data="nationalitiesList" @update:sort="citySort">
    <VFlexTable separators clickable>
      <template #body>
        <div v-if="nationalityStore?.loading" class="flex-list-inner">
          <div v-for="key in paginationVar.per_page" :key="key" class="flex-table-item">
            <VFlexTableCell>
              <VPlaceload />
            </VFlexTableCell>
          </div>
        </div>
        <div v-else-if="nationalitiesList.length === 0" class="flex-list-inner">
          <VPlaceholderSection title="No matches" subtitle="There is no data that match your search." class="my-6">
          </VPlaceholderSection>
        </div>
      </template>
    </VFlexTable>
    <VFlexPagination v-if="(nationalitiesList.length != 0 && paginationVar.max_page != 1)"
      :current-page="paginationVar.page" class="mt-6" :item-per-page="paginationVar.per_page"
      :total-items="paginationVar.total" :max-links-displayed="3" no-router
      @update:current-page="getNationalitiesPerPage" />
    <h6 v-if="nationalitiesList.length != 0 && !nationalityStore?.loading">Showing {{ paginationVar.page !=
        paginationVar.max_page
        ?
        (1 + ((paginationVar.page - 1) * paginationVar.count)) : paginationVar.page == 1 ? 1 : paginationVar.total
    }} to {{
    paginationVar.page !=
      paginationVar.max_page ?
      paginationVar.page *
      paginationVar.per_page : paginationVar.total
}} of {{ paginationVar.total }} entries</h6>

    <VPlaceloadText v-if="nationalityStore?.loading" :lines="1" last-line-width="20%" class="mx-2" />
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

