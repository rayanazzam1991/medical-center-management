<route lang="json">
{
  "meta": {
    "requiresAuth": true,
    "permissions": [
      "variable_payment_create"
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
viewWrapper.setPageTitle(t('variable_payment.form.page_title'))
const route = useRoute()

const head = useHead({
  title: t('variable_payment.form.add_variable_payment_title'),
})


</script>

<template>
  <VariablePaymentForm :formType="'Add'" />
</template>
