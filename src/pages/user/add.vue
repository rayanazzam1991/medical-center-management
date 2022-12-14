<script setup lang="ts">
import { useHead } from '@vueuse/head'

import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('User')

const head = useHead({
    title: 'Add User',
})


</script>

<template>
    <UserForm :formType="'Add'" />
</template>
