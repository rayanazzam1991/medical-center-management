<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "permissions": [
            "inventory_access"
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
        