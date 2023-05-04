<route lang="json">
{
  "meta": {
    "requiresAuth": true,
    "permissions": [
      "employee_variable_payment_edit"
    ]
  }
}
</route>
  
<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useI18n } from 'vue-i18n';
import { useViewWrapper } from '/@src/stores/viewWrapper'
const route = useRoute()
const { t } = useI18n()

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle(t('employee_variable_payment.form.page_title'))
useHead({
  title: t('employee_variable_payment.form.edit_employee_variable_payment_title'),
})

</script>

<template>
  <EmployeeVariablePaymentForm :key="route.path" :formType="'Edit'" />
</template>
