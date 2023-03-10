<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useI18n } from 'vue-i18n';
import { useViewWrapper } from '/@src/stores/viewWrapper';
const { t } = useI18n()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle(t('reminder.form.page_title'))
const route = useRoute()

const head = useHead({
    title: t('reminder.form.add_reminder_title'),
})


</script>

<template>
    <ReminderForm :formType="'Add'" />
</template>
