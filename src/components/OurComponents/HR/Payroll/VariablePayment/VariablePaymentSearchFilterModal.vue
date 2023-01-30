<script lang="ts">
import { useI18n } from 'vue-i18n'
import { defaultVariablePaymentSearchFilter, VariablePaymentConsts } from '/@src/models/HR/Payroll/VariablePayment/variablePayment'

export default defineComponent({
    props: {
        search_filter_popup: {
            default: false,
        },

    },
    emits: ['search_filter_popup', 'search', 'resetFilter'],
    setup(props, context) {
        const { t } = useI18n()
        const searchName = ref()
        const searchType = ref()
        const searchStatus = ref()
        const searchFilter = ref(defaultVariablePaymentSearchFilter)
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
                type: searchType.value,
                status: searchStatus.value
            }
            context.emit('search', searchFilter.value)
            search_filter_popup.value = false
        }
        const resetFilter = () => {
            searchName.value = undefined
            searchType.value = undefined
            searchStatus.value = undefined
            searchFilter.value.name = undefined
            searchFilter.value.type = undefined
            searchFilter.value.status = undefined
            context.emit('resetFilter', searchFilter.value)
        }
        return { t, search, resetFilter, search_filter_popup, searchName, searchStatus, searchType , VariablePaymentConsts }
    },
})
</script>

<template>
    <VModal :title="t('variable_payment.search_filter.title')" :open="search_filter_popup" actions="center"
        @close="search_filter_popup = false">
        <template #content>
            <form class="form-layout" @submit.prevent="">
                <VField class="column filter">
                    <VControl icon="feather:user">
                        <input v-model="searchName" type="text" class="input "
                            :placeholder="t('variable_payment.search_filter.name')" />
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl>
                        <VSelect v-model="searchType" class="">
                            <VOption value="">{{ t('variable_payment.search_filter.type') }}</VOption>
                        <VOption :value="VariablePaymentConsts.INCREMENT_TYPE">{{ VariablePaymentConsts.getTypeName(VariablePaymentConsts.INCREMENT_TYPE) }}</VOption>
                        <VOption :value="VariablePaymentConsts.DECREMENT_TYPE">{{ VariablePaymentConsts.getTypeName(VariablePaymentConsts.DECREMENT_TYPE) }}</VOption>
                        </VSelect>
                    </VControl>
                </VField>
                <VField class="column filter">
                    <VControl>
                        <VSelect v-model="searchStatus" class="">
                            <VOption value="">{{ t('variable_payment.search_filter.status') }}</VOption>
                        <VOption :value="VariablePaymentConsts.ACTIVE">{{ VariablePaymentConsts.showStatusName(VariablePaymentConsts.ACTIVE) }}</VOption>
                        <VOption :value="VariablePaymentConsts.INACTIVE">{{ VariablePaymentConsts.showStatusName(VariablePaymentConsts.INACTIVE) }}</VOption>
                        </VSelect>
                    </VControl>
                </VField>

                <VButton type="submit" @click="search" class="is-hidden" />
            </form>
        </template>
        <template #action="{ close }">
            <VButton icon="fas fa-filter" color="primary" raised @click="search">{{ t('modal.buttons.filter') }}</VButton>
        </template>
    </VModal>
</template>

