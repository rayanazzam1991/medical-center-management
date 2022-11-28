<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'
const route = useRoute()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('UserStatus')
useHead({
    title: 'Edit UserStatus',
})
</script>

<template>
    <UserStatusForm :formType="'Edit'" />

</template>
