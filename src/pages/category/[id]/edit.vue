<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useI18n } from 'vue-i18n';
import { useViewWrapper } from '/@src/stores/viewWrapper'

const route = useRoute()
const {t} = useI18n()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle(t('category.form.page_title'))
useHead({
    title: t('category.form.edit_category_title'),
})

</script>

<template>
    <CategoryForm :key="route.path" :formType="'Edit'" />

</template>
