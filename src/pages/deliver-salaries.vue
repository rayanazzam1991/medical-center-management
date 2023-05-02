<route lang="json">
{
  "meta": {
    "requiresAuth": true,
    "permissions": [
      "deliver_salary_list"
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
    