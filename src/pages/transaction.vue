<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "permissions": [
            "transaction_acess"
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
        