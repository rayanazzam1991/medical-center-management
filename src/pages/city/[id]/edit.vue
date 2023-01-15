<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useI18n } from 'vue-i18n';
import { useViewWrapper } from '/@src/stores/viewWrapper'
const route = useRoute()
const {t} = useI18n()

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle(t('city.form.page_title'))
useHead({
  title: t('city.form.edit_city_title'),
})

</script>

<template>
  <CityForm :key="route.path" :formType="'Edit'" />

</template>
