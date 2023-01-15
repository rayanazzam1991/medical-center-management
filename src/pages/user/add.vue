<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useI18n } from 'vue-i18n';

import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
const {t} = useI18n()
viewWrapper.setPageTitle(t('user.form.page_title'))

const head = useHead({
    title: t('user.form.add_user_title'),
})


</script>

<template>
    <UserForm :formType="'Add'" />
</template>
