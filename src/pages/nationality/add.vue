<route lang="json">
{
  "meta": {
    "requiresAuth": true,
    "permissions": [
      "nationality_create"
    ]
  }
}
</route>
  
<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useI18n } from 'vue-i18n';

import { useViewWrapper } from '/@src/stores/viewWrapper'
const { t } = useI18n()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle(t('nationality.form.page_title'))

const head = useHead({
  title: t('nationality.form.add_nationality_title'),
})


</script>

<template>
  <NationalityForm :formType="'Add'" />
</template>
