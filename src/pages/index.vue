<script setup lang="ts">
import { useHead } from '@vueuse/head'

useHead({
  title: 'Grand Samara Beauty Center',
})
const router = useRouter();

  router.push({
    name: '/dashboard/'
  })

</script>

<template>
  <LandingLayout theme="light">
    
  </LandingLayout>
</template>

