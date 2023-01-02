<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Item')
useHead({
    title: 'Edit Item',
})
</script>

<template>
    <ItemForm :formType="'Edit'" />

</template>
