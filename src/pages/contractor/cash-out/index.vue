<script setup lang="ts">import { useHead } from '@vueuse/head';
import { Notyf } from 'notyf';
import { ErrorMessage } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import VTag from '/@src/components/base/tags/VTag.vue';
import WalletMovementClickName from '/@src/components/OurComponents/Contractor/WalletMovement/walletMovementClickName.vue';
import { useNotyf } from '/@src/composable/useNotyf';
import { defaultWalletMovementSearchFilter, WalletMovementSearchFilter ,WalletMovement} from "/@src/models/Contractor/walletMovement"
import { defaultChangeStatusUser } from '/@src/models/Others/User/user';
import { UserStatus, defaultUserStatusSearchFilter } from '/@src/models/Others/UserStatus/userStatus';
import { getContractorsList } from '/@src/services/Contractor/contractorService';
import { getWalletMovementsList } from '/@src/services/Contractor/WalletMovement/walletMovementService';
import { changeUserStatus } from '/@src/services/Others/User/userService';
import { getUserStatusesList } from '/@src/services/Others/UserStatus/userstatusService';
import { useWalletMovement } from '/@src/stores/Contractor/WalletMovement/walletMovementStore';
import { useViewWrapper } from '/@src/stores/viewWrapper';
import { defaultPagination } from '/@src/utils/response';
import sleep from '/@src/utils/sleep';
import { stringTrim } from '/@src/composable/helpers/stringHelpers';

const {t} = useI18n()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle(t('walletMovement.table.title'))
useHead({
    title: t('walletMovement.table.title'),
})
const notif = useNotyf() as Notyf
const searchFilter = ref(defaultWalletMovementSearchFilter)
const walletMovementList = ref<Array<WalletMovement>>([])
const paginationVar = ref(defaultPagination)
const router = useRouter()
const walletMovementStore = useWalletMovement()
const keyIncrement = ref(0)
const default_per_page = ref(1)
const changeStatusPopup = ref(false)
onMounted(async () => {
    searchFilter.value.action = 'cash_out'
    const { walletMovements, pagination } = await getWalletMovementsList(searchFilter.value)
    walletMovementList.value = walletMovements
    paginationVar.value = pagination
    keyIncrement.value = keyIncrement.value + 1
    default_per_page.value = pagination.per_page
});




const search = async (searchFilter2: WalletMovementSearchFilter) => {
    paginationVar.value.per_page = searchFilter2.per_page ?? paginationVar.value.per_page
    const { walletMovements, pagination } = await getWalletMovementsList(searchFilter2)
    walletMovementList.value = walletMovements
    paginationVar.value = pagination
    searchFilter.value = searchFilter2
}

const resetFilter = async (searchFilter2: WalletMovementSearchFilter) => {
    searchFilter.value = searchFilter2
    await search(searchFilter.value)
}

const getWalletMovementsPerPage = async (pageNum: number) => {
    searchFilter.value.page = pageNum
    await search(searchFilter.value)
}
const walletMovementSort = async (value: string) => {
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
    "wallet.contractor.user.name": {
        align: 'center',
        label: t('walletMovement.table.columns.contractor_name'),
        grow: true,
        searchable: true,
        sortable: true,
        renderRow: (row: any) =>
        h(
                WalletMovementClickName, {
                clickable: true,
                title: row?.wallet?.contractor_name,
                onClick: () => {
                    router.push({ path: `/contractor/${row?.wallet?.contractor_id}` ,
                       query: { tab: 'Wallet' }});
                },
            } ),
    },
    total: {
        align: 'center',
        label:  t('walletMovement.table.columns.total'),
        sortable: true,
        renderRow: (row: any) =>
            h('span', row?.total),
    },
    note: {
        align: 'center',
        label: t('walletMovement.table.columns.note'),
        renderRow: (row: any) =>
            h('span', {
                innerHTML: row?.note ?
                    `<div class="tooltip">${stringTrim(row?.note,10)}<div class="tooltiptext"><p class="text-white">${row?.note}</p></div></div>`: '-',
            }),
    },
    created_by: {
        align: 'center',
        label: t('walletMovement.table.columns.created_by'),
        renderRow: (row: any) =>
            h('span', row?.created_by?.first_name),

        searchable: true,
    },
    created_at: {
        align: 'center',
        label: t('walletMovement.table.columns.created_at'),
        renderRow: (row: any) =>
            h('span', row?.created_at),
        searchable: true,
        sortable: true,

    },
} as const
</script>

<template>
    <WalletMovementTableHeader :key="keyIncrement" :title="viewWrapper.pageTitle"
        :button_name="t('walletMovement.header_button')" @search="search" :pagination="paginationVar"
        :default_per_page="default_per_page" @resetFilter="resetFilter" />
    <VFlexTableWrapper :columns="columns" :data="walletMovementList" :limit="searchFilter.per_page"
        @update:sort="walletMovementSort">
        <VFlexTable separators clickable>
            <template #body>
                <div v-if="walletMovementStore?.loading" class="flex-list-inner">
                    <div v-for="key in paginationVar.per_page" :key="key" class="flex-table-item">
                        <VFlexTableCell>
                            <VPlaceload />
                        </VFlexTableCell>
                    </div>
                </div>
                <div v-else-if="walletMovementList.length === 0" class="flex-list-inner">
                    <VPlaceholderSection :title="t('tables.placeholder.title')" :subtitle="t('tables.placeholder.subtitle')"
                        class="my-6">
                    </VPlaceholderSection>
                </div>
            </template>
        </VFlexTable>
        <VFlexPagination v-if="(walletMovementList.length != 0 && paginationVar.max_page != 1)"
            :current-page="paginationVar.page" class="mt-6" :item-per-page="paginationVar.per_page"
            :total-items="paginationVar.total" :max-links-displayed="3" no-router
            @update:current-page="getWalletMovementsPerPage" />
        <h6 class="pt-2 is-size-7" v-if="walletMovementList.length != 0 && !walletMovementStore?.loading">
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

        <VPlaceloadText v-if="walletMovementStore?.loading" :lines="1" last-line-width="20%" class="mx-2" />


    </VFlexTableWrapper>

</template>

<style  lang="scss">
.tooltip {
    position: relative;
    display: inline-block;
}

.tooltip .tooltiptext {
    visibility: hidden;
    width: 150px;
    background-color: white;
    text-align: center;
    border-radius: 6px;
    padding: 5px;
    word-break: keep-all;
    white-space: normal;


    /* Position the tooltip */
    position: absolute;
    z-index: 1;
}

.tooltip:hover .tooltiptext {
    visibility: visible;


}

.is-dark {
    .tooltip .tooltiptext {
        background-color: rgb(43, 41, 41);
    }
}
</style>
