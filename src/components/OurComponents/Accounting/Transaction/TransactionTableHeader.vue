<script lang="ts">
import { useI18n } from "vue-i18n"
import { defaultTransactionSearchFilter } from "/@src/models/Accounting/Transaction/record"
import { defaultPagination } from "/@src/utils/response"


export default defineComponent({
    props: {
        pagination: {
            default: defaultPagination,
        },
        default_per_page: {
            type: Number,
            default: 1,
        }

    },

    setup(props, context) {
        const { t } = useI18n()
        const default_per_page = props.default_per_page
        const pagination = props.pagination
        const searchTitle = ref('')
        const searchNote = ref('')
        const perPage = ref(pagination.per_page)
        const searchFilter = ref(defaultTransactionSearchFilter)
        const search = () => {
            searchFilter.value = {
                title: searchTitle.value,
                note: searchNote.value,
                per_page: perPage.value
            }
            context.emit('search', searchFilter.value)

        }

        const resetFilter = () => {
            searchTitle.value = ''
            searchNote.value = ''
            searchFilter.value.title = undefined
            searchFilter.value.note = undefined

            context.emit('resetFilter', searchFilter.value)

        }
        return { t, resetFilter, search, default_per_page, searchTitle, searchNote, perPage, pagination }
    },


})




</script>

<template>
    <form class="form-layout" v-on:submit.prevent="search">
        <div class="form-outer">
            <div class="form-header stuck-header">
                <div class="form-header-inner">
                    <div class="left my-4 mx-2 ">
                        <div class="columns is-flex is-align-items-center">
                            <VControl class="mr-2" icon="feather:search">
                                <VInput v-model="searchTitle" type="text"
                                    :placeholder="t('transaction.search_filter.title')" />
                            </VControl>
                            <VControl class="mr-2 status-input">
                                <VInput v-model="searchNote" type="text"
                                    :placeholder="t('transaction.search_filter.note')" />
                            </VControl>
                            <VIconButton class="mr-2" type="submit" v-on:click="search" icon="feather:search" />
                            <VIconButton class="mr-2" type="submit" v-on:click="resetFilter" icon="feather:rotate-ccw"
                                :raised="false" color="danger" />
                        </div>
                    </div>
                    <div class="left my-4 mx-2">
                        <div class="columns is-flex is-align-items-center">
                            <VControl class="mr-2 ">
                                <div class="select">

                                    <select v-model="perPage" @change="search">
                                        <VOption :value="default_per_page * 0.1">{{ default_per_page *
                                            0.1
                                        }}
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
                            <VControl>
                                <VButton class="" to="/add-record" color="primary"> {{ t('transaction.add_record_button') }}
                                </VButton>
                            </VControl>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</template>

<style   lang="scss">
@import '/@src/scss/styles/tableHeader.scss';
</style>
