<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useI18n } from 'vue-i18n';
import { useViewWrapper } from '/@src/stores/viewWrapper'
const route = useRoute()
const viewWrapper = useViewWrapper()
const {t} = useI18n()
viewWrapper.setPageTitle(t('social_media.form.page_title'))
useHead({
  title: t('social_media.form.edit_social_media_title')
})
</script>

<template>
  <SocialMediaForm :formType="'Edit'" />

</template>
