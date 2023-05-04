<route lang="json">
{
  "meta": {
    "requiresAuth": true,
    "permissions": [
      "income_statement_generate"
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
