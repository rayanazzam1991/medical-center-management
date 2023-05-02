<script lang="ts">
import { useI18n } from "vue-i18n"
import { defaultDeliveringSalariesSearchFilter, defaultOnholdSalariesSearchFilter } from "/@src/models/HR/Payroll/Salary/salary"
import { defaultCitySearchFilter, CityConsts } from "/@src/models/Others/City/city"
import { defaultPagination } from "/@src/utils/response"


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
        }

    },

    setup(props, context) {
        const {t} = useI18n()
        const default_per_page = props.default_per_page
        const pagination = props.pagination
        const perPage = ref(pagination.per_page)
        const searchFilter = ref(defaultOnholdSalariesSearchFilter)
        const search = () => {
            searchFilter.value = {
                per_page: perPage.value
            }
            context.emit('search', searchFilter.value)

        }

        return {t  , search, default_per_page, perPage, pagination, CityConsts }
    },


})




</script>

<template>
    <form class="form-layout" v-on:submit.prevent="search">
        <div class="form-outer">
            <div class="form-header stuck-header">
                <div class="form-header-inner">
                    <div class="left my-4 mx-2 ">
                        <div class="left">
                            <h3>{{ title }}</h3>
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
