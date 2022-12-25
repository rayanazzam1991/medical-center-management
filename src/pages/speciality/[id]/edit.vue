<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'
const route = useRoute()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Speciality')
useHead({
    title: 'Edit Speciality',
})
</script>

<template>
    <SpecialityForm :formType="'Edit'" />

</template>
