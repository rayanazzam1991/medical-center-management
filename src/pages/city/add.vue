<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper';

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('City')
const route = useRoute()

const head = useHead({
  title: 'Add City',
})


</script>

<template>
  <CityForm :formType="'Add'" />
</template>
