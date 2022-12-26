<script setup lang="ts">
import DropDown from '/@src/components/OurComponents/DropDown.vue'
import VTag from '/@src/components/base/tags/VTag.vue'
import VButton from '/@src/components/base/button/VButton.vue'
import { useHead } from '@vueuse/head'
import { deleteSpeciality, getSpecialitiesList } from '/@src/services/Others/Speciality/specialityService'
import { useNotyf } from '/@src/composable/useNotyf'
import { defaultSpecialitySearchFilter, SpecialitySearchFilter, SpecialityConsts, Speciality } from '/@src/models/Others/Speciality/speciality'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { defaultPagination } from '/@src/utils/response'
import { useSpeciality } from '/@src/stores/Others/Speciality/specialityStore'
import sleep from "/@src/utils/sleep"
import VButtonVue from '/@src/components/base/button/VButton.vue'
import VIconButtonVue from '/@src/components/base/button/VIconButton.vue'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Speciality')
useHead({
    title: 'Speciality',
})
const notif = useNotyf()
const searchFilter = ref(defaultSpecialitySearchFilter)
const specialitiesList = ref<Array<Speciality>>([])
const deleteSpecialityPopup = ref(false)
const deleteSpecialityId = ref()
const paginationVar = ref(defaultPagination)
const specialityStore = useSpeciality()

const default_per_page = ref(1)
const keyIncrement = ref(0)

const router = useRouter()
onMounted(async () => {
    const { specialities, pagination } = await getSpecialitiesList(searchFilter.value)
    specialitiesList.value = specialities
    paginationVar.value = pagination
    keyIncrement.value = keyIncrement.value + 1
    default_per_page.value = pagination.per_page

});

const deactivateSpeciality = async (specialityId: number) => {

    await deactivateSpeciality(specialityId)
    await search(searchFilter.value)
    deleteSpecialityPopup.value = false
    // @ts-ignore
    await sleep(200);

    notif.success(`${viewWrapper.pageTitle} was deactivated successfully`)

}
const activateSpeciality = async (specialityId: number) => {

    await activateSpeciality(specialityId)
    await search(searchFilter.value)
    deleteSpecialityPopup.value = false
    // @ts-ignore
    await sleep(200);

    notif.success(`${viewWrapper.pageTitle} was activated successfully`)

}

const search = async (searchFilter2: SpecialitySearchFilter) => {
    paginationVar.value.per_page = searchFilter2.per_page ?? paginationVar.value.per_page

    const { specialities, pagination } = await getSpecialitiesList(searchFilter2)

    specialitiesList.value = specialities
    paginationVar.value = pagination
    searchFilter.value = searchFilter2

}

const resetFilter = async (searchFilter2: SpecialitySearchFilter) => {
    searchFilter.value = searchFilter2
    await search(searchFilter.value)
}

const getSpecialitysPerPage = async (pageNum: number) => {
    searchFilter.value.page = pageNum
    await search(searchFilter.value)
}
const specialitySort = async (value: string) => {
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
        renderRow: (row: any) =>
            h(
                VTag,
                {
                    rounded: true,
                    color:
                        row.status === SpecialityConsts.INACTIVE
                            ? 'orange'
                            : row.status === SpecialityConsts.ACTIVE
                                ? 'success'
                                : undefined,

                },
                {
                    default() {
                        return SpecialityConsts.showStatusName(row.status)
                    },
                }
            ),

    },
    actions: {
        align: 'center',

        renderRow: (row: any) =>
            h(DropDown, {
                onEdit: () => {
                    router.push({ path: `/speciality/${row.id}/edit` })
                },
                onView: () => {
                    router.push({ path: `/speciality/${row.id}` })
                },

            }),

    },
} as const
</script>

<template>
    <SpecialityTableHeader :key="keyIncrement" :title="viewWrapper.pageTitle"
        :button_name="`Add ${viewWrapper.pageTitle}`" @search="search" :pagination="paginationVar"
        :default_per_page="default_per_page" @resetFilter="resetFilter" />
    <VFlexTableWrapper :columns="columns" :data="specialitiesList" @update:sort="specialitySort">

        <VFlexTable separators clickable>
            <template #body>
                <div v-if="specialityStore?.loading" class="flex-list-inner">
                    <div v-for="key in paginationVar.per_page" :key="key" class="flex-table-item">
                        <VFlexTableCell>
                            <VPlaceload />
                        </VFlexTableCell>

                    </div>
                </div>
                <div v-else-if="specialitiesList.length === 0" class="flex-list-inner">
                    <VPlaceholderSection title="No matches" subtitle="There is no data that match your search."
                        class="my-6">
                    </VPlaceholderSection>
                </div>

            </template>
        </VFlexTable>
        <VFlexPagination v-if="(specialitiesList.length != 0 && paginationVar.max_page != 1)"
            :current-page="paginationVar.page" class="mt-6" :item-per-page="paginationVar.per_page"
            :total-items="paginationVar.total" :max-links-displayed="3" no-router
            @update:current-page="getSpecialitysPerPage" />
        <h6 v-if="specialitiesList.length != 0 && !specialityStore?.loading">Showing {{ paginationVar.page !=
                paginationVar.max_page
                ?
                (1 + ((paginationVar.page - 1) * paginationVar.count)) : paginationVar.page == 1 ? 1 : paginationVar.total
        }} to {{
        paginationVar.page !=
            paginationVar.max_page ?
            paginationVar.page *
            paginationVar.per_page : paginationVar.total
}} of {{ paginationVar.total }} entries</h6>
        <VPlaceloadText v-if="specialityStore?.loading" :lines="1" last-line-width="20%" class="mx-2" />

    </VFlexTableWrapper>

</template>

