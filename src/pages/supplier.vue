<route lang="json">
{
  "meta": {
    "requiresAuth": true,
    "roles": [
      "Admin",
      "Human_Resources",
      "Receptionist",
      "Inventory",
      "Service_Provider",
      "Accountant"
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
