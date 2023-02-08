<script lang="ts">
import { useI18n } from "vue-i18n"
import { DateConsts } from "/@src/models/HR/Attendance/Date/date"
import { defaultReviewGenerateSalariesRequestBody, defaultSalarySearchFilter } from "/@src/models/HR/Payroll/Salary/salary"
import { defaultCitySearchFilter, CityConsts } from "/@src/models/Others/City/city"
import { Department, DepartmentSearchFilter } from "/@src/models/Others/Department/department"
import { getDepartmentsList } from "/@src/services/Others/Department/departmentService"
import { defaultPagination } from "/@src/utils/response"
import Datepicker from '@vuepic/vue-datepicker';
import { useDarkmode } from '/@src/stores/darkmode';
import { DatePicker } from "v-calendar"


export default defineComponent({
  props: {
    title: {
      type: String,
      default: "",
    },
    button_name: {
      type: String,
      default: "",
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
    const { t, locale } = useI18n();
    const dark = useDarkmode();
    const month = ref({
      month: new Date().getMonth(),
      year: new Date().getFullYear()
    });
    const default_per_page = props.default_per_page;
    const pagination = props.pagination;
    const searchName = ref("");
    const iconArrow = locale.value == "ar" ? { left: "lnir lnir-chevron-right", right: "lnir lnir-chevron-left" } : { left: "lnir lnir-chevron-left", right: "lnir lnir-chevron-right" };
    const perPage = ref(pagination.per_page);
    const searchDepartment = ref();
    const searchFilter = ref(defaultSalarySearchFilter);
    const selectedMonth = ref(defaultReviewGenerateSalariesRequestBody);
    selectedMonth.value.month = new Date().getMonth() + 1;
    selectedMonth.value.year = new Date().getFullYear();
    const search = () => {
      searchFilter.value = {
        name: searchName.value,
        department_id: searchDepartment.value,
        per_page: perPage.value
      };
      context.emit("search", selectedMonth.value, searchFilter.value);
    };
    const departmentsList = ref<Department[]>([]);
    onMounted(async () => {
      let departmentSearchFilter = {} as DepartmentSearchFilter;
      departmentSearchFilter.per_page = 500;
      const { departments } = await getDepartmentsList(departmentSearchFilter);
      departmentsList.value = departments;
    });
    const updateSelectedMonth = async () => {
      selectedMonth.value.month = month.value.month + 1;
      selectedMonth.value.year = month.value.year;
      search();
    };
    const resetFilter = () => {
      searchName.value = "";
      searchDepartment.value = undefined;
      searchFilter.value.name = undefined;
      searchFilter.value.department_id = undefined;
      context.emit("resetFilter", searchFilter.value);
    };
    return { t, locale, dark, month, iconArrow, updateSelectedMonth, resetFilter, search, default_per_page, searchName, searchDepartment, selectedMonth, perPage, pagination, departmentsList };
  },
  components: { Datepicker },
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
                <VInput v-model="searchName" type="text" :placeholder="t('salary.search_filter.name')" />
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
              <VIconButton class="mr-2" v-on:click="resetFilter" icon="feather:rotate-ccw" :raised="false"
                color="danger" />
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
              <Datepicker v-model="month" :cancel-text="t('date_picker.cancel')" :locale="locale" month-picker
                :select-text="t('date_picker.select')" class="date-picker-dircetion mr-2" :dark="dark.isDark"
                @update:model-value="updateSelectedMonth">
                <template #arrow-left>
                  <i :class="iconArrow.left" aria-hidden="true"></i>
                </template>
                <template #arrow-right>
                  <i :class="iconArrow.right" aria-hidden="true"></i>
                </template>

              </Datepicker>
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
@import '@vuepic/vue-datepicker/dist/main.css';
@import '/@src/scss/styles/customDatePicker.scss';
</style>
