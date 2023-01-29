<script lang="ts">
import { useI18n } from "vue-i18n"
import { DateConsts } from "/@src/models/HR/Attendance/Date/date"
import { defaultReviewGenerateSalariesRequestBody, defaultSalarySearchFilter } from "/@src/models/HR/Payroll/Salary/salary"
import { defaultCitySearchFilter, CityConsts } from "/@src/models/Others/City/city"
import { Department, DepartmentSearchFilter } from "/@src/models/Others/Department/department"
import { getDepartmentsList } from "/@src/services/Others/Department/departmentService"
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
        const perPage = ref(pagination.per_page)
        const searchDepartment = ref()
        const searchFilter = ref(defaultSalarySearchFilter)
        const selectedMonth = ref(defaultReviewGenerateSalariesRequestBody)
        selectedMonth.value.month = new Date().getMonth() + 1
        selectedMonth.value.year = new Date().getFullYear()
        const months = DateConsts.MONTHS
        const search = () => {
            searchFilter.value = {
                name: searchName.value,
                department_id: searchDepartment.value,
                per_page: perPage.value
            }
            context.emit('search', selectedMonth.value, searchFilter.value)

        }
        const departmentsList = ref<Department[]>([])
        onMounted(async () => {
            let departmentSearchFilter = {} as DepartmentSearchFilter
            departmentSearchFilter.per_page = 500
            const { departments  } = await getDepartmentsList(departmentSearchFilter)
            departmentsList.value = departments
        })

        const resetFilter = () => {
            searchName.value = ''
            searchDepartment.value = undefined
            searchFilter.value.name = undefined
            searchFilter.value.department_id = undefined

            context.emit('resetFilter', searchFilter.value)

        }
        return { t, resetFilter, search, default_per_page,months, searchName, searchDepartment, selectedMonth, perPage, pagination ,departmentsList }
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
                                    :placeholder="t('salary.search_filter.name')" />
                            </VControl>
                            <VControl class="mr-2 status-input">
                                <VSelect v-model="searchDepartment" class="">
                                    <VOption value="">{{ t('salary.search_filter.department') }}</VOption>
                                    <VOption v-for="department in departmentsList" :key="department.id" :value="department.id">{{
                                        department.name
                                    }}
                                    </VOption>
                                </VSelect>
                            </VControl>
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
                            <VControl class="mr-2">
                                <VSelect v-model="selectedMonth.month">
                                    <VOption :key="index" v-for="(month, index) in months"
                                        :value="(index + 1).toString()">
                                        {{
                                           t(`dates.months.${month.toLowerCase()}`) 
                                        }}</VOption>
                                </VSelect>
                            </VControl>
                            <VControl class="mr-2">
                                <VSelect v-model="selectedMonth.year">
                                    <VOption :key="year" v-for="year in (100)" :value="year + 2000">{{ year + 2000 }}
                                    </VOption>
                                </VSelect>
                            </VControl>
                            <VControl>
                                <VButton class="" @click="search" color="primary">{{ button_name }}
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
