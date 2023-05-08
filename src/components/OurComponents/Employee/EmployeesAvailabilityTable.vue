<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { useNotyf } from '/@src/composable/useNotyf'
import { Notyf } from 'notyf'
import { useI18n } from 'vue-i18n'
import { getEmployeesAvailability, resetEmployeesAvailabilitySearchFilter, toggleEmployeeAvailability } from '/@src/services/Employee/employeeService'
import { EmployeesWithAvailabilityDepartment } from '/@src/models/Employee/employee'
import { useEmployee } from '/@src/stores/Employee/employeeStore'
import { EmployeesAvailabilitySearchFilter } from '/@src/models/Employee/employeeHistory'

const viewWrapper = useViewWrapper()
const { t } = useI18n()
const notif = useNotyf() as Notyf
const searchFilter = ref(resetEmployeesAvailabilitySearchFilter())
const availabilityList = ref<Array<EmployeesWithAvailabilityDepartment>>([])
const employeeStore = useEmployee()
const keyIncrement = ref(0)
const keyIncrement2 = ref(0)
const router = useRouter()
const isExpanded = ref(false)
const isLoading = ref(false)
const toggleExpand = () => {
    isExpanded.value = !isExpanded.value
    keyIncrement2.value++
}

onMounted(async () => {
    isLoading.value = true
    const { employees_avaiability } = await getEmployeesAvailability(searchFilter.value)
    availabilityList.value = employees_avaiability
    keyIncrement.value = keyIncrement.value + 1
    isLoading.value = false
});

const search = async (newSearchFilter: EmployeesAvailabilitySearchFilter) => {
    isLoading.value = true
    console.log(isLoading.value)
    const { employees_avaiability } = await getEmployeesAvailability(newSearchFilter)
    availabilityList.value = employees_avaiability
    searchFilter.value = newSearchFilter
    isLoading.value = false
}
const resetFilter = async (newSearchFilter: EmployeesAvailabilitySearchFilter) => {
    searchFilter.value = newSearchFilter
    await search(searchFilter.value)
}
const toggleAvailability = async (employeeId: number) => {
    isLoading.value = true
    const { message, success } = await toggleEmployeeAvailability(employeeId)
    if (success) {
        notif.success(t('toast.success.edit'))
        await search(searchFilter.value)
    } else {
        notif.error({ message: message, duration: 3000 })
    }
    isLoading.value = false

}
</script>

<template>
    <EmployeesAvailabilityTableHeader :key="keyIncrement" :title="viewWrapper.pageTitle" @search="search"
        :isLoading="isLoading" @toggleExpand="toggleExpand" @resetFilter="resetFilter" />
    <VLoader :hidden="!isLoading" size="xl" :active="isLoading">
        <div class="loader-layout">
        </div>
    </VLoader>
    <div v-if="availabilityList.length != 0" :class="[isLoading && 'is-hidden']" class="layout">
        <EmployeeAvailabilityDepartmentCollapse :items="availabilityList" with-chevron :key="keyIncrement2"
            @toggleAvailability="toggleAvailability" :is_expanded="isExpanded" />
    </div>
    <div v-else :class="[isLoading && 'is-hidden']" class="layout">
        <VPlaceholderSection :title="t('tables.placeholder.title')" :subtitle="t('tables.placeholder.subtitle')"
            class="my-6">
        </VPlaceholderSection>

    </div>
</template>

<style scoped lang="scss">
.layout {
    flex: 1;
    display: inline-block;
    width: 100%;
    padding: 20px;
    background-color: var(--white);
    border-radius: var(--radius-large);
    border: 1px solid var(--fade-grey-dark-3);
    transition: all .3s;

}

.loader-layout {
    width: 100%;
    height: 300px;
    background-color: var(--white);
    border-radius: var(--radius-large);
    border: 1px solid var(--fade-grey-dark-3);

}

.is-dark {

    .layout,
    .loader-layout {
        background: var(--dark-sidebar-light-6);
        border-color: var(--dark-sidebar-light-12);
    }

}
</style>