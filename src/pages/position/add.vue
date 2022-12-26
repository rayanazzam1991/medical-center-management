<script setup lang="ts">
import { useHead } from "@vueuse/head"
import { useViewWrapper } from "/@src/stores/viewWrapper"

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Position')

const head = useHead({
    title: 'Add Position',
})


</script>

<template>
    <PositionForm :formType="'Add'" />
</template>
