<route lang="json">
{
  "meta": {
    "requiresAuth": true,
    "permissions": [
      "pending_ticket_list"
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
