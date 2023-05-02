<script lang="ts">
import { defaultWalletMovementSearchFilter, WalletMovementSearchFilter } from "/@src/models/Contractor/walletMovement"
import { useI18n } from 'vue-i18n'


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
        const searchContractorName = ref()
        const searchDateBetween = ref()
        const searchFrom = ref()
        const searchTo = ref()
        const searchCreatedBy = ref()
        const searchFilter = ref(defaultWalletMovementSearchFilter)

        let search_filter_popup = computed({
            get: () => props.search_filter_popup as boolean,
            set(value) {
                value = false
                context.emit('search_filter_popup', value)

            },
        })

        const search = () => {
            searchFilter.value = {
                contractor_name: searchContractorName.value,
                created_by: searchCreatedBy.value,
                date_between: 'created_at',
                from: searchFrom.value,
                to: searchTo.value,
            }
            context.emit('search', searchFilter.value)
            search_filter_popup.value = false

        }
        const resetFilter = () => {
            searchContractorName.value = undefined
            searchCreatedBy.value = undefined
            searchFrom.value = undefined
            searchTo.value = undefined
            searchFilter.value.contractor_name = undefined
            searchFilter.value.created_by = undefined
            searchFilter.value.date_between = undefined
            searchFilter.value.from = undefined
            searchFilter.value.to = undefined

            context.emit('resetFilter', searchFilter.value)
        }


        return {t, search, resetFilter, search_filter_popup,searchContractorName,searchCreatedBy, searchDateBetween, searchFrom, searchTo }




    },


})




</script>

<template>
    <VModal :title="t('walletMovement.search_filter.title')" :open="search_filter_popup" actions="center" @close="search_filter_popup = false">
        <template #content>
            <form class="form-layout" @submit.prevent="">
                <VField class="column filter">
                    <VControl icon="feather:user">
                        <input v-model="searchContractorName" type="text" class="input " :placeholder="t('walletMovement.search_filter.contractor_name')" />
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl >
                        <input v-model="searchCreatedBy" type="text" class="input " :placeholder="t('walletMovement.search_filter.created_by')" />
                    </VControl>
                </VField>
                <div class="column filter columns-is-multiliine">
                    <h1 class="column-is-12">{{t('walletMovement.search_filter.date')}}</h1>
                    <VField class="column-is-6 filter">
                        <VLabel class="mt-4">{{t('walletMovement.search_filter.from')}}</VLabel>
                        <VControl icon="feather:chevrons-right">
                            <VInput v-model="searchFrom" type="date" />
                        </VControl>
                    </VField>
                    <VField class="column-is-6 filter">
                        <VLabel>{{ t('walletMovement.search_filter.to') }}</VLabel>

                        <VControl icon="feather:chevrons-right">
                            <VInput v-model="searchTo" type="date" />
                        </VControl>
                    </VField>
                </div>

                <VButton type="submit" @click="search" class="is-hidden" />
            </form>
        </template>
        <template #action="{ close }">
            <VButton icon="fas fa-filter" color="primary" raised @click="search">{{ t('modal.buttons.filter')}}</VButton>
        </template>



    </VModal>
</template>

   