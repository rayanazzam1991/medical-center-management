<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "permissions": [
            "transaction_create"
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
        