<route lang="json">
{
  "meta": {
    "requiresAuth": true
  }
}
</route>
<script setup lang="ts">



</script>

<template>
  <NavbarLayout>
    <RouterView :key="$route.fullPath" />
  </NavbarLayout>
</template>
