<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper';

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Category')
const route = useRoute()

const head = useHead({
    title: 'Add Category',
})


</script>

<template>
    <CategoryForm :formType="'Add'" />
</template>
