<script lang="ts">
import { useI18n } from "vue-i18n"
import { defaultServiceHistoryScreenSearchFilter } from "/@src/models/Sales/ServiceHistoryScreen/serviceHistoryScreen"
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
        const perPage = ref(pagination.per_page)
        const searchFilter = ref(defaultServiceHistoryScreenSearchFilter)
        const search = () => {
            searchFilter.value = {
                per_page: perPage.value
            }

            context.emit('search', searchFilter.value)
        }

        const resetFilter = () => {

            context.emit('resetFilter', searchFilter.value)

        }
        return { t, resetFilter, search, default_per_page, perPage, pagination, }
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
                            <VIconButton class="mr-2" v-on:click="resetFilter" icon="feather:rotate-ccw" :raised="false"
                                color="danger" />

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
