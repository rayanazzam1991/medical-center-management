<script setup lang="ts">
import NoDeleteDropDown from '/@src/components/OurComponents/NoDeleteDropDown.vue'
import VTag from '/@src/components/base/tags/VTag.vue'
import VButton from '/@src/components/base/button/VButton.vue'
import { useHead } from '@vueuse/head'
import { getSpecialitiesList, changeSpecialityStatus } from '/@src/services/Others/Speciality/specialityService'
import { useNotyf } from '/@src/composable/useNotyf'
import { defaultSpecialitySearchFilter, defaultSpeciality, defaultChangeSpecialityStatus, SpecialitySearchFilter, SpecialityConsts, Speciality } from '/@src/models/Others/Speciality/speciality'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { defaultPagination } from '/@src/utils/response'
import { useSpeciality } from '/@src/stores/Others/Speciality/specialityStore'
import sleep from "/@src/utils/sleep"
import VButtonVue from '/@src/components/base/button/VButton.vue'
import VIconButtonVue from '/@src/components/base/button/VIconButton.vue'
import { useI18n } from 'vue-i18n'
const {t} = useI18n()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle(t('speciality.table.title'))
useHead({
    title: t('speciality.table.title'),
})
const notif = useNotyf()
const searchFilter = ref(defaultSpecialitySearchFilter)
const specialitiesList = ref<Array<Speciality>>([])
const deleteSpecialityPopup = ref(false)
const paginationVar = ref(defaultPagination)
const specialityStore = useSpeciality()
const changeStatusPopup = ref(false)
const specialityChangeStatus = ref<Speciality>(defaultSpeciality)
const currentChangeStatusSpeciality = ref(defaultChangeSpecialityStatus)


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
const changestatusSpeciality = async () => {
    currentChangeStatusSpeciality.value.id = currentChangeStatusSpeciality.value.id
    const { message, success } = await changeSpecialityStatus(currentChangeStatusSpeciality.value)
    if (success) {
        search(searchFilter.value)
        // @ts-ignore
        notif.dismissAll()
        await sleep(200);
        // @ts-ignore
        notif.success(`${specialityChangeStatus.value.name} status was edited successfully`)
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
        label : t('speciality.table.columns.id')

    },
    name: {
        align: 'center',
        sortable: true,
        label : t('speciality.table.columns.name')


    },
    status: {
        align: 'center',
        label : t('speciality.table.columns.status'),

        renderRow: (row: any) =>
            h(
                VTag,
                {
                    rounded: true,
                    color:
                        row.status === SpecialityConsts.INACTIVE
                            ? 'danger'
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
        label : t('speciality.table.columns.actions'),

        renderRow: (row: any) =>
            h(NoDeleteDropDown, {
                onEdit: () => {
                    router.push({ path: `/speciality/${row.id}/edit` })
                },
                onView: () => {
                    router.push({ path: `/speciality/${row.id}` })
                },
                onChangeStatus: () => {
                    currentChangeStatusSpeciality.value = row
                    changeStatusPopup.value = true
                }

            }),

    },
} as const
</script>

<template>
    <SpecialityTableHeader :key="keyIncrement" :title="viewWrapper.pageTitle"
        :button_name="t('speciality.header_button')" @search="search" :pagination="paginationVar"
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
                    <VPlaceholderSection :title="t('tables.placeholder.title')" 
                    :subtitle="t('tables.placeholder.subtitle')" 
                        class="my-6">
                    </VPlaceholderSection>
                </div>

            </template>
        </VFlexTable>
        <VFlexPagination v-if="(specialitiesList.length != 0 && paginationVar.max_page != 1)"
            :current-page="paginationVar.page" class="mt-6" :item-per-page="paginationVar.per_page"
            :total-items="paginationVar.total" :max-links-displayed="3" no-router
            @update:current-page="getSpecialitysPerPage" />
        <h6 v-if="specialitiesList.length != 0 && !specialityStore?.loading">
        
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
        <VPlaceloadText v-if="specialityStore?.loading" :lines="1" last-line-width="20%" class="mx-2" />

    </VFlexTableWrapper>
    <VModal :title="t('speciality.table.modal_title')" :open="changeStatusPopup" actions="center"
        @close="changeStatusPopup = false">
        <template #content>
            <form class="form-layout" @submit.prevent="">
                <!--Fieldset-->
                <div class="form-fieldset">
                    <div class="columns is-multiline">
                        <div class="column is-12">
                            <VField id="status" v-slot="{ field }">
                                <VLabel class="required">{{ t('speciality.table.columns.status') }}</VLabel>
                                <VControl>
                                    <VRadio v-model="currentChangeStatusSpeciality.status"
                                        :value="SpecialityConsts.INACTIVE" :label="SpecialityConsts.showStatusName(0)"
                                        name="status" color="danger" />
                                    <VRadio v-model="currentChangeStatusSpeciality.status"
                                        :value="SpecialityConsts.ACTIVE" :label="SpecialityConsts.showStatusName(1)"
                                        name="status" color="success" />
                                    <ErrorMessage class="help is-danger" name="status" />
                                </VControl>
                            </VField>
                        </div>
                    </div>

                </div>
            </form>
        </template>
        <template #action="{ close }">
            <VButton color="primary" raised @click="changestatusSpeciality()">{{ t('modal.buttons.confirm')}}</VButton>
        </template>
    </VModal>

</template>

