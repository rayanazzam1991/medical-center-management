<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useI18n } from 'vue-i18n';

import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
const {t} = useI18n()
viewWrapper.setPageTitle(t('social_media.form.page_title'))

const head =useHead({
  title: t('social_media.form.add_social_media_title'),
})


</script>

<template>
  <SocialMediaForm Form :formType="'Add'"/>
</template>
