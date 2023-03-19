<route lang="json">
{
  "meta": {
    "requiresAuth": true,
    "permissions": [
      "social_media_access"
    ]
  }
}
</route>
  
<script setup lang="ts">
const route = useRoute()


</script>

<template>
  <NavbarLayout>
    <RouterView />
  </NavbarLayout>
</template>
