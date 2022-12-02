<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'
const route = useRoute()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('User')
useHead({
    title: 'Edit User',
})
</script>

<template>
    <UserForm :formType="'Edit'" />

</template>
