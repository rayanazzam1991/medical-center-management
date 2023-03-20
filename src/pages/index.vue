<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { useAuth } from '/@src/stores/Others/User/authStore'

useHead({
  title: 'Grand Samara Beauty Center',
})
const router = useRouter();
const userAuth = useAuth();
// onBeforeMount(() => {
//   console.log("isLo1", userAuth.isLoggedIn)
//   if (userAuth.isLoggedIn) {
//     router.push({
//       name: "/dashboard/"
//     })
//   } else {
//     router.push({
//       name: '/auth/login'
//     })
//   }
// })



</script>

<template>
  <LandingLayout theme="light">

  </LandingLayout>
</template>

