<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "permissions": [
            "reminder_edit"
        ]
    }
}
</route>
    
<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useI18n } from 'vue-i18n';
import { useViewWrapper } from '/@src/stores/viewWrapper'
const route = useRoute()
const viewWrapper = useViewWrapper()
const { t } = useI18n()
viewWrapper.setPageTitle(t('reminder.form.page_title'))
useHead({
    title: t('reminder.form.edit_reminder_title'),
})
</script>

<template>
    <ReminderForm :formType="'Edit'" />
</template>
