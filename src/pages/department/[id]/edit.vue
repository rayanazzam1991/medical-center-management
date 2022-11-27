<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'
const route = useRoute()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Department')
useHead({
    title: 'Edit Department',
})
</script>

<template>
    <DepartmentForm :formType="'Edit'" />

</template>
