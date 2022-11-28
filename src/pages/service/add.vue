<script setup lang="ts">
import { useHead } from '@vueuse/head'

import { useViewWrapper } from '/@src/stores/viewWrapper'

const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Service')

const head =useHead({
  title: 'Add Service',
})


</script>

<template>
  <ServiceForm :formType="'Add'"/>
</template>
