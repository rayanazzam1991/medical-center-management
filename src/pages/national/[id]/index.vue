<route lang="json">
{
  "meta": {
    "requiresAuth": true,
    "permissions": [
      "service_show"
    ]
  }
}
</route>

<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'
const route = useRoute()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('National')
useHead({
  title: 'National',
})
</script>

<template>
  <NationalDetails />
</template>
