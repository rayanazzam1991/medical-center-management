<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useI18n } from 'vue-i18n';

import { useViewWrapper } from '/@src/stores/viewWrapper'
const {t} = useI18n()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle(t('customer_group.form.page_title'))

const head =useHead({
  title: t('customer_group.form.add_customer_group_title'),
})


</script>

<template>
  <CustomerGroupForm Form :formType="'Add'"/>
</template>
