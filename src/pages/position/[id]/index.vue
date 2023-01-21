<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useI18n } from 'vue-i18n';
import { useViewWrapper } from '/@src/stores/viewWrapper'
const route = useRoute()
const {t} = useI18n()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle(t('position.table.title'))
useHead({
    title: t('position.table.title'),
})
</script>

<template>
    <PositionDetails />

</template>
