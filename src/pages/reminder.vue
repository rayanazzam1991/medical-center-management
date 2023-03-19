<route lang="json">
{
    "meta": {
        "requiresAuth": true,
        "permissions": [
            "reminder_access"
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
            