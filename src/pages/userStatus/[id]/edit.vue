<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useI18n } from 'vue-i18n';
import { useViewWrapper } from '/@src/stores/viewWrapper'
const route = useRoute()
const viewWrapper = useViewWrapper()
const {t} = useI18n()
viewWrapper.setPageTitle(t('user_status.form.page_title'))
useHead({
    title: t('user_status.form.edit_user_status_title'),
})
</script>

<template>
    <UserStatusForm :formType="'Edit'" />

</template>
