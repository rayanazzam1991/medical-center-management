<script lang="ts">
import { useI18n } from 'vue-i18n'
import { defaultTicketServiceSearchFilter, TicketServiceSearchFilter } from '/@src/models/Sales/TicketService/ticketService'
import { defaultPagination } from '/@src/utils/response'
import { resetServiceCardsListSearchFilter } from '/@src/services/Sales/WaitingList/waitingListService'





export default defineComponent({
    props: {
        title: {
            type: String,
            default: '',
        },
        pagination: {
            default: defaultPagination,
        },
        default_per_page: {
            type: Number,
            default: 1,
        },
    },


    setup(props, context) {
        const { t } = useI18n()
        const searchProviderName = ref()
        const searchCustomerName = ref()
        const default_per_page = props.default_per_page
        const pagination = props.pagination
        const perPage = ref(pagination.per_page)
        const searchFilter = ref(resetServiceCardsListSearchFilter())
        const keyIncrement = ref(0)

        const search = () => {
            searchFilter.value.per_page = perPage.value
            searchFilter.value.provider_name = searchProviderName.value
            searchFilter.value.customer_name = searchCustomerName.value
            searchFilter.value.page = 1
            context.emit('search', searchFilter.value)
        }
        const resetFilter = () => {
            searchFilter.value.customer_name = undefined
            searchFilter.value.provider_name = undefined
            searchCustomerName.value = undefined
            searchProviderName.value = undefined
            keyIncrement.value++
            context.emit('resetFilter', searchFilter.value)

        }
        return { t, keyIncrement, default_per_page, resetFilter, search, perPage, pagination, searchProviderName, searchCustomerName }
    },
})
</script>

<template>
    <form class="form-layout" v-on:submit.prevent="search">
        <div class="form-outer">
            <div class="form-header stuck-header">
                <h1 class="title">
                    {{ t('service_card.table.title') }}
                </h1>
                <div class="form-header-inner">
                    <div class="left my-4 mx-2 ">
                        <div class="columns is-flex is-align-items-center">
                            <VControl class="mr-2" icon="feather:search">
                                <VInput v-model="searchCustomerName" type="text"
                                    :placeholder="t('service_card.search_filter.customer_name')" />
                            </VControl>
                            <VControl class="mr-2" icon="feather:search">
                                <VInput v-model="searchProviderName" type="text"
                                    :placeholder="t('service_card.search_filter.provider_name')" />
                            </VControl>
                            <VIconButton class="mr-2 is-hidden" type="submit" icon="feather:rotate-ccw" />

                            <VIconButton class="mr-2" v-on:click="resetFilter" icon="feather:rotate-ccw" :raised="false"
                                color="danger" />
                        </div>
                    </div>
                    <div class="left my-4 mx-2">
                        <div class="columns is-flex is-align-items-center">
                            <VControl class="mr-2 ">
                                <div class="select">
                                    <select v-model="perPage" @change="search">
                                        <VOption :value="default_per_page * 0.1">{{ default_per_page * 0.1 }}
                                        </VOption>
                                        <VOption :value="default_per_page * 0.5">{{ default_per_page * 0.5 }}
                                        </VOption>
                                        <VOption :value="default_per_page">{{ default_per_page }}
                                        </VOption>
                                        <VOption :value="default_per_page * 2">{{ default_per_page * 2 }}
                                        </VOption>
                                        <VOption :value="default_per_page * 10">{{ default_per_page * 10 }}
                                        </VOption>
                                    </select>
                                </div>
                            </VControl>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</template>

<style scoped  lang="scss">
@import '/@src/scss/styles/tableHeader.scss';

.title {
    font-family: var(--font-alt);
    font-size: 1.25rem;
    margin-top: 1rem;

}
</style>
