<script lang="ts">
import { defaultPagination } from "/@src/utils/response"
import { useI18n } from "vue-i18n"
import { getUsersList, getUsersWithoutCustomerList } from "/@src/services/Others/User/userService"
import { User, UserSearchFilter } from "/@src/models/Others/User/user"
import { defaultEmployeeHistorySearchFilter, EmployeeHistorySearchFilter, EmployeesAvailabilitySearchFilter } from "../../../models/Employee/employeeHistory"
import { getEmployeesList, resetEmployeesAvailabilitySearchFilter } from "/@src/services/Employee/employeeService"
import { UserStatusConsts } from "/@src/models/Others/UserStatus/userStatus"
import { EmployeeSearchFilter } from "/@src/models/Employee/employee"
import { Employee } from "/@src/models/Employee/employee"
import { useEmployee } from "/@src/stores/Employee/employeeStore"

export default defineComponent({
    props: {
        title: {
            type: String,
            default: '',
        },
        isExpand: {
            type: Boolean,
            default: false
        },
        isLoading: {
            type: Boolean,
            default: false

        }
    },
    setup(props, context) {
        const { t } = useI18n()

        const onOpen = () => {
            searchFilterPop.value = !searchFilterPop.value
            context.emit('onOpen', searchFilterPop.value)
        }
        const popUpTrigger = (value: boolean) => {
            searchFilterPop.value = value
        }
        const searchFilterPop = ref(false)
        const employeeStore = useEmployee()
        const keyIncrement = ref(0)
        const searchEmployeesId = ref<number[] | undefined>(undefined)
        const isExpanded = ref(false)
        isExpanded.value = props.isExpand
        const searchFilter = ref(resetEmployeesAvailabilitySearchFilter())
        const search = () => {
            searchFilter.value = {
                employees_id: searchEmployeesId.value,
            }
            context.emit('search', searchFilter.value)
        }
        const resetFilter = () => {
            searchEmployeesId.value = undefined
            searchFilter.value.employees_id = undefined
            searchFilter.value.department_id = undefined
            searchFilter.value.is_available = undefined
            searchFilter.value.room_id = undefined
            keyIncrement.value++
            context.emit('resetFilter', searchFilter.value)
        }
        const toggle = () => {
            isExpanded.value = !isExpanded.value
            context.emit('toggleExpand', isExpanded.value)

        }

        const search_filter = (value: EmployeesAvailabilitySearchFilter) => {
            searchFilter.value = value
            context.emit('search', searchFilter.value)
        }
        const resetFilter_popup = (value: EmployeesAvailabilitySearchFilter) => {
            searchFilter.value.employees_id = undefined
            searchFilter.value.department_id = undefined
            searchFilter.value.is_available = undefined
            searchFilter.value.room_id = undefined
            context.emit('resetFilter', searchFilter.value)

        }
        return { t, resetFilter, onOpen, popUpTrigger, resetFilter_popup, getUsersList, getUsersWithoutCustomerList, search_filter, searchFilterPop, employeeStore, toggle, search, keyIncrement, searchEmployeesId, getEmployeesList, UserStatusConsts }
    },
})
</script>

<template>
    <form class="form-layout" v-on:submit.prevent="search">
        <div class="form-outer">
            <div class="form-header stuck-header">
                <h1 class="title">
                    {{ t('employee_availability.title') }}
                </h1>

                <div class="form-header-inner">
                    <div class="left my-4 mx-2 ">
                        <div class="columns is-flex is-align-items-center">
                            <VControl class="mr-2 width">
                                <Multiselect :key="keyIncrement" v-model="searchEmployeesId" mode="multiple"
                                    :placeholder="t('employee_availability.search_filter.employee')" :can-clear="true"
                                    :close-on-select="false" :filter-results="false" :min-chars="0" :resolve-on-load="false"
                                    :infinite="true" :rtl="true" :clear-on-search="true" :delay="0" :searchable="true"
                                    :hide-selected="false" :limit="20" :options="async (query: any) => {
                                        let employeeSearchFilter = {
                                            is_service_provider: true,
                                            per_page: 100,
                                            user_status_id: UserStatusConsts.ACTIVE,
                                            name: query,
                                        } as EmployeeSearchFilter
                                        //@ts-ignore
                                        const data = await getEmployeesList(employeeSearchFilter)
                                        //@ts-ignore
                                        return data.employees.map((employee: Employee) => {
                                            return { value: employee.id, label: employee.user.first_name + ' ' + employee.user.last_name }
                                        })
                                    }"
                                    @open="(select$: any) => { if (select$.noOptions) { select$.resolveOptions() } }" />
                            </VControl>
                            <VIconButton class="mr-2" type="submit" v-on:click="search" icon="feather:search" />
                            <VIconButton class="mr-2" type="submit" v-on:click="resetFilter" icon="feather:rotate-ccw"
                                :raised="false" color="danger" />
                            <VIconButton class="mr-2" @click.prevent="onOpen" icon="fas fa-filter" />

                        </div>
                    </div>
                    <div class="left my-4 mx-2">
                        <div class="columns is-flex is-align-items-center">
                            <VButton class="mr-2" :loading="$props.isLoading" color="primary" @click="toggle">{{
                                t('trial_balance_report.expand_collapse_button') }} </VButton>

                        </div>
                    </div>

                </div>
            </div>
        </div>
        <EmployeeAvailabilitySearchFilterModal :key="keyIncrement" :search_filter_popup="searchFilterPop"
            @search_filter_popup="popUpTrigger" @search="search_filter" @resetFilter="resetFilter_popup" />
    </form>
</template>

<style scoped  lang="scss">
@import '/@src/scss/styles/tableHeader.scss';

.width {
    width: 230px;
}

.title {
    font-family: var(--font-alt);
    font-size: 1.25rem;
    margin-top: 1rem;

}
</style>

