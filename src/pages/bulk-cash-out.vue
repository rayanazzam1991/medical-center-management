<route lang="json">
{
  "meta": {
    "requiresAuth": true,
    "permissions": [
      "wallet_movement_create"
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
      