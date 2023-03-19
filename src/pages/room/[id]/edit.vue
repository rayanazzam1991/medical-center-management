<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "permissions": [
            "room_edit"
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
viewWrapper.setPageTitle(t('room.form.page_title'))
useHead({
    title: t('room.form.edit_room_title'),
})
</script>

<template>
    <RoomForm :formType="'Edit'" />
</template>
