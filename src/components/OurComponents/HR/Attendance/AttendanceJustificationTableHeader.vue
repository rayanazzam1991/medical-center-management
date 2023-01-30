<script lang="ts">
import { useI18n } from "vue-i18n"
import { defaultAttendanceJustificationSearchFilter } from "/@src/models/HR/Attendance/AttendanceJustification/attendanceJustification"
import { defaultCitySearchFilter, CityConsts } from "/@src/models/Others/City/city"
import { defaultPagination } from "/@src/utils/response"


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
        const searchName = ref('')
        const searchCreatorName = ref('')
        const perPage = ref(pagination.per_page)
        const searchFilter = ref(defaultAttendanceJustificationSearchFilter)
        const search = () => {
            searchFilter.value = {
                name: searchName.value,
                creator_name: searchCreatorName.value,
                per_page: perPage.value
            }
            context.emit('search', searchFilter.value)

        }

        const resetFilter = () => {
            searchName.value = ''
            searchCreatorName.value = ''
            searchFilter.value.name = undefined
            searchFilter.value.creator_name = undefined

            context.emit('resetFilter', searchFilter.value)

        }
        return { t, resetFilter, search, default_per_page, searchName, searchCreatorName, perPage, pagination }
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
                                <VInput v-model="searchName" type="text"
                                    :placeholder="t('attendance_justification.search_filter.name')" />
                            </VControl>
                            <VControl class="mr-2" icon="feather:search">
                                <VInput v-model="searchCreatorName" type="text"
                                    :placeholder="t('attendance_justification.search_filter.creator_name')" />
                            </VControl>
                            <VIconButton class="mr-2" type="submit" v-on:click="search" icon="feather:search" />
                            <VIconButton class="mr-2" v-on:click="resetFilter" icon="feather:rotate-ccw"
                                :raised="false" color="danger" />
                        </div>
                    </div>
                    <div class="left my-4 mx-2">
                        <div class="columns is-flex is-align-items-center">
                            <VControl class="mr-2 ">
                                <div class="select">

                                    <select v-model="perPage" @change="search">
                                        <VOption :value="default_per_page * 0.1">{{
                                            default_per_page *
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
