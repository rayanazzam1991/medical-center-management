<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useI18n } from 'vue-i18n';
import { useViewWrapper } from '/@src/stores/viewWrapper'
const viewWrapper = useViewWrapper()
const {t} = useI18n()
viewWrapper.setPageTitle(t('item.form.page_title'))
useHead({
    title: t('item.form.edit_item_title'),
})
</script>

<template>
    <ItemForm :formType="'Edit'" />

</template>
