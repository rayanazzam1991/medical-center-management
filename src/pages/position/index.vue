<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "permissions": [
            "position_list"
        ]
    }
}
</route>
    
<script setup lang="ts">
import NoDeleteDropDown from '/@src/components/OurComponents/NoDeleteDropDown.vue'
import VTag from '/@src/components/base/tags/VTag.vue'
import VButton from '/@src/components/base/button/VButton.vue'
import { useHead } from '@vueuse/head'
import { getPositionsList, changePositionStatus } from '/@src/services/Others/Position/positionService'
import { useNotyf } from '/@src/composable/useNotyf'
import { defaultPositionSearchFilter, PositionSearchFilter, PositionConsts, defaultPosition, Position, defaultChangePositionStatus } from '/@src/models/Others/Position/position'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { defaultPagination } from '/@src/utils/response'
import { usePosition } from '/@src/stores/Others/Position/positionStore'
import sleep from "/@src/utils/sleep"
import VButtonVue from '/@src/components/base/button/VButton.vue'
import VIconButtonVue from '/@src/components/base/button/VIconButton.vue'
import { useI18n } from 'vue-i18n'
import { Notyf } from 'notyf'
import { Permissions } from '/@src/utils/consts/rolesPermissions'
const { t } = useI18n()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle(t('position.table.title'))
useHead({
    title: t('position.table.title'),
})
const notif = useNotyf() as Notyf
const searchFilter = ref(defaultPositionSearchFilter)
const positionsList = ref<Array<Position>>([])
const paginationVar = ref(defaultPagination)
const positionStore = usePosition()
const changeStatusPopup = ref(false)
const positionChangeStatus = ref<Position>(defaultPosition)
const currentChangeStatusPosition = ref(defaultChangePositionStatus)
const default_per_page = ref(1)
const keyIncrement = ref(0)

const router = useRouter()
onMounted(async () => {
    const { positions, pagination } = await getPositionsList(searchFilter.value)
    positionsList.value = positions
    paginationVar.value = pagination
    keyIncrement.value = keyIncrement.value + 1
    default_per_page.value = pagination.per_page

});


const search = async (searchFilter2: PositionSearchFilter) => {
    paginationVar.value.per_page = searchFilter2.per_page ?? paginationVar.value.per_page

    const { positions, pagination } = await getPositionsList(searchFilter2)

    positionsList.value = positions
    paginationVar.value = pagination
    searchFilter.value = searchFilter2

}

const resetFilter = async (searchFilter2: PositionSearchFilter) => {
    searchFilter.value = searchFilter2
    await search(searchFilter.value)
}

