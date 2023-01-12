<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { Notyf } from 'notyf'
import { useI18n } from 'vue-i18n'
import VTag from '/@src/components/base/tags/VTag.vue'
import MyDropDown from '/@src/components/OurComponents/MyDropDown.vue'
import { useNotyf } from '/@src/composable/useNotyf'
import { defaultCitySearchFilter, CitySearchFilter, CityConsts, City } from '/@src/models/Others/City/city'
import { getCitiesList, deleteCity } from '/@src/services/Others/City/cityService'
import { useCity } from '/@src/stores/Others/City/cityStore'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { defaultPagination } from '/@src/utils/response'
import sleep from '/@src/utils/sleep'
const viewWrapper = useViewWrapper()
const { t } = useI18n()
viewWrapper.setPageTitle(t('city.table.title'))
useHead({
  title: t('city.table.title'),
})
const notif = useNotyf() as Notyf
const cityStore = useCity()
const searchFilter = ref(defaultCitySearchFilter)
const citiesList = ref<Array<City>>([])
const deleteCityPopup = ref(false)
const deleteCityId = ref()
const paginationVar = ref(defaultPagination)
const keyIncrement = ref(0)
const router = useRouter()
const default_per_page = ref(1)
onMounted(async () => {
  const { cities, pagination } = await getCitiesList(searchFilter.value)
  citiesList.value = cities
  paginationVar.value = pagination
  keyIncrement.value = keyIncrement.value + 1
  default_per_page.value = pagination.per_page

});

const removeCity = async (cityId: number) => {

  const { message, success } = await deleteCity(cityId)
  deleteCityPopup.value = false
  await search(searchFilter.value)
  if (success) {

    await sleep(200);

    // @ts-ignore
    notif.success(`${viewWrapper.pageTitle} was deleted successfully`)

  } else notif.error(message)
}

const search = async (searchFilter2: CitySearchFilter) => {
  paginationVar.value.per_page = searchFilter2.per_page ?? paginationVar.value.per_page
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
    label: t("city.columns.id")

  },
  name: {
    align: 'center',
    sortable: true,
    label: t("city.columns.name")


  },
  status: {
    align: 'center',
    label: t("city.columns.status"),

    renderRow: (row: any) =>
      h(
        VTag,
        {
          rounded: true,
          color:
            row?.status === CityConsts.INACTIVE
              ? 'danger'
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
    label: t("city.columns.actions"),
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
  <CityTableHeader :key="keyIncrement" :title="viewWrapper.pageTitle" :button_name="`Add ${viewWrapper.pageTitle}`"
    @search="search" :pagination="paginationVar" :default_per_page="default_per_page" @resetFilter="resetFilter" />


  <VFlexTableWrapper :columns="columns" :data="citiesList" @update:sort="citySort">

    <VFlexTable separators clickable>
      <template #body>
        <div v-if="cityStore?.loading" class="flex-list-inner">
          <div v-for="key in paginationVar.per_page" :key="key" class="flex-table-item">
            <VFlexTableCell>
              <VPlaceload />
            </VFlexTableCell>
            <VFlexTableCell>
              <VPlaceload />
            </VFlexTableCell>
            <VFlexTableCell>
              <VPlaceload />
            </VFlexTableCell>
            <VFlexTableCell>
              <VPlaceload />
            </VFlexTableCell>
          </div>
        </div>
        <div v-else-if="citiesList.length === 0" class="flex-list-inner">
          <VPlaceholderSection :title="t('tables.placeholder.title')" :subtitle="t('tables.placeholder.subtitle')"
            class="my-6">
          </VPlaceholderSection>
        </div>

      </template>
    </VFlexTable>

    <VFlexPagination v-if="(citiesList.length != 0 && paginationVar.max_page != 1)" :current-page="paginationVar.page"
      class="mt-6" :item-per-page="paginationVar.per_page" :total-items="paginationVar.total" :max-links-displayed="3"
      no-router @update:current-page="getCitiesPerPage" />
    <h6 v-if="citiesList.length != 0 && !cityStore?.loading">
      {{
        t('tables.pagination_footer', { from_number: paginationVar.page !=
          paginationVar.max_page
          ?
          (1 + ((paginationVar.page - 1) * paginationVar.count)) : paginationVar.page == paginationVar.max_page ? (1 +
            ((paginationVar.page - 1) * paginationVar.per_page)) : paginationVar.page == 1 ? 1 : paginationVar.total
        , to_number: paginationVar.page !=
          paginationVar.max_page ?
          paginationVar.page *
          paginationVar.per_page : paginationVar.total, all_number: paginationVar.total
      })}}</h6>
    <VPlaceloadText v-if="cityStore?.loading" :lines="1" last-line-width="20%" class="mx-2" />

  </VFlexTableWrapper>




  <VModal :title="t('city.table.modal_title')" :open="deleteCityPopup" actions="center" @close="deleteCityPopup = false">
    <template #content>
      <VPlaceholderSection :title="t('modal.delete_modal.title')"
        :subtitle="t('modal.delete_modal.subtitle',{title: viewWrapper.pageTitle})" />
    </template>
    <template #action="{ close }">
      <VButton color="primary" raised @click="removeCity(deleteCityId)">{{ t('modal.buttons.confirm')}}</VButton>
    </template>
  </VModal>

</template>

