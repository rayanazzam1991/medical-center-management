<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Nationality')
useHead({
  title: 'Edit Nationality',
})
</script>

<template>
  <NationalityForm :formType="'Edit'" />

</template>
