<route lang="json">
{
  "meta": {
    "requiresAuth": true,
    "permissions": [
      "social_media_show"
    ]
  }
}
</route>
  
<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useViewWrapper } from '/@src/stores/viewWrapper'
const route = useRoute()
const viewWrapper = useViewWrapper()
viewWrapper.setPageTitle('Social Media')
useHead({
  title: 'Social Media',
})
</script>

<template>
  <SocialMediaDetails />
</template>
