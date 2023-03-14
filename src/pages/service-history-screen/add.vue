<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useI18n } from 'vue-i18n';
import { useViewWrapper } from '/@src/stores/viewWrapper';
const { t } = useI18n()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle(t('service_history_screen.form.page_title'))
const route = useRoute()

const head = useHead({
    title: t('ticket.form.add_service_history_screen_title'),
})


</script>

<template>
    <ServiceHistoryScreenForm :formType="'Add'" />
</template>
