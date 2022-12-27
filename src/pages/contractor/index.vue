<script setup lang="ts">import { useHead } from '@vueuse/head';
import { ErrorMessage } from 'vee-validate';
import VTag from '/@src/components/base/tags/VTag.vue';
import NoEditDropDown from '/@src/components/OurComponents/NoEditDropDown.vue';

import { useNotyf } from '/@src/composable/useNotyf';
import { defaultContractorSearchFilter, ContractorSearchFilter, Contractor, defaultContractor } from '/@src/models/Contractor/contractor';
import { CustomerConsts } from '/@src/models/CRM/Customer/customer';
import { defaultChangeStatusUser } from '/@src/models/Others/User/user';
import { UserStatus, defaultUserStatusSearchFilter } from '/@src/models/Others/UserStatus/userStatus';
import { getContractorsList } from '/@src/services/Contractor/contractorService';
import { changeUserStatus } from '/@src/services/Others/User/userService';
import { getUserStatusesList } from '/@src/services/Others/UserStatus/userstatusService';
import { useContractor } from '/@src/stores/Contractor/contractorStore';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { defaultPagination } from '/@src/utils/response';
import sleep from '/@src/utils/sleep';


const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Contractor')
useHead({
    title: 'Contractor',
})
const notif = useNotyf()
const searchFilter = ref(defaultContractorSearchFilter)
const contractorsList = ref<Array<Contractor>>([])
const statusesList = ref<Array<UserStatus>>([])
const paginationVar = ref(defaultPagination)
const router = useRouter()
const contractorStore = useContractor()
const keyIncrement = ref(0)
const default_per_page = ref(1)
const changeStatusPopup = ref(false)
const contractorChangeStatus = ref<Contractor>(defaultContractor)
const currentChangeStatusUser = ref(defaultChangeStatusUser)

onMounted(async () => {
    const { contractors, pagination } = await getContractorsList(searchFilter.value)
    contractorsList.value = contractors
    paginationVar.value = pagination
    keyIncrement.value = keyIncrement.value + 1
    default_per_page.value = pagination.per_page
    const { userstatuses } = await getUserStatusesList(defaultUserStatusSearchFilter)
    statusesList.value = userstatuses


});

const changestatusUser = async () => {
    currentChangeStatusUser.value.id = contractorChangeStatus.value.user.id
    currentChangeStatusUser.value.user_status_id = contractorChangeStatus.value.user.status.id
    const { message, success } = await changeUserStatus(currentChangeStatusUser.value)
    if (success) {

        search(searchFilter.value)
        // @ts-ignore
        notif.dismissAll()
        await sleep(200);

        // @ts-ignore
        notif.success(`${contractorChangeStatus.value.user.first_name} ${contractorChangeStatus.value.user.last_name} status was edited successfully`)
    } else {
        await sleep(200);

        notif.error(message)
    }
    changeStatusPopup.value = false
}




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
    "users.name": {
        align: 'center',

        label: 'Name',
        grow: true,
        renderRow: (row: any) =>
            h('span', row?.user?.first_name + ' ' + row?.user?.last_name),

        sortable: true,
        searchable: true,

    },
    "users.phone_number": {
        align: 'center',
        grow: false,
        label: 'Phone',
        renderRow: (row: any) =>
            h('span', row?.user?.phone_number),

        sortable: true,
        searchable: true,


    },
    speciality: {
        align: 'center',
        label: 'Speciality',
        renderRow: (row: any) =>
            h('span', row?.speciality?.name),



    },
    "users.rooms.department": {
        align: 'center',

        label: 'Department',
        renderRow: (row: any) =>
            h('span', row?.user?.room?.department?.name),

        searchable: true,


    },
    "users.room": {
        align: 'center',

        label: 'Room #',
        renderRow: (row: any) =>
            h('span', row?.user?.room?.number),

        searchable: true,


    },
    "users.status": {
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
    created_at: {
        align: 'center',

        label: 'Create Date',
        renderRow: (row: any) =>
            h('span', row?.created_at),
        searchable: true,
        sortable: true,

    },
    actions: {
        align: 'end',
        grow: false,
        renderRow: (row: any) =>
            h(NoEditDropDown, {
                onView: () => {
                    router.push({ path: `/contractor/${row?.id}` })
                },
                onChangeStatus: () => {
                    contractorChangeStatus.value = row
                    changeStatusPopup.value = true
                }

            }),

    },
} as const
</script>

<template>
    <ContractorTableHeader :key="keyIncrement" :title="viewWrapper.pageTitle"
        :button_name="`Add ${viewWrapper.pageTitle}`" @search="search" :pagination="paginationVar"
        :default_per_page="default_per_page" @resetFilter="resetFilter" />
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
    <VModal title="Change User Status" :open="changeStatusPopup" actions="center" @close="changeStatusPopup = false">
        <template #content>
            <form class="form-layout" @submit.prevent="">
                <!--Fieldset-->
                <div class="form-fieldset">
                    <div class="columns is-multiline">
                        <div class="column is-12">
                            <VField class="column " id="user_status_id">
                                <VLabel>{{ viewWrapper.pageTitle }} status</VLabel>
                                <VControl>
                                    <VSelect v-model="contractorChangeStatus.user.status.id">
                                        <VOption v-for="status in statusesList" :key="status.id" :value="status.id">{{
        status.name
}}
                                        </VOption>
                                    </VSelect>
                                    <ErrorMessage name="user_status_id" />
                                </VControl>
                            </VField>
                        </div>
                    </div>
                </div>
            </form>
        </template>
        <template #action="{ close }">
            <VButton color="primary" raised @click="changestatusUser()">Confirm</VButton>
        </template>
    </VModal>

</template>
