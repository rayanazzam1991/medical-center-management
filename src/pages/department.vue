<route lang="json">
{
  "meta": {
    "requiresAuth": true,
    "roles": [
      "Admin",
      "Receptionist"
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
