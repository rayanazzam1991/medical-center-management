<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "permissions": [
            "role_access"
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
        