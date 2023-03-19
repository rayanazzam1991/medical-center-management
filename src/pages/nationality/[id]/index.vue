<route lang="json">
{
  "meta": {
    "requiresAuth": true,
    "permissions": [
      "nationality_create"
    ]
  }
}
</route>
  
<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Nationality')
useHead({
  title: 'Nationality',
})
</script>

<template>
  <NationalityDetails />
</template>
