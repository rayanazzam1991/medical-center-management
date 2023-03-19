<route lang="json">
{
  "meta": {
    "requiresAuth": true,
    "permissions": [
      "account_access"
    ]
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
