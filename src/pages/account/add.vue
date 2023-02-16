<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useI18n } from 'vue-i18n';
import { useViewWrapper } from '/@src/stores/viewWrapper';

const viewWrapper = useViewWrapper()
const { t } = useI18n()
viewWrapper.setPageTitle(t('account.form.page_title'))

const head = useHead({
  title: t('account.form.add_account_title'),
})


</script>

<template>
  <AccountForm :formType="'Add'" />
</template>
