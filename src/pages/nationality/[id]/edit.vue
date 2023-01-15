<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useI18n } from 'vue-i18n';
import { useViewWrapper } from '/@src/stores/viewWrapper'
const viewWrapper = useViewWrapper()
const {t} = useI18n()
viewWrapper.setPageTitle(t('nationality.form.page_title'))
useHead({
  title: t('nationality.form.edit_nationality_title'),
})
</script>

<template>
  <NationalityForm :formType="'Edit'" />

</template>
