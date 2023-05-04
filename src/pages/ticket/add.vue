<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "permissions": [
            "ticket_create"
        ]
    }
}
</route>
    
<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useI18n } from 'vue-i18n';
import { useViewWrapper } from '/@src/stores/viewWrapper';
const { t } = useI18n()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle(t('ticket.form.page_title'))
const route = useRoute()

const head = useHead({
    title: t('ticket.form.add_ticket_title'),
})


</script>

<template>
    <TicketForm :formType="'Add'" />
</template>
