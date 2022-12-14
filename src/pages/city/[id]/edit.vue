<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'
import { keyIncrement } from '/@src/utils/force-rerender';
const route = useRoute()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('City')
useHead({
  title: 'Edit City',
})

</script>

<template>
  <CityForm :key="route.path" :formType="'Edit'" />

</template>
