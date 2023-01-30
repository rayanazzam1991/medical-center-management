
<script lang="ts">
import { useI18n } from "vue-i18n"
import { defaultServiceSearchFilter, ServiceConsts } from "/@src/models/Others/Service/service"

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
        const { t} = useI18n()
        const searchName = ref('')
        const searchPrice = ref()
        const searchDuration = ref()
        const searchStatus = ref()
        const searchFilter = ref(defaultServiceSearchFilter)

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
                service_price: searchPrice.value,
                duration_minutes: searchDuration.value,
                status: searchStatus.value,
            }
            context.emit('search', searchFilter.value)
            search_filter_popup.value = false
        }
        const resetFilter = () => {
            searchName.value = ''
            searchPrice.value = undefined
            searchDuration.value = undefined
            searchStatus.value = undefined
            searchFilter.value.name = undefined
            searchFilter.value.service_price = undefined
            searchFilter.value.duration_minutes = undefined
            searchFilter.value.status = undefined
            context.emit('resetFilter', searchFilter.value)
        }

        return {t , ServiceConsts, search, resetFilter, search_filter_popup, searchName, searchPrice, searchDuration, searchStatus }




    },


})




</script>

<template>
    <VModal :title="t('service.search_filter.title')" :open="search_filter_popup" actions="center" @close="search_filter_popup = false">
        <template #content>
            <form class="form-layout" @submit.prevent="search">
                <VField class="column filter">
                    <VControl icon="feather:search">
                        <input v-model="searchName" type="text" class="input " :placeholder="t('service.search_filter.name')" />
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl icon="feather:search">
                        <input v-model="searchDuration" type="number" class="input " :placeholder="t('service.search_filter.duration')" />
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl icon="feather:search">
                        <input v-model="searchPrice" type="number" class="input " :placeholder="t('service.search_filter.price')" />
                    </VControl>
                </VField>
                <VField class="column filter ">
                    <VControl>
                        <VSelect v-model="searchStatus" class="">
                            <VOption value="">{{t('service.search_filter.status')}}</VOption>
                            <VOption value="0">{{ ServiceConsts.showStatusName(0) }}</VOption>
                            <VOption value="1">{{ ServiceConsts.showStatusName(1) }}</VOption>
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

   