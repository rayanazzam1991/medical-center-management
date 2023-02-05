<script lang="ts">
import { useI18n } from "vue-i18n"
import { SupplierConsts, SupplierSearchFilter, defaultSupplierSearchFilter } from "/@src/models/Others/Supplier/supplier"
import { City, CitySearchFilter } from "/@src/models/Others/City/city"
import { getSuppliersList } from "/@src/services/Others/Supplier/supplierService"
import { getCitiesList } from "/@src/services/Others/City/cityService"


export default defineComponent({
    props: {
        title: {
            type: String,
            default: '',
        },
        button_name: {
            type: String,
            default: '',
        },
        search_filter_popup: {
            default: false,
        },
        is_reseted: {
            type: Boolean,
            default: false,
        }
    },
    emits: ['search_filter_popup', 'search', 'resetFilter'],
    setup(props, context) {
        const {t} = useI18n()
        const searchName = ref()
        const searchPhoneNumber = ref()
        const searchStatus = ref()
        const searchFilter = ref(defaultSupplierSearchFilter)
        const test = ref()
        let search_filter_popup = computed({
            get: () => props.search_filter_popup as boolean,
            set(value) {
                value = false
                context.emit('search_filter_popup', value)
            },
        })
        const search = () => {
            searchFilter.value = {
              name: searchName.value,
              phone_number: searchPhoneNumber.value,
              status: searchStatus.value,
            }
            context.emit('search', searchFilter.value)
            search_filter_popup.value = false
        }
        const resetFilter = () => {
          searchName.value = undefined
          searchPhoneNumber.value = undefined
            searchStatus.value = undefined
            searchFilter.value.name = undefined
            searchFilter.value.phone_number = undefined
            searchFilter.value.status = undefined
            context.emit('resetFilter', searchFilter.value)
        }
        const city2 = ref<City[]>([])
        onMounted(async () => {
            let citiesSearchFilter = {} as CitySearchFilter
            citiesSearchFilter.per_page = 500
            const  { cities }  = await getCitiesList(citiesSearchFilter)
            city2.value = cities
        })
        return {t ,SupplierConsts, search, resetFilter, city2, search_filter_popup, searchName, searchPhoneNumber, searchStatus }
    },
})
</script>

<template>
    <VModal :title="t('room.search_filter.title')" :open="search_filter_popup" actions="center" @close="search_filter_popup = false">
        <template #content>
            <form class="form-layout" @submit.prevent="">
                <VField class="column filter">
                    <VControl icon="feather:search">
                        <input v-model="searchName" type="text" class="input " :placeholder="t('supplier.search_filter.name')" />
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl icon="feather:search">
                        <input v-model="searchPhoneNumber" type="text" class="input " :placeholder="t('supplier.search_filter.phone_number')" />
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl>
                        <VSelect v-model="searchStatus" class="">
                            <VOption value="">{{t('supplier.search_filter.status')}}</VOption>
                            <VOption value="0">{{ SupplierConsts.getSupplierStatusName(0) }}</VOption>
                            <VOption value="1">{{ SupplierConsts.getSupplierStatusName(1) }}</VOption>
                            <VOption value="2">{{ SupplierConsts.getSupplierStatusName(2) }}</VOption>
                        </VSelect>
                    </VControl>
                </VField>
                <VButton type="submit" @click="search" class="is-hidden" />

            </form>
        </template>
        <template #action="{ close }">
            <VButton icon="fas fa-filter" color="primary" raised @click="search">{{t('modal.buttons.filter')}}</VButton>
        </template>
    </VModal>
</template>

