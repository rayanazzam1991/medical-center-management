<script setup lang="ts">import { useHead } from '@vueuse/head';
import VTag from '/@src/components/base/tags/VTag.vue';
import MyDropDown from '/@src/components/OurComponents/MyDropDown.vue';
import { useNotyf } from '/@src/composable/useNotyf';
import { defaultCustomerGroupSearchFilter, CustomerGroupSearchFilter, CustomerGroupConsts } from '/@src/models/Others/CustomerGroup/customerGroup';
import { getCustomerGroupsList, deleteCustomerGroup } from '/@src/services/Others/CustomerGroup/customerGroupService';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { defaultPagination } from '/@src/utils/response';


const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Customer Group')
useHead({
  title: 'Customer Group',
})
const notif = useNotyf()
const searchFilter = ref(defaultCustomerGroupSearchFilter)
const customerGroupsList = ref()
const deleteCustomerGroupPopup = ref(false)
const deleteCustomerGroupId = ref()
const paginationVar = ref(defaultPagination)
const { customerGroups, pagination } = await getCustomerGroupsList(searchFilter.value)
customerGroupsList.value = customerGroups
paginationVar.value = pagination
const router = useRouter()

const removeCustomerGroup = async (customerGroupId: number) => {

  await deleteCustomerGroup(customerGroupId)
  deleteCustomerGroupPopup.value = false
  // @ts-ignore
  notif.success(`${viewWrapper.pageTitle} was deleted successfully`)

}

const search = async (searchFilter2: CustomerGroupSearchFilter) => {

  const { customerGroups, pagination } = await getCustomerGroupsList(searchFilter2)

  customerGroupsList.value = customerGroups
  paginationVar.value = pagination
  searchFilter.value = searchFilter2

}

const resetFilter = async (searchFilter2: CustomerGroupSearchFilter) => {
  searchFilter.value = searchFilter2
  search(searchFilter.value)
}

const getcustomerGroupsPerPage = async (pageNum: number) => {
  searchFilter.value.page = pageNum
  search(searchFilter.value)
}
const customerGroupSort = async (value: string) => {
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
            row?.status === CustomerGroupConsts.INACTIVE
              ? 'orange'
              : row?.status === CustomerGroupConsts.ACTIVE
                ? 'success'
                : undefined,
        },
        {
          default() {
            return CustomerGroupConsts.showStatusName(row?.status)
          },
        }
      ),

  },
  actions: {
    align: 'center',

    renderRow: (row: any) =>
      h(MyDropDown, {

        onRemove: () => {
          deleteCustomerGroupPopup.value = true
          deleteCustomerGroupId.value = row?.id
        },
        onEdit: () => {
          router.push({ path: `/customer-group/${row?.id}/edit` })
        },
        onView: () => {
          router.push({ path: `/customer-group/${row?.id}` })
        },

      }),

  },
} as const
</script>

<template>
  <CustomerGroupTableHeader :title="viewWrapper.pageTitle" :button_name="`Add ${viewWrapper.pageTitle}`"
    @search="search" :pagination="paginationVar" @resetFilter="resetFilter" />
  <VFlexTableWrapper :columns="columns" :data="customerGroupsList" @update:sort="customerGroupSort">

    <VFlexTable v-if="customerGroupsList.length != 0" :clickable="true" :separators="true"></VFlexTable>
    <VFlexPagination v-if="(customerGroupsList.length != 0  && paginationVar.max_page != 1)" :current-page="paginationVar.page" class="mt-6"
      :item-per-page="paginationVar.per_page" :total-items="paginationVar.total" :max-links-displayed="3" no-router
      @update:current-page="getcustomerGroupsPerPage" />
    <h6 v-if="customerGroupsList.length != 0">Showing {{ paginationVar.page != paginationVar.max_page
        ?
        (1 + ((paginationVar.page - 1) * paginationVar.count)) : paginationVar.page == 1 ? 1 : paginationVar.total
    }} to {{
    paginationVar.page !=
      paginationVar.max_page ?
      paginationVar.page *
      paginationVar.per_page : paginationVar.total
}} of {{ paginationVar.total }} entries</h6>

    <h1 v-if="customerGroupsList.length == 0">No Data Returned...</h1>
  </VFlexTableWrapper>
  <VModal title="Remove Customer Group" :open="deleteCustomerGroupPopup" actions="center"
    @close="deleteCustomerGroupPopup = false">
    <template #content>
      <VPlaceholderSection title="Are you sure?"
        :subtitle="`you are about to delete this ${viewWrapper.pageTitle} permenantly`" />
    </template>
    <template #action="{ close }">
      <VButton color="primary" raised @click="removeCustomerGroup(deleteCustomerGroupId)">Confirm</VButton>
    </template>
  </VModal>

</template>

