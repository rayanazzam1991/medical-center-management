<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "permissions": [
            "show_waiting_list_serve_client"
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
viewWrapper.setPageTitle(t('employee.waiting_list.title'))
useHead({ title: t('employee.waiting_list.title'), })
const route = useRoute()



</script>
      
<template>
    <EmployeeWaitingList employee-id-from-route />
</template>
      