const getPositionsPerPage = async (pageNum: number) => {
    searchFilter.value.page = pageNum
    await search(searchFilter.value)
}
const positionSort = async (value: string) => {
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
const changestatusPosition = async () => {
    currentChangeStatusPosition.value.id = currentChangeStatusPosition.value.id
    const { message, success } = await changePositionStatus(currentChangeStatusPosition.value)
    if (success) {
        search(searchFilter.value)
        // @ts-ignore
        notif.dismissAll()
        await sleep(200);
        // @ts-ignore
        notif.success(t('toast.success.edit'))
    } else {
        await sleep(200);

        notif.error(message)
    }
    changeStatusPopup.value = false
}

const columns = {
    id: {
        align: 'center',
        sortable: true,
        label: t('position.table.columns.id')

    },
    name: {
        align: 'center',
        sortable: true,
        label: t('position.table.columns.name')


    },
    description: {
        align: 'center',
        sortable: true,
        label: t('position.table.columns.description'),
        renderRow: (row: Position) =>
            h('span', row?.description ?? '-'),


    },
    status: {
        align: 'center',
        label: t('position.table.columns.status'),

        renderRow: (row: any) =>
            h(
                VTag,
                {
                    rounded: true,
                    color:
                        row.status === PositionConsts.INACTIVE
                            ? 'danger'
                            : row.status === PositionConsts.ACTIVE
                                ? 'success'
                                : undefined,
                },
                {
                    default() {
                        return PositionConsts.showStatusName(row.status)
                    },
                }
            ),

    },
    actions: {
        align: 'center',
        label: t('position.table.columns.actions'),

        renderRow: (row: any) =>
            h(NoDeleteDropDown, {
                changeStatusPermission: Permissions.POSITION_EDIT,
                editPermission: Permissions.POSITION_EDIT,
                viewPermission: Permissions.POSITION_SHOW,
                onEdit: () => {
                    router.push({ path: `/position/${row.id}/edit` })
                },
                onView: () => {
                    router.push({ path: `/position/${row.id}` })
                },
                onChangeStatus: () => {
                    currentChangeStatusPosition.value = row
                    changeStatusPopup.value = true
                }
            }),

    },
} as const
</script>

<template>
    <PositionTableHeader :key="keyIncrement" :title="viewWrapper.pageTitle" :button_name="t('position.header_button')"
        @search="search" :pagination="paginationVar" :default_per_page="default_per_page" @resetFilter="resetFilter" />
    <VFlexTableWrapper :columns="columns" :data="positionsList" @update:sort="positionSort">

        <VFlexTable separators clickable>
            <template #body>
                <div v-if="positionStore?.loading" class="flex-list-inner">
                    <div v-for="key in paginationVar.per_page" :key="key" class="flex-table-item">
                        <VFlexTableCell>
                            <VPlaceload />
                        </VFlexTableCell>

                    </div>
                </div>
                <div v-else-if="positionsList.length === 0" class="flex-list-inner">
                    <VPlaceholderSection :title="t('tables.placeholder.title')" :subtitle="t('tables.placeholder.subtitle')"
                        class="my-6">
                    </VPlaceholderSection>
                </div>

            </template>
        </VFlexTable>
        <VFlexPagination v-if="(positionsList.length != 0 && paginationVar.max_page != 1)"
            :current-page="paginationVar.page" class="mt-6" :item-per-page="paginationVar.per_page"
            :total-items="paginationVar.total" :max-links-displayed="3" no-router
            @update:current-page="getPositionsPerPage" />
        <h6 class="pt-2 is-size-7" v-if="positionsList.length != 0 && !positionStore?.loading">
            {{
                t('tables.pagination_footer', {
                    from_number: paginationVar.page !=
                        paginationVar.max_page
                        ?
                        (1 + ((paginationVar.page - 1) * paginationVar.count)) : paginationVar.page == paginationVar.max_page ? (1 +
                            ((paginationVar.page - 1) * paginationVar.per_page)) : paginationVar.page == 1 ? 1 : paginationVar.total
                    , to_number: paginationVar.page !=
                        paginationVar.max_page ?
                        paginationVar.page *
                        paginationVar.per_page : paginationVar.total, all_number: paginationVar.total
                }) }}</h6>
        <VPlaceloadText v-if="positionStore?.loading" :lines="1" last-line-width="20%" class="mx-2" />

    </VFlexTableWrapper>
    <VModal :title="t('position.table.modal_title')" :open="changeStatusPopup" actions="center"
        @close="changeStatusPopup = false">
        <template #content>
            <form class="form-layout" @submit.prevent="">
                <!--Fieldset-->
                <div class="form-fieldset">
                    <div class="columns is-multiline">
                        <div class="column is-12">
                            <VField id="status" v-slot="{ field }">
                                <VLabel class="required">{{ t('position.table.columns.status') }}</VLabel>
                                <VControl>
                                    <VRadio v-model="currentChangeStatusPosition.status" :value="PositionConsts.INACTIVE"
                                        :label="PositionConsts.showStatusName(0)" name="status" color="danger" />
                                    <VRadio v-model="currentChangeStatusPosition.status" :value="PositionConsts.ACTIVE"
                                        :label="PositionConsts.showStatusName(1)" name="status" color="success" />
                                    <ErrorMessage class="help is-danger" name="status" />
                                </VControl>
                            </VField>
                        </div>
                    </div>

                </div>
            </form>
        </template>
        <template #action="{ close }">
            <VButton color="primary" raised @click="changestatusPosition()">{{ t('modal.buttons.confirm') }}</VButton>
        </template>
    </VModal>
</template>

