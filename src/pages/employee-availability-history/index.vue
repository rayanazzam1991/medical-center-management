<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "permissions": [
            "employees_availability_history_list"
        ]
    }
}
</route>
          
<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useI18n } from 'vue-i18n';
import { useViewWrapper } from '/@src/stores/viewWrapper';
const { t } = useI18n()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle(t('employee_availability_history.table.title'))
const route = useRoute()

const head = useHead({
    title: t('employee_availability_history.table.title'),
})


</script>
      
<template>
    <EmployeeAvailabilityHistoryTable />
</template>
      