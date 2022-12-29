<script lang="ts">
import { EmployeeSearchFilter } from '/@src/models/Employee/employee'
import { defaultEmployeeScheduleSearchFilter, EmployeeScheduleSearchFilter } from '/@src/models/HR/Attendance/employeeSchedule'
import { UserStatus, defaultUserStatusSearchFilter } from '/@src/models/Others/UserStatus/userStatus'
import { getUserStatusesList } from '/@src/services/Others/UserStatus/userstatusService'
import { defaultPagination } from '/@src/utils/response'



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
        const onOpen = () => {
            searchFilterPop.value = !searchFilterPop.value
            quickSearchField.value = ''
            context.emit('onOpen', searchFilterPop.value)
        }
        const popUpTrigger = (value: boolean) => {
            searchFilterPop.value = value
        }

        const default_per_page = props.default_per_page
        const pagination = props.pagination
        const searchFilterPop = ref(false)
        const quickSearchField = ref('')
        const perPage = ref(pagination.per_page)
        const searchFilter = ref(defaultEmployeeScheduleSearchFilter)
        const is_reseted = ref(false)
        const keyIncrement = ref(0)
        const quickSearch = () => {
            if (quickSearchField.value != '') {

                searchFilter.value.name = quickSearchField.value
                if (isNumber(quickSearchField.value)) {
                    searchFilter.value.phone_number = Number(quickSearchField.value)
                }
                else {
                    searchFilter.value.phone_number = undefined
                }
                searchFilter.value.quick_search = true
            } else {
                searchFilter.value.phone_number = undefined
                searchFilter.value.name = undefined
                searchFilter.value.quick_search = undefined
            }
            searchFilter.value.per_page = perPage.value

            search()
        }
        function isNumber(str: string): boolean {
            if (typeof str !== 'string') {
                return false;
            }

            if (str.trim() === '') {
                return false;
            }

            return !Number.isNaN(Number(str));
        }

        const search = () => {
            searchFilter.value.per_page = perPage.value
            context.emit('search', searchFilter.value)
        }
        const search_filter = (value: EmployeeScheduleSearchFilter) => {
            searchFilter.value = value
            searchFilter.value.per_page = perPage.value
            context.emit('search', searchFilter.value)
        }

        const resetFilter = () => {
            searchFilter.value.name = undefined
            searchFilter.value.phone_number = undefined
            searchFilter.value.position_id = undefined
            searchFilter.value.schedule_from = undefined
            searchFilter.value.schedule_to = undefined
            searchFilter.value.user_status_id = undefined
            searchFilter.value.department_id = undefined
            searchFilter.value.quick_search = undefined
            quickSearchField.value = ''
            is_reseted.value = true
            keyIncrement.value++
            context.emit('resetFilter', searchFilter.value)

        }
        const resetFilter_popup = (value: EmployeeSearchFilter) => {
            searchFilter.value.name = undefined
            searchFilter.value.phone_number = undefined
            searchFilter.value.position_id = undefined
            searchFilter.value.schedule_from = undefined
            searchFilter.value.schedule_to = undefined
            searchFilter.value.user_status_id = undefined
            searchFilter.value.department_id = undefined
            context.emit('resetFilter', searchFilter.value)

        }
        const statusesList = ref<UserStatus[]>([])
        onMounted(async () => {
            const { userstatuses } = await getUserStatusesList(defaultUserStatusSearchFilter)
            statusesList.value = userstatuses
        })
        return { keyIncrement, quickSearch, quickSearchField, is_reseted, default_per_page, onOpen, resetFilter_popup, search_filter, popUpTrigger, statusesList, resetFilter, search, searchFilterPop, perPage, pagination }
    },
})
</script>

<template>
    <form class="form-layout" v-on:submit.prevent="quickSearch">
        <div class="form-outer">
            <div class="form-header stuck-header">
                <div class="form-header-inner">
                    <div class="left my-4 mx-2 ">
                        <div class="columns is-flex is-align-items-center">
                            <VControl class="mr-2" icon="feather:search">
                                <VInput v-model="quickSearchField" type="text" placeholder="Name/Number..." />
                            </VControl>
                            <VIconButton class="mr-2" @click.prevent="onOpen" icon="fas fa-filter" />
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
        <EmployeeScheduleSearchFilterModal :key="keyIncrement" :search_filter_popup="searchFilterPop"
            @search_filter_popup="popUpTrigger" @search="search_filter" @resetFilter="resetFilter_popup" />
    </form>
</template>

<style scoped  lang="scss">
@import '/@src/scss/styles/tableHeader.scss';
</style>
