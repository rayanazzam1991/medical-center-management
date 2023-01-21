<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useI18n } from 'vue-i18n';

import { useViewWrapper } from '/@src/stores/viewWrapper'
const {t} = useI18n()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle(t('item.form.page_title'))

const head = useHead({
    title: t('item.form.add_item_title'),
})


</script>

<template>
    <ItemForm :formType="'Add'" />
</template>
