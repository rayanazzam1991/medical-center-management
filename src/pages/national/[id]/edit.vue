<route lang="json">
{
  "meta": {
    "requiresAuth": true,
    "permissions": [
      "service_edit"
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
viewWrapper.setPageTitle(t('national.form.page_title'))
useHead({
  title: t('national.form.edit_national_title'),
})
</script>

<template>
  <NationalForm :formType="'Edit'" />
</template>
