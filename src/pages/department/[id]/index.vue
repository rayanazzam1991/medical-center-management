<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'
const route = useRoute()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Department')
useHead({
    title: 'Department',
})
</script>

<template>
    <DepartmentDetails />

</template>
