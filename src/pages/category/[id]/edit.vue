<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'
const route = useRoute()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Category')
useHead({
    title: 'Edit Category',
})

</script>

<template>
    <CategoryForm :key="route.path" :formType="'Edit'" />

</template>
