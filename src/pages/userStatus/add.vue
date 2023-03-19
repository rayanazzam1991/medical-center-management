<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "permissions": [
            "user_status_create"
        ]
    }
}
</route>
    
<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useI18n } from 'vue-i18n';

import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
const { t } = useI18n()
viewWrapper.setPageTitle(t('user_status.form.page_title'))

const head = useHead({
    title: t('user_status.form.add_user_status_title'),
})


</script>

<template>
    <UserStatusForm :formType="'Add'" />
</template>
