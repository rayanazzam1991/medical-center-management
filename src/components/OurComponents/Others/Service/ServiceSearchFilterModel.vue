<script lang="ts">
import { ServiceSearchFilter } from '/@src/utils/api/Others/Service'
import { defaultServiceSearchFilter } from '/@src/stores/Others/Service/serviceStore'
import { ServiceConsts } from '/@src/utils/consts/service'
import { boolean } from 'zod'

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
        const searchName = ref('')
        const searchPrice = ref()
        const searchDuration = ref()
        const searchStatus = ref()
        const searchFilter = ref(defaultServiceSearchFilter)
        const test = ref()

        let search_filter_popup = computed({
            get: () => props.search_filter_popup as boolean,
            set(value) {
                value = false
                context.emit('search_filter_popup', value)
                console.log(value)

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
            console.log(searchFilter.value)
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

        return { ServiceConsts, search, resetFilter, search_filter_popup, searchName, searchPrice, searchDuration, searchStatus }




    },


})




</script>

<template>
    <VModal title="Search Service" :open="search_filter_popup" actions="center" @close="search_filter_popup = false">
        <template #content>
            <form class="form-layout" @submit.prevent="">
                <VField class="column filter">
                    <VControl icon="feather:search">
                        <input v-model="searchName" type="text" class="input is-rounded" placeholder="Name..." />
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl icon="feather:search">
                        <input v-model="searchDuration" type="number" class="input is-rounded"
                            placeholder="Duration..." />
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl icon="feather:search">
                        <input v-model="searchPrice" type="number" class="input is-rounded" placeholder="Price..." />
                    </VControl>
                </VField>
                <VField class="column filter ">
                    <VControl>
                        <VSelect v-model="searchStatus" class="is-rounded">
                            <VOption value="">Status</VOption>
                            <VOption value="0">{{ ServiceConsts.showStatusName(0) }}</VOption>
                            <VOption value="1">{{ ServiceConsts.showStatusName(1) }}</VOption>
                        </VSelect>
                    </VControl>
                </VField>
            </form>
        </template>
        <template #action="{ close }">
            <VButton color="primary" raised @click="search" icon="feather:search">Ok..</VButton>
        </template>
    </VModal>
</template>

   