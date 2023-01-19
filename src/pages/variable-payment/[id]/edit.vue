<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useI18n } from 'vue-i18n';
import { useViewWrapper } from '/@src/stores/viewWrapper'
const route = useRoute()
const {t} = useI18n()

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle(t('variable_payment.form.page_title'))
useHead({
  title: t('variable_payment.form.edit_variable_payment_title'),
})

</script>

<template>
  <VariablePaymentForm :key="route.path" :formType="'Edit'" />

</template>
