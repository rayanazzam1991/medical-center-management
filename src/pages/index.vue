<script lang="ts" setup>
import {useHead} from '@vueuse/head'

useHead({
  title: 'Home Page',
})
const router = useRouter();
router.push({
  path: '/dashboard/'
})
</script>

<template>

</template>
