<route lang="json">
{
  "meta": {
    "requiresAuth": true,
    "roles": [
      "All"
    ]
  }
}
</route>
<script setup lang="ts">
const route = useRoute()


</script>

<template>
  <NavbarLayout>
    <RouterView :key="$route.fullPath" />
  </NavbarLayout>
</template>
