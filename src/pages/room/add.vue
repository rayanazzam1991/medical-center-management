<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useI18n } from 'vue-i18n';
import { useViewWrapper } from '/@src/stores/viewWrapper';

const viewWrapper = useViewWrapper()
const {t} = useI18n()
viewWrapper.setPageTitle(t('room.form.page_title'))

const head = useHead({
    title: t('room.form.add_room_title'),
})


</script>

<template>
    <RoomForm :formType="'Add'" />
</template>
