
<script setup lang="ts">
import { useHead } from "@vueuse/head"
import { useViewWrapper } from "/@src/stores/viewWrapper"

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Department')

const head = useHead({
    title: 'Add Department',
})


</script>

<template>
    <DepartmentForm :formType="'Add'" />
</template>
