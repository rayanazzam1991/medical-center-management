<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useI18n } from 'vue-i18n';
import { useViewWrapper } from '/@src/stores/viewWrapper'
const route = useRoute()
const viewWrapper = useViewWrapper()
const {t} = useI18n()
viewWrapper.setPageTitle(t('speciality.form.page_title'))
useHead({
    title: t('speciality.form.edit_speciality_title'),
})
</script>

<template>
    <SpecialityForm :formType="'Edit'" />

</template>
