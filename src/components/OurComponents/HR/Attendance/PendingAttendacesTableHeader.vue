<script lang="ts">
import { defaultUserStatusSearchFilter, UserStatus } from '/@src/models/Others/UserStatus/userStatus'
import { getUserStatusesList } from '/@src/services/Others/UserStatus/userstatusService'
import { defaultPagination } from '/@src/utils/response'
import {
    AttendanceConsts,
    defaultEmployeeAttendanceSearchFilter,
    EmployeeAttendanceSearchFilter
} from '/@src/models/HR/Attendance/EmployeeAttendance/employeeAttendance'
import { DateConsts } from '/@src/models/HR/Attendance/Date/date'
import { getDaysPerMonth } from '/@src/services/HR/Attendance/Date/dateService'
import { useI18n } from 'vue-i18n'
import { isNumber } from '/@src/composable/helpers/isNumberCheck'
import Datepicker from '@vuepic/vue-datepicker';
import { useDarkmode } from '/@src/stores/darkmode';

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
        const dark = useDarkmode();
        const month = ref({
            month: new Date().getMonth(),
            year: new Date().getFullYear()
        });

        const { t, locale } = useI18n()

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
        const searchFilter = ref(defaultEmployeeAttendanceSearchFilter)
        const is_reseted = ref(false)
        const keyIncrement = ref(0)
        const quickSearch = async () => {
            if (quickSearchField.value != '') {

                searchFilter.value.name = quickSearchField.value
                if (isNumber(quickSearchField.value)) {
                    searchFilter.value.phone_number = Number(quickSearchField.value)
                } else {
                    searchFilter.value.phone_number = undefined
                }
                searchFilter.value.quick_search = true
            } else {
                searchFilter.value.phone_number = undefined
                searchFilter.value.name = undefined
                searchFilter.value.quick_search = undefined
            }
            searchFilter.value.per_page = perPage.value
            await search()
        }


        const search = async () => {
            searchFilter.value.per_page = perPage.value
            searchFilter.value.page = 1
            context.emit('search', searchFilter.value)
        }
        const search_filter = (value: EmployeeAttendanceSearchFilter) => {
            searchFilter.value = value
            searchFilter.value.per_page = perPage.value
            context.emit('search', searchFilter.value)
        }

        const resetFilter = () => {
            searchFilter.value.name = undefined
            searchFilter.value.phone_number = undefined
            searchFilter.value.position_id = undefined
            searchFilter.value.attendance_from = undefined
            searchFilter.value.attendance_to = undefined
            searchFilter.value.user_status_id = undefined
            searchFilter.value.department_id = undefined
            searchFilter.value.quick_search = undefined
            quickSearchField.value = ''
            is_reseted.value = true
            keyIncrement.value++
            context.emit('resetFilter', searchFilter.value)

        }
        const resetFilter_popup = () => {
            searchFilter.value.name = undefined
            searchFilter.value.phone_number = undefined
            searchFilter.value.position_id = undefined
            searchFilter.value.attendance_from = undefined
            searchFilter.value.attendance_to = undefined
            searchFilter.value.user_status_id = undefined
            searchFilter.value.department_id = undefined
            context.emit('resetFilter', searchFilter.value)

        }
        const statusesList = ref<UserStatus[]>([])
        onMounted(async () => {
            const { userstatuses } = await getUserStatusesList(defaultUserStatusSearchFilter)
            statusesList.value = userstatuses
        })
        return {
            dark,
            month,
            locale,
            t,
            AttendanceConsts,
            keyIncrement,
            quickSearch,
            quickSearchField,
            is_reseted,
            default_per_page,
            onOpen,
            resetFilter_popup,
            search_filter,
            popUpTrigger,
            statusesList,
            resetFilter,
            search,
            searchFilterPop,
            perPage,
            pagination
        }

    },
    components: { Datepicker },
})
</script>

<template>
    <form class="form-layout" v-on:submit.prevent="quickSearch">
        <div class="form-outer">
            <div class="form-header stuck-header">
                <h1 class="title">
                    {{ t('pending_attendances.table.title') }}
                </h1>
                <div class="form-header-inner">
                    <div class="left mx-2 ">
                        <div class="columns is-flex is-align-items-center">
                            <VControl class="mr-2" icon="feather:search">
                                <VInput v-model="quickSearchField"
                                    :placeholder="t('pending_attendances.search_filter.quick_search')" type="text" />
                            </VControl>
                            <VIconButton class="mr-2" icon="feather:search" type="submit" />
                            <VIconButton class="mr-2" icon="fas fa-filter" @click.prevent="onOpen" />
                            <VIconButton :raised="false" class="mr-2" color="danger" icon="feather:rotate-ccw"
                                v-on:click="resetFilter" />

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
        <PendingAttendanceSearchFilterModal :key="keyIncrement" :search_filter_popup="searchFilterPop"
            @resetFilter="resetFilter_popup" @search="search_filter" @search_filter_popup="popUpTrigger" />
    </form>
</template>

<style scoped lang="scss" >
@import '/@src/scss/styles/tableHeader.scss';

.title {
    font-family: var(--font-alt);
    font-size: 1.25rem;
    margin-top: 1rem;

}
</style>
