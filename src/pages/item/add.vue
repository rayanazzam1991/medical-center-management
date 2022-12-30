<script setup lang="ts">
import { useHead } from '@vueuse/head'

import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Item')

const head = useHead({
    title: 'Add Item',
})


</script>

<template>
    <ItemForm :formType="'Add'" />
</template>
