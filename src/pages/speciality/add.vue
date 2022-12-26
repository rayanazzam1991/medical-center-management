<script setup lang="ts">
import { useHead } from "@vueuse/head"
import { useViewWrapper } from "/@src/stores/viewWrapper"

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Speciality')

const head = useHead({
    title: 'Add Speciality',
})


</script>

<template>
    <SpecialityForm :formType="'Add'" />
</template>
