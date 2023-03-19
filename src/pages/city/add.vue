<route lang="json">
{
  "meta": {
    "requiresAuth": true,
    "permissions": [
      "city_create"
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
viewWrapper.setPageTitle(t('city.form.page_title'))
const route = useRoute()

const head = useHead({
  title: t('city.form.add_city_title'),
})


</script>

<template>
  <CityForm :formType="'Add'" />
</template>
