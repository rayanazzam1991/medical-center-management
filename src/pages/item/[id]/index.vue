<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Item')
useHead({
    title: 'Item',
})
</script>

<template>
    <ItemDetails />

</template>
