<script setup lang="ts">import { useHead } from '@vueuse/head';
import VTag from '/@src/components/base/tags/VTag.vue';
import NoDeleteDropDown from '/@src/components/OurComponents/NoDeleteDropDown.vue';
import { useNotyf } from '/@src/composable/useNotyf';
import { defaultContractorSearchFilter, ContractorSearchFilter, Contractor } from '/@src/models/Contractor/contractor';
import { CustomerConsts } from '/@src/models/CRM/Customer/customer';
import { getContractorsList } from '/@src/services/Contractor/contractorService';
import { useContractor } from '/@src/stores/Contractor/contractorStore';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { defaultPagination } from '/@src/utils/response';


const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Contractor')
useHead({
    title: 'Contractor',
})
const notif = useNotyf()
const searchFilter = ref(defaultContractorSearchFilter)
const contractorsList = ref<Array<Contractor>>([])
const paginationVar = ref(defaultPagination)
const router = useRouter()
const contractorStore = useContractor()
const keyIncrement = ref(0)
onMounted(async () => {
    const { contractors, pagination } = await getContractorsList(searchFilter.value)
    contractorsList.value = contractors
    paginationVar.value = pagination
    keyIncrement.value = keyIncrement.value + 1
});




const search = async (searchFilter2: ContractorSearchFilter) => {
    paginationVar.value.per_page = searchFilter2.per_page ?? paginationVar.value.per_page
    const { contractors, pagination } = await getContractorsList(searchFilter2)

    contractorsList.value = contractors
    paginationVar.value = pagination
    searchFilter.value = searchFilter2
}

const resetFilter = async (searchFilter2: ContractorSearchFilter) => {
    searchFilter.value = searchFilter2
    await search(searchFilter.value)
}

const getContractorsPerPage = async (pageNum: number) => {
    searchFilter.value.page = pageNum
    await search(searchFilter.value)
}
const contractorSort = async (value: string) => {
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

        searchable: true,
        sortable: true,
    },
    "users.name": {
        align: 'center',

        label: 'Name',
        grow: 'lg',
        renderRow: (row: any) =>
            h('span', row?.user?.first_name + ' ' + row?.user?.last_name),

        sortable: true,
        searchable: true,

    },
    "users.gender": {
        align: 'center',

        label: 'Gender',
        renderRow: (row: any) =>
            h(
                VTag,
                {
                    rounded: true,
                    color:
                        row?.user?.gender === 'Male'
                            ? 'primary'
                            : row?.user?.gender === 'Female'
                                ? 'orange'
                                : undefined,
                },
                {
                    default() {
                        return row?.user?.gender
                    },
                }
            ),

        sortable: true,
        searchable: true,

    },
    "users.phone_number": {
        align: 'center',
        grow: true,
        label: 'Phone',
        renderRow: (row: any) =>
            h('span', row?.user?.phone_number),

        sortable: true,
        searchable: true,


    },
    "users.birth_date": {
        align: 'center',

        label: 'Birth date',
        renderRow: (row: any) =>
            h('span', row?.user?.birth_date),

        searchable: true,
        sortable: true


    },
    room: {
        align: 'center',

        label: 'Room',
        renderRow: (row: any) =>
            h('span', row?.user?.room?.number),

        searchable: true,


    },
    status: {
        align: 'center',

        label: 'status',
        renderRow: (row: any) =>
            h(
                VTag,
                {
                    rounded: true,
                    color:
                        row?.user?.status?.name === 'Pending'
                            ? 'orange'
                            : row?.user?.status?.name === 'Waiting'
                                ? 'blue'
                                : row?.user?.status?.name === 'Approved'
                                    ? 'green'
                                    : row?.user?.status?.name === 'Deleted'
                                        ? 'warning'
                                        : row?.user?.status?.name === 'Busy'
                                            ? 'danger'
                                            : undefined,
                },
                {
                    default() {
                        return row?.user?.status?.name
                    },
                }
            ),
        searchable: true,


    },
    is_completed: {
        align: 'center',

        label: 'completed',
        renderRow: (row: any) =>
            h(
                VTag,
                {
                    rounded: true,
                    color:
                        row?.is_completed === CustomerConsts.TRUE
                            ? 'primary'
                            : row?.is_completed === CustomerConsts.FALSE
                                ? 'warning'
                                : undefined,
                },
                {
                    default() {
                        return CustomerConsts.showBoolean(row?.is_completed)
                    },
                }
            ),
        searchable: true,



    },
    created_at: {
        align: 'center',

        label: 'Create Date',
        renderRow: (row: any) =>
            h('span', row?.created_at),
        searchable: true,
        sortable: true,

    },
    actions: {
        align: 'center',

        renderRow: (row: any) =>
            h(NoDeleteDropDown, {

                onEdit: () => {
                    router.push({ path: `/contractor-edit/${row?.id}/` })
                },
                onView: () => {
                    router.push({ path: `/contractor/${row?.id}` })
                },

            }),

    },
} as const
</script>

<template>
    <ContractorTableHeader :key="keyIncrement" :title="viewWrapper.pageTitle"
        :button_name="`Add ${viewWrapper.pageTitle}`" @search="search" :pagination="paginationVar"
        @resetFilter="resetFilter" />
    <VFlexTableWrapper :columns="columns" :data="contractorsList" :limit="searchFilter.per_page"
        @update:sort="contractorSort">

        <VFlexTable separators clickable>
            <template #body>
                <div v-if="contractorStore?.loading" class="flex-list-inner">
                    <div v-for="key in paginationVar.per_page" :key="key" class="flex-table-item">
                        <VFlexTableCell>
                            <VPlaceload />
                        </VFlexTableCell>

                    </div>
                </div>
                <div v-else-if="contractorsList.length === 0" class="flex-list-inner">
                    <VPlaceholderSection title="No matches" subtitle="There is no data that match your search."
                        class="my-6">
                    </VPlaceholderSection>
                </div>

            </template>
        </VFlexTable>
        <VFlexPagination v-if="(contractorsList.length != 0 && paginationVar.max_page != 1)"
            :current-page="paginationVar.page" class="mt-6" :item-per-page="paginationVar.per_page"
            :total-items="paginationVar.total" :max-links-displayed="3" no-router
            @update:current-page="getContractorsPerPage" />
        <h6 v-if="contractorsList.length != 0 && !contractorStore?.loading">Showing {{ paginationVar.page !=
                paginationVar.max_page
                ?
                (1 + ((paginationVar.page - 1) * paginationVar.count)) : paginationVar.page == 1 ? 1 : paginationVar.total
        }} to {{
        paginationVar.page !=
            paginationVar.max_page ?
            paginationVar.page *
            paginationVar.per_page : paginationVar.total
}} of {{ paginationVar.total }} entries</h6>
        <VPlaceloadText v-if="contractorStore?.loading" :lines="1" last-line-width="20%" class="mx-2" />


    </VFlexTableWrapper>

</template>
